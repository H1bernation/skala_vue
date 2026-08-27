# Vue.js 과제 - Weather Dashboard

## 프로젝트 소개

SKALA Vue.js 수업의 Hands-on 과제를 진행하면서 만든 날씨 대시보드다. 처음에는 정적인 배열을 화면에 뿌리기만 하는 Mockup이었는데, 과제를 하나씩 거치면서 반응형 상태(Composition API) → 컴포넌트 분리(Props/Emits) → 페이지 라우팅(Vue Router) → 전역 상태 관리(Pinia) 순서로 같은 화면을 계속 다시 다듬어왔다. 그래서 하나의 프로젝트 안에 지금까지 배운 Vue 문법이 단계별로 쌓여 있다.

## 실행 방법

```bash
npm install
npm run dev
```

터미널에 출력되는 로컬 주소(기본값 `http://localhost:5173`)로 접속하면 된다.

## 주요 추가 기능

- 도시별 날씨 카드 목록, 한글 도시명 검색/필터링
- 기준 온도를 직접 입력해 "더운 도시" 개수 확인 (섭씨/화씨 단위 전환 반영)
- 카드 클릭 시 선택 도시 표시, 상세보기 클릭 시 `/weather/:cityId` 상세 페이지로 이동
- 서비스 소개 페이지(`/about`), 정의되지 않은 경로는 404 페이지 처리
- 섭씨/화씨 단위 전환 (Pinia `configStore`)
- 도시 즐겨찾기 등록 및 "즐겨찾기만 보기" 필터 (Pinia `favoriteStore`)

## 단계별 구현 과정

<details>
<summary><h3>과제 1 - Weather Mockup</h3></summary>

### 목표

임의의 날씨 데이터 배열을 화면에 반복 출력하고, v-if/이벤트 같은 Vue 기본 문법으로 정적인 대시보드 UI를 만드는 게 목표였다.

![Weather Mockup 실행 화면](docs/images/weather-mockup.png)

### 구현 내용

**1. 배열 렌더링**

`weatherList`에 여러 도시의 날씨 데이터를 저장하고 `v-for`로 도시별 날씨 카드를 반복 출력했다. 각 항목은 도시별 고유 `id`를 `:key`에 바인딩했다.

```vue
v-for="weather in weatherList" :key="weather.id"
```

**2. 조건부 렌더링**

`v-if / v-else-if / v-else`로 온도에 따라 다른 상태를 표시했다. 온도 기준으로 4단계로 나눴다.

- 34℃ 이상: 위험해요
- 30℃ 이상: 더워요
- 25℃ 이상: 괜찮아요
- 25℃ 미만: 선선해요

**3. 한글 도시 입력**

`v-model` 대신 `:value`와 `@input`을 써서 한글 도시명을 입력받고 화면에 출력했다.

```vue
<input :value="searchCity" @input="(e) => (searchCity = e.target.value)" />
```

**4. 카드 선택 및 상세보기 이벤트**

날씨 카드를 클릭하면 해당 도시명을 `selectedCity`에 저장해 선택된 도시를 화면에 표시했다. 카드 내부 상세보기 버튼에는 `@click.stop`을 적용해 부모 카드의 클릭 이벤트로 버블링되지 않게 했다. 상세보기 버튼을 누르면 해당 도시의 습도를 Alert로 확인할 수 있다.

**5. 개인 데이터 추가**

기본 날씨 데이터에 `humidity`를 추가하고, 상세보기 기능과 연결해서 실제 Mockup에서 쓰이도록 했다.

### 주요 변경

- `src/components/hands_on/WeatherMockup.vue` 새로 작성
- `App.vue`에서 `WeatherMockup`을 렌더링하도록 연결

</details>

<details>
<summary><h3>과제 2 - Weather Composition</h3></summary>

### 목표

과제 1에서는 날씨 값과 검색어를 그냥 변수로 두고 화면에 직접 썼는데, 이번에는 Composition API(`ref`, `computed`, `watch`, `watchEffect`)로 반응형 상태를 관리하고 검색 결과를 자동으로 다시 계산하도록 바꾸는 게 목표였다.

### 구현 내용

**1. 반응형 상태 관리**

`searchQuery`, `selectedCityInfo`, `weatherList`를 `ref()` 기반 반응형 상태로 관리했다.

**2. computed를 활용한 도시 검색**

