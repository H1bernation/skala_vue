import { defineStore } from 'pinia'
import axios from 'axios'

// OpenWeatherMap 조회에 쓰는 17개 시도 좌표 시드 데이터.
// alias: 정식 명칭에 포함되지 않는 흔히 쓰는 축약 이름(검색용). 예) "강원특별자치도"는 "강원도"를 포함하지 않는다.
// activityStore(야외활동 지수)도 같은 좌표를 쓰기 때문에 export해서 공유한다.
export const sidoCoordinates = [
  { id: 'seoul', name: '서울특별시', alias: '서울', lat: 37.5665, lng: 126.978 },
  { id: 'busan', name: '부산광역시', alias: '부산', lat: 35.1796, lng: 129.0756 },
  { id: 'daegu', name: '대구광역시', alias: '대구', lat: 35.8714, lng: 128.6014 },
  { id: 'incheon', name: '인천광역시', alias: '인천', lat: 37.4563, lng: 126.7052 },
  { id: 'gwangju', name: '광주광역시', alias: '광주', lat: 35.1595, lng: 126.8526 },
  { id: 'daejeon', name: '대전광역시', alias: '대전', lat: 36.3504, lng: 127.3845 },
  { id: 'ulsan', name: '울산광역시', alias: '울산', lat: 35.5384, lng: 129.3114 },
  { id: 'sejong', name: '세종특별자치시', alias: '세종', lat: 36.48, lng: 127.289 },
  { id: 'gyeonggi', name: '경기도', alias: '경기', lat: 37.4138, lng: 127.5183 },
  { id: 'gangwon', name: '강원특별자치도', alias: '강원도', lat: 37.8228, lng: 128.1555 },
  { id: 'chungbuk', name: '충청북도', alias: '충북', lat: 36.8, lng: 127.7 },
  { id: 'chungnam', name: '충청남도', alias: '충남', lat: 36.5184, lng: 126.8 },
  { id: 'jeonbuk', name: '전북특별자치도', alias: '전북', lat: 35.7175, lng: 127.153 },
  { id: 'jeonnam', name: '전라남도', alias: '전남', lat: 34.8679, lng: 126.991 },
  { id: 'gyeongbuk', name: '경상북도', alias: '경북', lat: 36.4919, lng: 128.8889 },
  { id: 'gyeongnam', name: '경상남도', alias: '경남', lat: 35.4606, lng: 128.2132 },
  { id: 'jeju', name: '제주특별자치도', alias: '제주도', lat: 33.4996, lng: 126.5312 },
]

// OpenWeatherMap 날씨 상태(main)를 카드에 쓰는 이모지로 단순 매핑한다.
const WEATHER_EMOJI = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '🌫️',
}

// OpenWeatherMap Air Pollution API가 주는 aqi는 1~5(Good~Very Poor) 5단계라,
// 사용자가 바로 이해할 수 있는 4단계 표현으로 압축해서 보여준다.
const AQI_STATUS = {
  1: '좋음',
  2: '보통',
  3: '나쁨',
  4: '매우 나쁨',
  5: '매우 나쁨',
}
function getAirQualityStatus(aqi) {
  return AQI_STATUS[aqi] || '정보 없음'
}

// OpenWeatherMap Current Weather API로 실시간 날씨를, Air Pollution API로 대기질을 불러와 관리한다.
// Home과 Detail이 서로 다른 컴포넌트 인스턴스라도 같은 데이터를 공유하도록 Pinia로 뒀다.
export const useWeatherStore = defineStore('weather', {
  state: () => ({
    weatherList: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchWeatherList() {
      this.isLoading = true
      this.error = null
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
      try {
        const [weatherResponses, airResponses] = await Promise.all([
          Promise.all(
            sidoCoordinates.map((sido) =>
              axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                  lat: sido.lat,
                  lon: sido.lng,
                  appid: apiKey,
                  units: 'metric',
                  lang: 'kr',
                },
              }),
            ),
          ),
          Promise.all(
            sidoCoordinates.map((sido) =>
              axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
                params: {
                  lat: sido.lat,
                  lon: sido.lng,
                  appid: apiKey,
                },
              }),
            ),
          ),
        ])
        this.weatherList = weatherResponses.map((response, index) => {
          const sido = sidoCoordinates[index]
          const data = response.data
          const air = airResponses[index].data.list[0]
          return {
            id: sido.id,
            name: sido.name,
            alias: sido.alias,
            lat: sido.lat,
            lng: sido.lng,
            temp: Math.round(data.main.temp),
            status: data.weather[0].description,
            emoji: WEATHER_EMOJI[data.weather[0].main] || '🌡️',
            humidity: data.main.humidity,
            pm10: Math.round(air.components.pm10),
            pm25: Math.round(air.components.pm2_5),
            airQuality: getAirQualityStatus(air.main.aqi),
          }
        })
      } catch (err) {
        console.error('날씨 데이터를 가져오지 못했습니다:', err)
        this.error = '날씨 데이터를 불러오지 못했습니다. API 키를 확인해주세요.'
      } finally {
        this.isLoading = false
      }
    },
  },
})
