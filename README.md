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

## 과제 3. Weather Component

과제 2까지 하나의 파일(`WeatherComposition.vue`)에 몰려 있던 날씨 기능을 `WeatherParents.vue`, `SearchBar.vue`, `WeatherCard.vue`, `BaseDashboardCard.vue`, `HotThresholdControl.vue`로 분리했습니다. 기존 상태·로직·디자인은 그대로 유지하고, UI 단위로 컴포넌트만 나눴습니다.

### 요구사항 구현

#### 1. WeatherParents.vue - 상태와 로직을 부모에 유지

기존에 관리하던 `searchQuery`, `selectedCityInfo`, `weatherList`, `hotThreshold`, `filteredWeatherList`(`computed`), `hotCityCount`(`computed`), `watch(selectedCityInfo)`, `watch(hotThreshold)`, `watchEffect(searchQuery)`, `showDetail()`을 모두 `WeatherParents.vue`에 그대로 유지했습니다. 화면만 자식 컴포넌트로 나누고, 자식이 emit한 이벤트를 `handleUpdateQuery`, `handleSelectCard`, `handleClickDetail`, `handleUpdateThreshold`에서 받아 실제 상태를 변경합니다.

#### 2. SearchBar.vue - 검색 UI 분리

검색 input과 "입력한 도시" 표시 영역을 `SearchBar.vue`로 옮겼습니다. 부모의 `searchQuery`를 `query` prop(String, required)으로 전달받아 입력값과 안내 문구에 사용하고, `searchQuery`를 직접 수정하는 대신 입력이 발생하면 `update-query` 이벤트로 새 값을 부모에 전달합니다.

```vue
<SearchBar :query="searchQuery" @update-query="handleUpdateQuery" />
```

#### 3. WeatherCard.vue - 날씨 카드 UI 분리

날씨 카드 한 장을 `WeatherCard.vue`로 분리했습니다. 부모는 `filteredWeatherList`를 `v-for`로 순회하며 `weather` 객체를 통째로 Object Prop으로 전달합니다.

```vue
<WeatherCard
  v-for="weather in filteredWeatherList"
  :key="weather.id"
  :weather="weather"
  @select-card="handleSelectCard"
  @click-detail="handleClickDetail"
/>
```

카드를 클릭하면 `select-card` 이벤트로 `weather.name`을 emit하고, 상세보기 버튼을 클릭하면 `click-detail` 이벤트로 `weather.humidity`를 emit합니다. 상세보기 버튼에는 기존과 동일하게 `@click.stop`을 적용해 상세보기 클릭이 카드 선택으로 이어지지 않도록 했습니다. 온도에 따른 위험해요/더워요/괜찮아요/선선해요 조건도 그대로 유지했습니다.

#### 4. BaseDashboardCard.vue - 공통 Dashboard 레이아웃

검색 영역, 더운 도시 기준 영역, 날씨 목록 영역에서 공통으로 쓰는 카드형 레이아웃을 `BaseDashboardCard.vue`로 분리했습니다. 별도의 상태나 날씨 데이터를 다루지 않고 default slot으로 내부 콘텐츠를 그대로 렌더링합니다.

```vue
<BaseDashboardCard>
  <SearchBar :query="searchQuery" @update-query="handleUpdateQuery" />
</BaseDashboardCard>
```

Slot 안에 위치한 `SearchBar`, `HotThresholdControl`, `WeatherCard`는 `BaseDashboardCard`가 아니라 `WeatherParents.vue`의 Template에서 작성되므로, 부모와 직접 Props/Emits로 연결됩니다.

#### 5. style scoped 분리

`WeatherParents.vue`에 몰려 있던 CSS를 역할에 따라 나눴습니다.

- `SearchBar.vue`: `search-bar`, `search-input`, `search-result`
- `WeatherCard.vue`: `weather-card`, `weather-info`, `weather-emoji`, `weather-city`, `weather-temp`, `weather-status`, `weather-condition`, `condition-danger`/`condition-hot`/`condition-good`/`condition-cool`, `detail-button`
- `HotThresholdControl.vue`: `threshold-section`, `threshold-label`, `threshold-input` 관련 스타일
- `BaseDashboardCard.vue`: 공통 카드 컨테이너(`dashboard-card`) 스타일
- `WeatherParents.vue`: `weather-page`, `weather-header`, `summary-badge`, `selected-status`, `weather-list`, `empty-state` 등 페이지 레이아웃 스타일