`filteredWeatherList`를 `computed`로 만들어서 `weatherList`에서 도시 이름에 `searchQuery`가 포함된 데이터만 `filter()`했다. 검색어가 바뀌면 검색 결과가 자동으로 갱신되고, Template에서는 원본 `weatherList`가 아니라 `filteredWeatherList`를 `v-for`로 렌더링한다.

**3. watch / watchEffect 활용**

`watch(selectedCityInfo)`로 선택 도시가 바뀔 때 이전 값과 새 값을 콘솔에 출력했다. `watchEffect`로는 `searchQuery` 변경을 자동으로 추적해서 입력 중인 검색어를 콘솔에 찍었다.

**4. 검색 결과 표시**

검색어가 비어 있으면 전체 도시 목록을, 일치하는 도시가 있으면 해당 도시만 표시한다. `filteredWeatherList.length === 0`이면 "검색 결과와 일치하는 도시가 없습니다." 문구를 띄우는데, 이 조건은 `v-for` 내부가 아니라 목록 전체 상태를 판단하도록 `v-for` 바깥에 뒀다.

**5. 개인 추가 기능 - 더운 도시 기준 온도**

`hotThreshold`(기본값 30)를 기준으로 `weatherList`에서 그 온도 이상인 도시 개수를 `hotCityCount`(`computed`)로 계산했다. `watch(hotThreshold)`로 기준 온도가 바뀔 때 이전/새 값을 콘솔에 출력했다. `input type="number"`와 `v-model.number="hotThreshold"`로 사용자가 직접 기준 온도를 바꾸면 `hotCityCount`가 자동으로 재계산되어 "더운 도시 : N개"가 갱신된다.

### 주요 변경

- `src/components/hands_on/WeatherComposition.vue` 새로 작성
- `App.vue`에서 `WeatherMockup` 대신 `WeatherComposition`을 렌더링하도록 교체

### Troubleshooting

**watch가 실행되지 않는 문제**

도시 카드를 눌러도 `watch(selectedCityInfo)`의 콘솔 로그가 안 찍혔다. 원인은 `App.vue`가 아직 과제 1의 `WeatherMockup.vue`를 렌더링하고 있어서, 수정 중이던 `WeatherComposition.vue`가 실제로는 실행되지 않고 있었기 때문이다. `App.vue`의 import와 Template 렌더링 대상을 `WeatherComposition.vue`로 바꿔서 해결했다. 내부 로직이 멀쩡한데 동작을 안 하면, 지금 실제로 렌더링되고 있는 컴포넌트가 맞는지부터 확인해야 한다는 걸 알았다.

**검색 결과 없음 문구가 표시되지 않는 문제**

검색 결과가 0개인데도 "검색 결과와 일치하는 도시가 없습니다." 문구가 안 보였다. 문구용 `v-if`를 `v-for` 안쪽에 두면 `filteredWeatherList`가 빈 배열일 때 `v-for` 자체가 0번 돌아서 내부의 `v-if`도 검사될 기회가 없기 때문이다. `v-if`를 `v-for` 바깥으로 옮겨서 해결했다. `v-for` 안의 `v-if`는 각 아이템 상태를 판단할 때 쓰고, 목록이 비었는지처럼 전체 상태를 판단할 때는 `v-for` 바깥에서 처리해야 한다.

**filter 사용 시 배열과 개별 객체 혼동**

`hotCityCount`를 만들다가 `weatherList.value.temp`처럼 배열 전체에서 바로 `temp`에 접근하려 했다. `weatherList.value`는 배열이고 `temp`는 그 안의 각 weather 객체에 있는 값이라, `filter((weather) => weather.temp >= hotThreshold.value)`처럼 개별 객체의 속성을 확인하는 형태로 고쳤다.

**computed 검색 결과와 v-for의 역할 분리**

처음에는 `v-for`에 `weatherList.value.filter(...)` 필터식을 직접 넣어야 하는 줄 알았다. `filteredWeatherList`라는 `computed`에서 검색 결과를 미리 계산해두고, Template의 `v-for`는 계산된 `filteredWeatherList`만 그대로 렌더링하도록 역할을 나눴다.

</details>

<details>
<summary><h3>과제 3 - Weather Component</h3></summary>

### 목표

과제 2까지 `WeatherComposition.vue` 한 파일에 몰려 있던 상태·로직·화면을 여러 컴포넌트로 쪼개서, Props로 값을 내려주고 Emits로 이벤트를 올려받는 부모/자식 흐름을 연습하는 게 목표였다. 기존 상태·로직·디자인은 그대로 두고 화면 단위만 나눴다.

