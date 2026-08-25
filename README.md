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