디자인은 기존과 동일하게 유지하고, 스타일이 위치하는 파일만 컴포넌트 책임에 맞게 옮겼습니다.

#### 6. HotThresholdControl.vue - 추가 컴포넌트

기존에 구현해 둔 "더운 도시 기준 온도" 기능(`hotThreshold`, `hotCityCount`)을 `HotThresholdControl.vue`로 분리했습니다. `hotThreshold`와 `hotCityCount`를 각각 Number prop으로 전달받아 입력값과 결과 문구를 표시하고, 사용자가 기준 온도를 바꾸면 `update-threshold` 이벤트로 새 값을 emit합니다. 부모는 `handleUpdateThreshold`에서 이 값을 받아 `hotThreshold`를 갱신합니다.

### 트러블슈팅

#### 1. SearchBar 분리 후 부모 상태 직접 접근 문제

기존에는 한 파일 안에서 `searchQuery`를 바로 수정했지만, `SearchBar`를 별도 컴포넌트로 분리하고 나니 자식에서 부모의 `searchQuery`에 직접 접근할 수 없었습니다. Vue 컴포넌트는 서로 독립적이어서 자식이 부모의 반응형 상태를 직접 변경할 수 없기 때문입니다. 부모의 현재 검색어는 `query` prop으로 `SearchBar`에 내려주고, 사용자가 입력한 새 검색어는 `update-query` 이벤트의 payload로 부모에 전달한 뒤 `handleUpdateQuery`에서 `searchQuery`를 갱신하도록 구성해 해결했습니다.

#### 2. emit에 어떤 값을 전달해야 하는지 혼동

처음에는 `emit('update-query', props.query)`처럼 부모가 이미 내려준 `query` 값을 그대로 다시 보내려 했습니다. `props.query`는 부모가 내려준 현재 값일 뿐, 사용자가 방금 입력창에 입력한 새 값이 아니었습니다. input 이벤트의 `$event.target.value`로 실제 입력된 값을 가져와 `update-query`의 payload로 전달하도록 수정했습니다.

#### 3. WeatherCard의 Props 전달 단위 결정

처음에는 `name`, `emoji`, `temp`, `status`를 각각 개별 prop으로 나눠 전달하려 했습니다. `weather` 데이터가 이미 도시 하나의 정보를 객체 하나로 묶어 관리하고 있었기 때문에, 개별 값 대신 `weather` 객체 자체를 Object Prop 하나로 전달하고 `WeatherCard` 내부에서 `weather.name`, `weather.temp`처럼 필요한 값에 접근하는 방식으로 정리했습니다.

#### 4. v-for와 WeatherCard 역할 분리

`WeatherCard`를 컴포넌트로 분리하면서 `v-for`를 자식 쪽으로 옮겨야 하는지 헷갈렸습니다. `filteredWeatherList`를 가지고 있는 것은 부모이므로, `v-for`는 계속 `WeatherParents.vue`에 남기고 반복되던 `div.weather-card` 마크업만 `WeatherCard` 컴포넌트로 바꾸는 방식으로 정리했습니다. 각 반복에서는 `:weather="weather"`로 현재 순회 중인 `weather` 객체를 넘겨줍니다.

---

## 과제 4. Weather Router

Vue Router를 도입해 그동안 `WeatherParents.vue` 하나에 몰려 있던 날씨 대시보드를 `/`(대시보드), `/weather/:cityId`(상세), `/about`(소개) 세 개의 URL로 나누고, 정의되지 않은 경로는 404 페이지로 처리했습니다.

### 요구사항 구현

#### 1. router/index.js - 라우트 설계

`WeatherHomeView`, `WeatherAboutView`, `WeatherDetailView`, `NotFoundView` 네 개 라우트를 모두 동적 `import()`로 Lazy Loading 처리했습니다. 정의되지 않은 모든 경로는 `path: '/:pathMatch(.*)*'` Catch-all Route로 `NotFoundView`에 연결했습니다.

```js
{
  path: '/weather/:cityId',
  name: 'weather-detail',
  component: () => import('../views/WeatherDetailView.vue'),
},
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('../views/NotFoundView.vue'),
},
```

#### 2. App.vue - Practice 탭 내부에 Router 연결

기존 Practice/Challenge 탭 구조는 그대로 유지하고, Practice 탭에서 `WeatherParents`를 직접 렌더링하던 자리만 `RouterLink` 내비게이션과 `RouterView`로 교체했습니다. `WeatherParents.vue` 파일 자체는 삭제하지 않고 더 이상 import하지 않는 상태로 남겨뒀습니다.