### 구현 내용

**1. WeatherParents.vue - 상태와 로직을 부모에 유지**

기존에 관리하던 `searchQuery`, `selectedCityInfo`, `weatherList`, `hotThreshold`, `filteredWeatherList`(`computed`), `hotCityCount`(`computed`), `watch(selectedCityInfo)`, `watch(hotThreshold)`, `watchEffect(searchQuery)`, `showDetail()`을 전부 `WeatherParents.vue`에 그대로 뒀다. 화면만 자식 컴포넌트로 나누고, 자식이 emit한 이벤트를 `handleUpdateQuery`, `handleSelectCard`, `handleClickDetail`, `handleUpdateThreshold`에서 받아 실제 상태를 바꾼다.

**2. SearchBar.vue - 검색 UI 분리**

검색 input과 "입력한 도시" 표시 영역을 `SearchBar.vue`로 옮겼다. 부모의 `searchQuery`를 `query` prop(String, required)으로 받아 입력값과 안내 문구에 쓰고, `searchQuery`를 직접 고치는 대신 입력이 생기면 `update-query` 이벤트로 새 값을 부모에 전달한다.

```vue
<SearchBar :query="searchQuery" @update-query="handleUpdateQuery" />
```

**3. WeatherCard.vue - 날씨 카드 UI 분리**

날씨 카드 한 장을 `WeatherCard.vue`로 뺐다. 부모는 `filteredWeatherList`를 `v-for`로 돌면서 `weather` 객체를 통째로 Object Prop으로 넘긴다.

```vue
<WeatherCard
  v-for="weather in filteredWeatherList"
  :key="weather.id"
  :weather="weather"
  @select-card="handleSelectCard"
  @click-detail="handleClickDetail"
/>
```

카드를 클릭하면 `select-card` 이벤트로 `weather.name`을 emit하고, 상세보기 버튼을 누르면 `click-detail` 이벤트로 `weather.humidity`를 emit한다. 상세보기 버튼에는 그대로 `@click.stop`을 적용해서 상세보기 클릭이 카드 선택으로 안 이어지게 했다. 온도별 위험해요/더워요/괜찮아요/선선해요 조건도 그대로 유지했다.

**4. BaseDashboardCard.vue - 공통 Dashboard 레이아웃**

검색 영역, 더운 도시 기준 영역, 날씨 목록 영역에서 공통으로 쓰는 카드형 레이아웃을 `BaseDashboardCard.vue`로 뺐다. 별도 상태나 날씨 데이터는 다루지 않고 default slot으로 내부 콘텐츠를 그대로 렌더링한다.

```vue
<BaseDashboardCard>
  <SearchBar :query="searchQuery" @update-query="handleUpdateQuery" />
</BaseDashboardCard>
```

slot 안의 `SearchBar`, `HotThresholdControl`, `WeatherCard`는 `BaseDashboardCard`가 아니라 `WeatherParents.vue`의 Template에서 작성되기 때문에, 부모와 직접 Props/Emits로 연결된다.

**5. style scoped 분리**

`WeatherParents.vue`에 몰려 있던 CSS를 역할별로 나눴다.

- `SearchBar.vue`: `search-bar`, `search-input`, `search-result`
- `WeatherCard.vue`: `weather-card`, `weather-info`, `weather-emoji`, `weather-city`, `weather-temp`, `weather-status`, `weather-condition`, `condition-danger`/`condition-hot`/`condition-good`/`condition-cool`, `detail-button`
- `HotThresholdControl.vue`: `threshold-section`, `threshold-label`, `threshold-input` 관련 스타일
- `BaseDashboardCard.vue`: 공통 카드 컨테이너(`dashboard-card`) 스타일
- `WeatherParents.vue`: `weather-page`, `weather-header`, `summary-badge`, `selected-status`, `weather-list`, `empty-state` 등 페이지 레이아웃 스타일

디자인은 기존과 똑같이 두고, 스타일이 위치한 파일만 컴포넌트 책임에 맞게 옮겼다.

**6. HotThresholdControl.vue - 추가 컴포넌트**

