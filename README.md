# Vue.js 과제

## 실행 방법

```bash
npm install
npm run dev
```

이후 터미널에 출력되는 로컬 주소(기본값 `http://localhost:5173`)로 접속하면 됩니다.

## 과제 1. Weather Mockup

지역별 날씨 데이터를 활용한 Weather Mockup을 구현했습니다.

![Weather Mockup 실행 화면](docs/images/weather-mockup.png)

### 요구사항 구현

#### 1. 배열 렌더링

`weatherList`에 여러 도시의 날씨 데이터를 저장하고 `v-for`를 사용해 도시별 날씨 카드를 반복 출력했습니다.

각 항목은 도시별 고유 `id`를 `:key`에 바인딩했습니다.

```vue
v-for="weather in weatherList" :key="weather.id"
```

#### 2. 조건부 렌더링

`v-if / v-else-if / v-else`를 사용해 온도에 따라 다른 상태를 표시했습니다.

온도에 따라 상태를 4단계로 구분했습니다.

- 34℃ 이상: 위험해요
- 30℃ 이상: 더워요
- 25℃ 이상: 괜찮아요
- 25℃ 미만: 선선해요

#### 3. 한글 도시 입력

`v-model` 대신 `:value`와 `@input`을 사용해 한글 도시명을 입력받고 화면에 출력했습니다.

```vue
<input :value="searchCity" @input="(e) => (searchCity = e.target.value)" />
```

#### 4. 카드 선택 및 상세보기 이벤트

날씨 카드를 클릭하면 해당 도시명을 `selectedCity`에 저장해 선택된 도시를 화면에 표시했습니다.

카드 내부의 상세보기 버튼에는 `@click.stop`을 적용해 부모 카드의 클릭 이벤트로 버블링되지 않도록 구현했습니다.

상세보기 버튼 클릭 시 해당 도시의 습도를 Alert로 확인할 수 있습니다.

#### 5. 개인 데이터 추가

기본 날씨 데이터에 `humidity`를 추가했습니다.

추가한 습도 데이터를 상세보기 기능과 연결하여 실제 Mockup 기능에서 활용했습니다.

---

## 과제 2. Weather Composition

Composition API(`ref`, `computed`, `watch`, `watchEffect`)를 활용해 날씨 데이터의 검색과 상태 추적 기능을 구현했습니다.

### 요구사항 구현

#### 1. 반응형 상태 관리

`searchQuery`, `selectedCityInfo`, `weatherList`를 `ref()` 기반 반응형 상태로 관리했습니다.

#### 2. computed를 활용한 도시 검색

`filteredWeatherList`를 `computed`로 구현해 `weatherList`에서 도시 이름에 `searchQuery`가 포함된 데이터만 `filter()`했습니다.

검색어가 변경되면 검색 결과가 자동으로 갱신되며, Template에서는 원본 `weatherList`가 아니라 `filteredWeatherList`를 `v-for`로 렌더링합니다.

#### 3. watch / watchEffect 활용

`watch(selectedCityInfo)`로 선택 도시가 변경될 때 이전 값과 새로운 값을 Console에 출력했습니다.

`watchEffect`로 `searchQuery`의 변경을 자동 추적해 입력 중인 검색어를 Console에 출력했습니다.

#### 4. 검색 결과 표시

검색어가 비어 있으면 전체 도시 목록을, 일치하는 도시가 있으면 해당 도시만 표시합니다.

`filteredWeatherList.length === 0`이면 "검색 결과와 일치하는 도시가 없습니다." 문구를 출력하며, 이 조건은 `v-for` 내부가 아니라 목록 전체 상태를 판단할 수 있도록 `v-for` 외부에 배치했습니다.

#### 5. 개인 추가 기능 - 더운 도시 기준 온도

`hotThreshold`(기본값 30)를 기준으로 `weatherList`에서 해당 온도 이상인 도시 개수를 `hotCityCount`(`computed`)로 계산했습니다.

`watch(hotThreshold)`로 기준 온도가 변경될 때 이전 값과 새로운 값을 Console에 출력했습니다.

`input type="number"`와 `v-model.number="hotThreshold"`로 사용자가 화면에서 기준 온도를 직접 변경할 수 있으며, 값이 바뀌면 `hotCityCount`가 자동으로 다시 계산되어 화면의 "더운 도시 : N개"가 갱신됩니다.

### 트러블슈팅

#### 1. watch가 실행되지 않는 문제

도시 카드를 눌러도 `watch(selectedCityInfo)`의 Console 로그가 출력되지 않았습니다. 원인은 `App.vue`가 아직 과제 1의 `WeatherMockup.vue`를 렌더링하고 있어 수정 중이던 `WeatherComposition.vue`가 실제로는 실행되지 않고 있었기 때문입니다.

`App.vue`의 import와 Template 렌더링 대상을 `WeatherComposition.vue`로 변경해 해결했습니다. 내부 로직이 정상인데 동작하지 않는 경우, 현재 실제로 렌더링되고 있는 컴포넌트를 먼저 확인할 필요가 있습니다.

#### 2. 검색 결과 없음 문구가 표시되지 않는 문제

검색 결과가 0개인데도 "검색 결과와 일치하는 도시가 없습니다." 문구가 보이지 않았습니다. 문구용 `v-if`를 `v-for` 내부에 배치하면 `filteredWeatherList`가 빈 배열일 때 `v-for` 자체가 0번 실행되어 내부의 `v-if`도 검사될 기회가 없기 때문입니다.

`v-if`를 `v-for` 바깥으로 옮겨 해결했습니다. `v-for` 내부의 `v-if`는 각 아이템의 상태를 판단할 때, 목록이 비었는지처럼 전체 목록의 상태를 판단할 때는 `v-for` 외부에서 처리해야 합니다.

#### 3. filter 사용 시 배열과 개별 객체 혼동

`hotCityCount` 구현 과정에서 `weatherList.value.temp`처럼 배열 전체에서 `temp`에 접근하려 했습니다. `weatherList.value`는 배열이고 `temp`는 배열 내부의 각 weather 객체에 있으므로, `filter((weather) => weather.temp >= hotThreshold.value)` 형태로 개별 객체의 속성을 확인하도록 수정했습니다.

#### 4. computed 검색 결과와 v-for의 역할 분리

처음에는 `v-for`에 `weatherList.value.filter(...)` 필터식을 직접 넣어야 하는지 혼동했습니다. `filteredWeatherList`라는 `computed`에서 검색 결과를 계산하고, Template의 `v-for`에서는 계산된 `filteredWeatherList`만 렌더링하도록 역할을 분리했습니다.

---
