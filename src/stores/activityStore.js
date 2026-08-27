import { defineStore } from 'pinia'
import axios from 'axios'
import { sidoCoordinates } from './weatherStore'

// 기온이 이 범위 안에 있으면 야외활동에 부담이 없다고 보고 감점하지 않는다.
const IDEAL_TEMP_MIN = 18
const IDEAL_TEMP_MAX = 24

// 기온이 이상 범위를 벗어난 정도에 비례해 감점한다(최대 40점).
function getTempPenalty(temp) {
  if (temp >= IDEAL_TEMP_MIN && temp <= IDEAL_TEMP_MAX) return 0
  const diff = temp < IDEAL_TEMP_MIN ? IDEAL_TEMP_MIN - temp : temp - IDEAL_TEMP_MAX
  return Math.min(40, Math.round(diff * 2))
}

// UV 지수 등급(자외선 지수 공식 등급 기준)에 따라 단계적으로 감점한다.
function getUvPenalty(uvIndex) {
  if (uvIndex <= 2) return 0
  if (uvIndex <= 5) return 10
  if (uvIndex <= 7) return 20
  if (uvIndex <= 10) return 35
  return 45
}

// 풍속(km/h)이 강할수록 야외활동이 불편해진다고 보고 감점한다.
function getWindPenalty(windSpeed) {
  if (windSpeed <= 15) return 0
  if (windSpeed <= 25) return 10
  if (windSpeed <= 40) return 20
  return 30
}

// 기온/UV/풍속 감점을 100점에서 빼서 0~100 사이의 야외활동 지수를 만든다.
// 계산 로직을 store 액션과 분리해 두면 기준값만 보고도 점수 산출 방식을 바로 확인할 수 있다.
export function calculateActivityScore({ temp, windSpeed, uvIndex }) {
  const score = 100 - getTempPenalty(temp) - getUvPenalty(uvIndex) - getWindPenalty(windSpeed)
  return Math.max(0, Math.min(100, score))
}

// 점수 구간별로 보여줄 상태 문구.
export function getActivityMessage(score) {
  if (score >= 80) return '야외활동 하기 아주 좋아요'
  if (score >= 60) return '야외활동 하기 괜찮아요'
  if (score >= 40) return '야외활동 시 주의가 필요해요'
  return '야외활동을 피하는 게 좋아요'
}

// Open-Meteo API로 17개 시도의 기온/풍속/UV를 한 번의 요청으로 받아
// 시도별 야외활동 지수를 계산해 관리한다. API Key가 필요 없어 Vercel 정적 배포에서도 그대로 동작한다.
export const useActivityStore = defineStore('activity', {
  state: () => ({
    activityList: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchActivityList() {
      this.isLoading = true
      this.error = null
      try {
        // Open-Meteo는 위도/경도를 콤마로 이어 보내면 지역별 결과를 배열로 한 번에 돌려준다.
        const latitudes = sidoCoordinates.map((sido) => sido.lat).join(',')
        const longitudes = sidoCoordinates.map((sido) => sido.lng).join(',')
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: latitudes,
            longitude: longitudes,
            current: 'temperature_2m,wind_speed_10m',
            daily: 'uv_index_max',
            timezone: 'Asia/Seoul',
          },
        })
        // 응답 배열의 순서는 요청한 위도/경도 순서와 같으므로 index로 시도와 매칭한다.
        this.activityList = response.data.map((forecast, index) => {
          const sido = sidoCoordinates[index]
          const temp = forecast.current.temperature_2m
          const windSpeed = forecast.current.wind_speed_10m
          const uvIndex = forecast.daily.uv_index_max[0]
          const score = calculateActivityScore({ temp, windSpeed, uvIndex })
          return {
            id: sido.id,
            name: sido.name,
            temp,
            windSpeed,
            uvIndex,
            score,
            message: getActivityMessage(score),
          }
        })
      } catch (err) {
        console.error('야외활동 지수를 가져오지 못했습니다:', err)
        this.error = '야외활동 지수를 불러오지 못했습니다.'
      } finally {
        this.isLoading = false
      }
    },
  },
})