기존에 만들어둔 "더운 도시 기준 온도" 기능(`hotThreshold`, `hotCityCount`)을 `HotThresholdControl.vue`로 뺐다. `hotThreshold`와 `hotCityCount`를 각각 Number prop으로 받아 입력값과 결과 문구를 표시하고, 사용자가 기준 온도를 바꾸면 `update-threshold` 이벤트로 새 값을 emit한다. 부모는 `handleUpdateThreshold`에서 이 값을 받아 `hotThreshold`를 갱신한다.

### 주요 변경

- `src/components/hands_on/WeatherParents.vue`, `SearchBar.vue`, `WeatherCard.vue`, `BaseDashboardCard.vue`, `HotThresholdControl.vue` 새로 작성

### Troubleshooting

**SearchBar 분리 후 부모 상태 직접 접근 문제**

기존에는 한 파일 안에서 `searchQuery`를 바로 고쳤는데, `SearchBar`를 별도 컴포넌트로 빼고 나니 자식에서 부모의 `searchQuery`에 직접 접근할 수 없었다. Vue 컴포넌트는 서로 독립적이라 자식이 부모의 반응형 상태를 직접 바꿀 수 없기 때문이다. 부모의 현재 검색어는 `query` prop으로 `SearchBar`에 내려주고, 사용자가 입력한 새 검색어는 `update-query` 이벤트의 payload로 부모에 전달한 뒤 `handleUpdateQuery`에서 `searchQuery`를 갱신하도록 구성해서 해결했다.

**emit에 어떤 값을 전달해야 하는지 혼동**

처음에는 `emit('update-query', props.query)`처럼 부모가 이미 내려준 `query` 값을 그대로 다시 보내려 했다. `props.query`는 부모가 내려준 현재 값일 뿐, 사용자가 방금 입력창에 입력한 새 값이 아니었다. input 이벤트의 `$event.target.value`로 실제 입력된 값을 가져와 `update-query`의 payload로 전달하도록 고쳤다.

**WeatherCard의 Props 전달 단위 결정**

처음에는 `name`, `emoji`, `temp`, `status`를 각각 개별 prop으로 나눠 전달하려 했다. `weather` 데이터가 이미 도시 하나의 정보를 객체 하나로 묶어 관리하고 있었기 때문에, 개별 값 대신 `weather` 객체 자체를 Object Prop 하나로 전달하고 `WeatherCard` 내부에서 `weather.name`, `weather.temp`처럼 필요한 값에 접근하는 방식으로 정리했다.

**v-for와 WeatherCard 역할 분리**

`WeatherCard`를 컴포넌트로 분리하면서 `v-for`도 자식 쪽으로 옮겨야 하는지 헷갈렸다. `filteredWeatherList`를 갖고 있는 건 부모니까, `v-for`는 계속 `WeatherParents.vue`에 남기고 반복되던 `div.weather-card` 마크업만 `WeatherCard` 컴포넌트로 바꾸는 방식으로 정리했다. 각 반복에서는 `:weather="weather"`로 현재 순회 중인 `weather` 객체를 넘긴다.

</details>

<details>
<summary><h3>과제 4 - Weather Router</h3></summary>

### 목표

여기까지는 화면 전환을 `currentPage` 같은 state로 처리했는데, 이제 실제 URL(`/`, `/weather/:cityId`, `/about`)에 따라 화면이 바뀌도록 Vue Router를 도입하는 게 목표였다. `WeatherParents.vue` 하나에 몰려 있던 대시보드를 URL 단위의 View로 나눴다.

### 구현 내용

**1. router/index.js - 라우트 설계**

`WeatherHomeView`, `WeatherAboutView`, `WeatherDetailView`, `NotFoundView` 네 라우트를 전부 동적 `import()`로 Lazy Loading 처리했다. 정의되지 않은 모든 경로는 `path: '/:pathMatch(.*)*'` Catch-all Route로 `NotFoundView`에 연결했다.

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

**2. App.vue - Practice 탭 내부에 Router 연결**

기존 Practice/Challenge 탭 구조는 그대로 두고, Practice 탭에서 `WeatherParents`를 직접 렌더링하던 자리만 `RouterLink` 내비게이션과 `RouterView`로 바꿨다. `WeatherParents.vue` 파일 자체는 지우지 않고 더 이상 import하지 않는 상태로 남겨뒀다.

```vue
<nav class="weather-nav">
  <RouterLink to="/">날씨 대시보드</RouterLink>
  <RouterLink to="/about">서비스 소개</RouterLink>
</nav>
<RouterView />
```