```vue
<nav class="weather-nav">
  <RouterLink to="/">날씨 대시보드</RouterLink>
  <RouterLink to="/about">서비스 소개</RouterLink>
</nav>
<RouterView />
```

#### 3. WeatherHomeView.vue - WeatherParents 역할 이전 + Programmatic Navigation

`WeatherParents.vue`의 상태(`searchQuery`, `selectedCityInfo`, `hotThreshold`)와 로직(`filteredWeatherList`, `hotCityCount`, watch/watchEffect)을 그대로 옮겼습니다. 상세보기 클릭 시 `alert()`으로 습도를 띄우던 방식을 제거하고, `useRouter()`로 얻은 `router` 인스턴스로 `/weather/:cityId`에 Programmatic Navigation하도록 바꿨습니다.

```js
const handleClickDetail = (cityId) => {
  router.push('/weather/' + cityId)
}
```

이를 위해 `WeatherCard.vue`가 `click-detail` 이벤트로 emit하던 값도 `weather.humidity`에서 `weather.id`로 바꿨습니다. (상세보기 화면 이동에는 습도가 아니라 도시 식별자가 필요하기 때문입니다.)

#### 4. WeatherDetailView.vue - 동적 세그먼트로 도시 조회

`useRoute()`로 URL의 `cityId`를 읽고, `onMounted` 시점에 `weatherList.find((weather) => weather.id === route.params.cityId)`로 일치하는 도시를 찾아 화면에 표시합니다. 일치하는 도시가 없으면 "해당 도시 정보를 찾을 수 없습니다" 문구를 보여줍니다. 도시 목록 Mock Data는 별도 공유 파일로 분리하지 않고 `WeatherHomeView.vue`와 동일한 배열을 각 View에 인라인으로 선언했습니다.

#### 5. WeatherAboutView.vue / NotFoundView.vue

`WeatherAboutView.vue`에는 서비스 소개 문구와 `/`로 돌아가는 `RouterLink`를 넣었습니다. `NotFoundView.vue`는 Catch-all Route에 연결되어, 존재하지 않는 경로 접근 시 안내 문구와 함께 `/`로 돌아가는 링크를 보여줍니다.

### 트러블슈팅

> 아래 2건은 이번 구현 중 실제로 발생한 오류는 아니고, 초보자가 이 구조를 직접 작성할 때 놓치기 쉬운 지점을 미리 정리한 것입니다.

#### 1. click-detail emit 값을 humidity 그대로 두고 라우팅하는 실수

`WeatherCard.vue`의 상세보기 버튼은 원래 `emit('click-detail', props.weather.humidity)`처럼 습도 값을 emit하고 있었습니다. 이 emit 값을 그대로 둔 채 `router.push('/weather/' + humidity)`를 호출하면, URL에는 도시 `id`(`city_01` 등)가 아니라 습도 숫자(`70` 등)가 들어가게 됩니다.

이 경우 `WeatherDetailView.vue`의 `weatherList.find((weather) => weather.id === route.params.cityId)`는 항상 실패해서 "해당 도시 정보를 찾을 수 없습니다" 문구만 뜨게 됩니다. 화면에 보여주는 값(습도)과 라우팅에 필요한 식별자(`id`)가 다르다는 점을 구분해서, `WeatherCard.vue`의 emit 값을 `props.weather.id`로 바꿔야 합니다.

#### 2. 같은 컴포넌트를 가리키는 동적 라우트 사이를 이동할 때 화면이 갱신되지 않는 문제

`WeatherDetailView.vue`는 도시 조회 로직을 `onMounted` 안에서만 실행합니다. 지금은 상세 페이지에서 다른 도시의 상세 페이지로 곧장 이동하는 링크가 없어서 문제가 되지 않지만, 만약 나중에 그런 링크(`/weather/city_01` → `/weather/city_02`)를 추가하면 Vue Router는 같은 컴포넌트를 재사용하기 때문에 `onMounted`가 다시 실행되지 않고, 화면은 이전 도시 정보를 계속 보여주게 됩니다.

이런 상황을 대비하려면 `onMounted` 대신(또는 추가로) `watch(() => route.params.cityId, ...)`로 `cityId` 변경을 감시해서 도시를 다시 조회해야 합니다. "컴포넌트가 마운트될 때 한 번"과 "라우트 파라미터가 바뀔 때마다"는 다른 시점이라는 점이 Vue Router에서 자주 헷갈리는 부분입니다.

---