**3. WeatherHomeView.vue - WeatherParents 역할 이전 + Programmatic Navigation**

`WeatherParents.vue`의 상태(`searchQuery`, `selectedCityInfo`, `hotThreshold`)와 로직(`filteredWeatherList`, `hotCityCount`, watch/watchEffect)을 그대로 옮겼다. 상세보기 클릭 시 `alert()`으로 습도를 띄우던 방식은 없애고, `useRouter()`로 얻은 `router` 인스턴스로 `/weather/:cityId`에 Programmatic Navigation하도록 바꿨다.

```js
const handleClickDetail = (cityId) => {
  router.push('/weather/' + cityId)
}
```

이 때문에 `WeatherCard.vue`가 `click-detail` 이벤트로 emit하던 값도 `weather.humidity`에서 `weather.id`로 바꿨다. 상세보기 화면 이동에는 습도가 아니라 도시 식별자가 필요하기 때문이다.

**4. WeatherDetailView.vue - 동적 세그먼트로 도시 조회**

`useRoute()`로 URL의 `cityId`를 읽고, `onMounted` 시점에 `weatherList.find((weather) => weather.id === route.params.cityId)`로 일치하는 도시를 찾아 화면에 표시한다. 일치하는 도시가 없으면 "해당 도시 정보를 찾을 수 없습니다" 문구를 보여준다. 도시 목록 Mock Data는 별도 공유 파일로 빼지 않고 `WeatherHomeView.vue`와 같은 배열을 각 View에 인라인으로 뒀다.

**5. WeatherAboutView.vue / NotFoundView.vue**

`WeatherAboutView.vue`에는 서비스 소개 문구와 `/`로 돌아가는 `RouterLink`를 넣었다. `NotFoundView.vue`는 Catch-all Route에 연결돼서, 존재하지 않는 경로로 들어오면 안내 문구와 `/`로 돌아가는 링크를 보여준다.

### 주요 변경

- `src/router/index.js` 라우트 재설계 (`/`, `/about`, `/weather/:cityId`, catch-all)
- `src/views/WeatherHomeView.vue`, `WeatherAboutView.vue`, `WeatherDetailView.vue`, `NotFoundView.vue` 새로 작성
- 기본 스캐폴딩의 `src/views/HomeView.vue`, `AboutView.vue` 삭제
- `App.vue`에 `RouterLink` 내비게이션 + `RouterView` 연결

### Troubleshooting

**click-detail emit 값을 humidity 그대로 두고 라우팅하는 실수**

`WeatherCard.vue`의 상세보기 버튼은 원래 `emit('click-detail', props.weather.humidity)`처럼 습도 값을 emit하고 있었다. 이 emit 값을 그대로 둔 채 `router.push('/weather/' + humidity)`를 호출하면, URL에는 도시 `id`(`city_01` 등)가 아니라 습도 숫자(`70` 등)가 들어간다. 그러면 `WeatherDetailView.vue`의 `weatherList.find((weather) => weather.id === route.params.cityId)`는 항상 실패해서 "해당 도시 정보를 찾을 수 없습니다" 문구만 뜬다. 화면에 보여주는 값(습도)과 라우팅에 필요한 식별자(`id`)가 다르다는 걸 구분해서, `WeatherCard.vue`의 emit 값을 `props.weather.id`로 바꿔야 한다.

**같은 컴포넌트를 가리키는 동적 라우트 사이를 이동할 때 화면이 갱신되지 않는 문제**

`WeatherDetailView.vue`는 도시 조회 로직을 `onMounted` 안에서만 실행한다. 지금은 상세 페이지에서 다른 도시의 상세 페이지로 곧장 이동하는 링크가 없어서 문제가 안 되지만, 나중에 그런 링크(`/weather/city_01` → `/weather/city_02`)를 추가하면 Vue Router는 같은 컴포넌트를 재사용하기 때문에 `onMounted`가 다시 실행되지 않고 화면은 이전 도시 정보를 계속 보여주게 된다. 이런 상황을 대비하려면 `onMounted` 대신(또는 추가로) `watch(() => route.params.cityId, ...)`로 `cityId` 변경을 감시해서 도시를 다시 조회해야 한다. "컴포넌트가 마운트될 때 한 번"과 "라우트 파라미터가 바뀔 때마다"는 다른 시점이라는 게 Vue Router에서 자주 헷갈리는 부분이다.

</details>

<details>
<summary><h3>과제 5 - Weather Store</h3></summary>

### 목표

`WeatherHomeView`와 `WeatherDetailView`는 라우트가 다른 순간 서로 다른 컴포넌트 인스턴스라서, 단순히 ref 하나를 어느 한쪽에 두면 다른 화면에서는 그 값을 볼 수 없다. 두 화면이 같은 단위(섭씨/화씨) 설정을 공유해야 해서 Pinia로 전역 상태를 분리하는 게 목표였다.

### 구현 내용

**1. configStore.js - 단위 설정 Store**

`stores/configStore.js`에 단위 상태를 관리하는 Store를 작성했다. `state`는 `unit`(기본값 `'celsius'`), `getters`는 현재 단위 기호를 반환하는 `unitSymbol`, `actions`는 `'celsius'`/`'fahrenheit'`를 토글하는 `toggleUnit`으로 구성했다.

```js
export const useConfigStore = defineStore('config', {
  state: () => ({ unit: 'celsius' }),
  getters: {
    unitSymbol: (state) => (state.unit === 'celsius' ? '°C' : '°F'),
  },
  actions: {
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})
```

**2. UnitToggler.vue - 단위 변경 UI + Navigation Bar 옆 배치**

`UnitToggler.vue`는 `configStore.unitSymbol`을 버튼에 표시하고, 클릭하면 `configStore.toggleUnit()`을 호출한다. `App.vue`의 Practice 탭에서 기존 Navigation Bar(`RouterLink` nav)를 `.weather-topbar`로 감싸고 그 옆에 `UnitToggler`를 배치했다.

```vue
<div class="weather-topbar">
  <nav class="weather-nav">...</nav>
  <UnitToggler />
</div>
```

**3. 메인/상세 화면에 단위 변경 적용**

`WeatherCard.vue`와 `WeatherDetailView.vue`에 각각 `displayTemp`라는 `computed`를 추가해서, 원본 섭씨 데이터를 `configStore.unit`에 따라 화씨로 변환한 값을 표시한다. 온도 조건 판정(`위험해요`/`더워요`/`괜찮아요`/`선선해요`)은 표시 단위와 상관없이 원본 섭씨 값(`weather.temp`) 기준을 그대로 유지했다.

```js
const displayTemp = computed(() => {
  const rawTemp = props.weather.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
```

`WeatherDetailView.vue`는 `city`가 `onMounted` 시점에만 채워지는 `ref(null)` 구조를 그대로 두고, `displayTemp` 안에서 `city.value`가 없을 때를 먼저 처리해서 마운트 전이나 도시를 못 찾은 경우에도 에러 없이 동작하게 했다. 코드 중복(두 파일에 같은 변환 로직)은 Composable로 줄일 수 있지만, 이번 과제 범위에서는 각 컴포넌트에 그대로 뒀다.

**4. favoriteStore.js - 즐겨찾기 도시 기능 (개인 추가 Store)**

`configStore.js`와 같은 스타일로 `favoriteStore.js`를 새로 작성했다. `favoriteIds` 배열(state)에 즐겨찾기한 도시 `id`를 담고, `isFavorite(cityId)` getter로 즐겨찾기 여부를 확인하며, `toggleFavorite(cityId)` action으로 추가/제거를 토글한다.

```js
export const useFavoriteStore = defineStore('favorite', {
  state: () => ({ favoriteIds: [] }),
  getters: {
    isFavorite: (state) => (cityId) => state.favoriteIds.includes(cityId),
  },
  actions: {
    toggleFavorite(cityId) {
      if (this.favoriteIds.includes(cityId)) {
        this.favoriteIds = this.favoriteIds.filter((id) => id !== cityId)
      } else {
        this.favoriteIds.push(cityId)
      }
    },
  },
})
```

`WeatherCard.vue`(카드 우상단)와 `WeatherDetailView.vue`(상세 카드 우상단)에 별 아이콘 버튼을 추가해서 `favoriteStore.toggleFavorite(id)`를 호출한다. `WeatherCard.vue`의 별 버튼에는 `@click.stop`을 적용해서 카드 선택(`select-card`) 이벤트로 안 번지게 했다. `WeatherHomeView`에서 즐겨찾기한 도시가 `WeatherDetailView`로 이동해도(반대 방향도) 똑같이 유지되는데, 두 View가 서로 다른 컴포넌트 인스턴스인데도 Pinia Store를 통해 상태를 공유하기 때문이다.

**5. Home에 "즐겨찾기만 보기" 필터**

`WeatherHomeView.vue`에 `showFavoritesOnly`(체크박스로 토글되는 `ref`)를 추가하고, `filteredWeatherList`가 검색어 필터에 이어 즐겨찾기 여부까지 함께 걸러내도록 했다.

```js
const filteredWeatherList = computed(() => {
  return weatherList.value
    .filter((weather) => weather.name.includes(searchQuery.value))
    .filter((weather) => !showFavoritesOnly.value || favoriteStore.isFavorite(weather.id))
})
```

### 주요 변경

- `src/stores/configStore.js`, `src/stores/favoriteStore.js` 작성
- `src/components/hands_on/UnitToggler.vue` 새로 작성
- `src/components/hands_on/WeatherCard.vue`, `src/views/WeatherDetailView.vue`, `src/views/WeatherHomeView.vue`, `src/components/hands_on/HotThresholdControl.vue` 수정

### Troubleshooting

**즐겨찾기 기능을 만들었지만 실제로는 아무 효과가 없었던 문제**

`favoriteStore.js`와 별 아이콘 버튼(4번 항목)까지 구현하고 확인해보니, 버튼을 눌러도 별 색깔만 바뀔 뿐 그 상태를 실제로 활용하는 화면 요소가 하나도 없었다. `toggleFavorite`로 상태를 "쓰는" 로직만 만들고, 그 상태를 "읽어서" 화면에 반영하는 소비 로직을 안 만들었던 게 원인이다. 5번 항목의 "즐겨찾기만 보기" 필터를 추가해서 `filteredWeatherList`가 `favoriteStore.isFavorite(weather.id)`를 실제로 참조하도록 만들어 해결했다. Store에 상태를 저장하는 것과 그 상태를 화면 로직에서 실제로 쓰는 것은 별개의 작업이고, 후자가 빠지면 눈에 보이는 토글일 뿐 아무 역할도 안 한다는 걸 확인했다.

**"더운 도시 기준"이 화씨 모드에서도 섭씨 기준으로만 동작하는 문제**

![Weather Store 화씨 모드에서 더운 도시 기준이 섭씨로만 동작하는 화면](docs/images/과제5_버그사항.png)

단위를 화씨로 바꾸면 카드의 온도는 `°F`로 잘 바뀌는데, "더운 도시 기준" 입력 영역은 여전히 `°C`로 표시되고 있었다. 원인은 `HotThresholdControl.vue`의 단위 표기가 `<span class="threshold-unit">°C</span>`로 하드코딩돼 있었고, `WeatherHomeView.vue`의 `hotCityCount`도 사용자가 입력한 `hotThreshold` 숫자를 `configStore.unit`과 상관없이 항상 섭씨인 `weather.temp`와 그대로 비교하고 있었기 때문이다. 위 스크린샷처럼 화씨 모드에서 "32"를 입력해도 실제로는 섭씨 32도 기준으로 판정되어, 화면에 보이는 단위와 실제 계산 기준이 어긋난 상태였다.

`HotThresholdControl.vue`에 `unitSymbol` prop을 추가해서 하드코딩된 `°C`를 `{{ unitSymbol }}`로 바꾸고, `WeatherHomeView.vue`에서 `configStore.unitSymbol`을 내려주도록 했다. 비교 로직도 `hotThreshold`가 현재 선택된 단위 기준의 숫자라고 보고, 화씨 모드일 때만 섭씨로 환산한 뒤 비교하도록 고쳤다.

```js
const hotCityCount = computed(() => {
  const thresholdInCelsius =
    configStore.unit === 'fahrenheit' ? ((hotThreshold.value - 32) * 5) / 9 : hotThreshold.value
  return weatherList.value.filter((weather) => weather.temp >= thresholdInCelsius).length
})
```

단위를 토글해도 입력창에 이미 쓰여 있는 숫자 자체를 자동으로 환산하지는 않는다(예: 섭씨 32를 입력한 뒤 화씨로 바꾸면 라벨만 `°F`로 바뀌고 숫자는 그대로 32로 남아서, 이제 "화씨 32도 이상"이 기준이 된다). 라벨과 판정 기준의 단위를 맞추는 것까지가 이번 수정 범위였고, 숫자까지 물리적으로 동일한 기준으로 자동 환산하는 건 범위 밖으로 남겨뒀다.

</details>
