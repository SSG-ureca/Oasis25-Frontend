# 다크모드 전환 구현 계획 (utils / hooks 분리)

## 목표

현재 클레이/뉴모피즘 라이트 테마에서 다크모드로 전환할 수 있도록 한다.  
`Panel`, `Button`, `MainLayout`의 배경은 전역 CSS 변수로 제어하고, 테마 상태 로직은 `utils/theme.ts`와 `hooks/useTheme.ts`로 분리하여 추후 관리가 쉽도록 한다.  
`Header`의 테마 버튼(햇빛 아이콘) 클릭 시 라이트/다크모드를 토글한다.

---

## 1. 현재 상태 분석

### 1.1 `src/index.css`

- `@theme` 블록 안에서 Tailwind 4 테마 변수(색상, 그림자 등)를 정의 중.
- `--color-bg-light: #d9d9d9`, `--color-bg-dark: #1b1f33` 등이 이미 선언되어 있음.
- `--color-clay-bg: #f8e6ca` 와 `--shadow-clay`, `--shadow-neumorphism` 등이 라이트 테마 전용으로 고정되어 있음.
- 글로벌 다크모드 오버라이드용 `html.dark` / `html[data-theme="dark"]` 클래스가 없음.

### 1.2 `src/types/neumophismVariants.ts`

- CVA(`class-variance-authority`)를 사용해 `neumorphism`, `clay`, `clayFlat` 3가지 변형을 관리.
- `clay` 변형: `bg-clay-bg`, `shadow-clay`, `border-clay-border/20`, `clay-surface` 사용.
- `neumorphism` 변형: `bg-bg-light`, `shadow-[var(--shadow-neumorphism)]` 사용.
- 다크모드 대응이 아직 없음.

### 1.3 `src/components/common/Panel.tsx`

- `neumophismVariants`를 그대로 사용.
- 별도의 배경색/그림자를 직접 갖고 있지 않으며, CVA에서 결정된 스타일을 적용.

### 1.4 `src/components/common/Button.tsx`

- `variant="clay"` 기본.
- `active` 상태에서 `--shadow-clay-inset` 또는 `shadow-clay-inset` 사용.
- `clay` 기준으로 하드코딩된 쉐도우 매핑이 있음.

### 1.5 `src/components/layout/MainLayout.tsx`

- 최상위 `<div className="min-w-90 w-full bg-clay-bg desert-grain">` 로 고정된 라이트 배경 사용.
- `<div className="sand-overlay">` 는 `.desert-grain` 내부 질감 오버레이.
- `<Panel variant="clay">` 로 메인 콘텐츠 영역 배경 사용.

### 1.6 `src/components/common/Header.tsx`

- 테마 버튼은 2곳에 존재:
  1. 데스크탑: `<Button variant="clay" className="rounded-full w-12 h-12 p-0"><Sun /></Button>` (line 203–205)
  2. 모바일 메뉴: `<Button variant="clayFlat"> <Sun /> 테마 </Button>` (line 160–165)
- 현재 아무런 `onClick` 핸들러도 연결되지 않음.

---

## 2. 구현 방향

### 2.1 테마 관심사 분리

#### `src/utils/theme.ts` — 순수 로직만 담당

- `localStorage` 키/값 관리 (`getTheme`, `setTheme`)
- `document.documentElement`의 `dark` 클래스 추가/제거 (`applyTheme`)
- 시스템 다크모드 감지 (`getSystemTheme`)
- 테마 토글 (`toggleTheme`)
- Tailwind/CSS에는 영향을 주지 않는 DOM/localStorage 전용 유틸

#### `src/hooks/useTheme.ts` — React 연동

- `useState`로 `isDark` 상태 관리
- mount 시 `utils/theme.ts`의 `applyTheme(getTheme())` 호출
- `toggleTheme` 호출 시 `utils/theme.ts`의 토글 함수 사용 후 React 상태 동기화
- `storage` 이벤트 구독으로 다른 탭/창에서의 테마 변경 반영 (선택)
- `Header` 외 다른 컴포넌트에서도 재사용 가능

#### `src/components/common/Header.tsx`

- `useTheme` 훅을 import
- 데스크탑/모바일 테마 버튼에 `toggleTheme` 연결
- `isDark`에 따라 `Sun`/`Moon` 아이콘 전환 (선택)

### 2.2 `src/index.css` 변경

1. **기존 변수를 라이트 기본값으로 유지**
   - `--color-bg-light`, `--color-clay-bg`, `--color-clay-border`, `--shadow-*` 등을 그대로 둔다.
   - 이 변수들이 라이트 모드에서의 기본값 역할을 한다.

2. **다크모드 전용 CSS 변수 오버라이드 추가**
   - `html.dark` 선택자 안에서 필요한 변수만 오버라이드.
   - 예시 대상:
     - `--color-bg-light` → 어두운 메인 배경 (`#1b1f33` 또는 다크용 색상)
     - `--color-clay-bg` → 다크용 카드 배경
     - `--color-clay-border` → 다크용 보더 색상
     - `--shadow-clay`, `--shadow-clay-inset` → 어두운 톤의 그림자
     - `--shadow-neumorphism`, `--shadow-neumorphism-inset` → 어두운 톤의 그림자
   - `.clay-surface`, `.clay-hover`, `.clay-active`, `.neumorphism-hover`, `.neumorphism-active` 등의 그라데이션/색상도 다크모드에서 자연스럽도록 오버라이드.

3. **전역 배경색 변수 추가**
   - `--color-app-bg` 변수를 만들어 `MainLayout` 최상위에 사용.
   - `html` 에서는 `--color-app-bg: var(--color-clay-bg)` (또는 `#f8e6ca`)
   - `html.dark` 에서는 `--color-app-bg: var(--color-bg-dark)` (또는 다크용 배경)

4. **Tailwind 4 dark 모드 설정**
   - `@custom-variant dark` 또는 `html.dark &` 방식으로 `dark:` 변형이 동작하도록 설정.
   - 문법 예시(Tailwind v4):
     ```css
     @custom-variant dark (&:where(html.dark, html.dark *));
     ```
   - 또는 CSS 내에서 `html.dark .class-name { ... }` 형태로 오버라이드.

### 2.3 `src/components/layout/MainLayout.tsx` 변경

- 최상위 배경 클래스를 전역 변수 기반으로 변경.
  - `bg-clay-bg` → `bg-[var(--color-app-bg)]`
- `.desert-grain` / `.sand-overlay` 는 라이트/다크에 따라 표시/숨김 처리.
  - 예: `html.dark` 일 때 `.sand-overlay` 투명도 조정 또는 숨김
  - 또는 `.desert-grain`에 다크용 질감/색상 오버라이드.
- `<Panel variant="clay">` 는 CVA가 자동으로 다크 변수를 참조하도록 둔다.

### 2.4 `src/components/common/Panel.tsx` 변경 (최소 또는 없음)

- CVA를 통해 배경/그림자가 이미 변수 기반이라면 추가 수정 불필요.
- 만약 직접적인 배경 클래스가 하드코딩 되어 있다면, 변수 기반 클래스로 교체.
- 현재는 `neumophismVariants`가 `bg-clay-bg`, `bg-bg-light` 등 변수 기반 Tailwind 클래스를 사용하고 있으므로, `index.css`의 변수 오버라이드만으로 다크모드가 자연스럽게 적용될 수 있음.

### 2.5 `src/components/common/Button.tsx` 변경 (최소 또는 없음)

- `activeShadowClass`가 `clay`/`neumorphism`에 따라 올바른 inset shadow 변수를 참조하고 있는지 확인.
- `variant="clay"`일 때 `active:shadow-[var(--shadow-clay-inset)]` (CSS 변수) → 다크모드에서 `--shadow-clay-inset`만 오버라이드하면 자동 대응.
- 필요하다면 `variant`에 `dark` 전용 로직은 추가하지 않고, 순수 변수 치환 방식 유지.

### 2.6 `src/components/common/Header.tsx` 변경

- `useTheme` import.
- `const { isDark, toggleTheme } = useTheme();` 호출.
- 데스크탑/모바일 테마 버튼에 `onClick={toggleTheme}` 연결.
- `isDark` 값에 따라 `Sun`/`Moon` 아이콘/라벨 토글 (선택).

---

## 3. 수정 파일 목록

| 파일                                   | 수정 내용                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| `src/index.css`                        | 다크모드 변수 오버라이드, `@custom-variant dark` 추가, `--color-app-bg` 정의   |
| `src/utils/theme.ts`                   | **신규** — localStorage/문서 클래스/토글/시스템 감지 유틸                      |
| `src/hooks/useTheme.ts`                | **신규** — React 상태/마운트/이벤트 연동 훅                                    |
| `src/components/layout/MainLayout.tsx` | 최상위 배경을 `--color-app-bg` 사용, `.desert-grain`/`.sand-overlay` 다크 대응 |
| `src/components/common/Header.tsx`     | `useTheme` 사용, 두 테마 버튼에 `toggleTheme` 연결                             |
| `src/components/common/Panel.tsx`      | 필요시 변수 기반 배경/그림자로 교체 (현재는 CVA 의존)                          |
| `src/components/common/Button.tsx`     | 필요시 active shadow 변수 확인/정리                                            |
| `src/types/neumophismVariants.ts`      | 필요시 다크모드에서의 variant class 추가 (선택 사항)                           |

---

## 4. `src/utils/theme.ts` 구성 (가이드)

> 실제 코드 작성 금지. 아래는 구현 시 참고할 책임 분리 기준.

- `THEME_KEY = "oasis-theme"`
- `getTheme(): "light" | "dark"`
  - `localStorage` 값 반환
  - 없으면 `getSystemTheme()` 결과 반환
- `getSystemTheme(): "light" | "dark"`
  - `window.matchMedia("(prefers-color-scheme: dark)").matches` 확인
- `applyTheme(theme: "light" | "dark")`
  - `theme === "dark"`이면 `document.documentElement.classList.add("dark")`
  - 아니면 `remove("dark")`
- `setTheme(theme: "light" | "dark")`
  - `localStorage.setItem(THEME_KEY, theme)`
  - `applyTheme(theme)`
- `toggleTheme(): "light" | "dark"`
  - 현재 `getTheme()` 기반으로 반대 값으로 `setTheme` 후 반환

---

## 5. `src/hooks/useTheme.ts` 구성 (가이드)

> 실제 코드 작성 금지. 아래는 구현 시 참고할 React 연동 기준.

- `useState<boolean>(false)` 또는 `useState<"light" | "dark">("light")`로 현재 테마 상태 관리
- `useEffect` (mount):
  - `getTheme()` → `applyTheme()` → `setIsDark()`
- `toggleTheme` 콜백:
  - `utils/theme.ts`의 `toggleTheme()` 호출
  - 반환 값으로 `setIsDark` 업데이트
- (선택) `useEffect`로 `window`의 `storage` 이벤트 구독:
  - `localStorage`가 다른 탭에서 바뀌면 `getTheme()`로 동기화
- `return { isDark, toggleTheme }`

---

## 6. 추천 다크모드 CSS 변수 예시

> 실제 값은 디자인 팀/기획과 조율 후 확정.

```text
/* Light (default) - 이미 index.css에 정의된 값 */
--color-app-bg: #f8e6ca;
--color-clay-bg: #f8e6ca;
--color-clay-border: #c4a27a;
--shadow-clay: ... (기존 라이트용)

/* Dark override */
html.dark {
  --color-app-bg: #1b1f33;
  --color-bg-light: #24283b;
  --color-clay-bg: #2a3048;
  --color-clay-border: #4e5266;
  --shadow-clay: ... (어두운 톤 inset/outset)
  --shadow-neumorphism: ... (어두운 톤)
}
```

---

## 7. 구현 시 주의 사항

1. **변수 충돌 최소화**
   - 기존 라이트 변수는 그대로 두고, 다크모드에서만 `html.dark` 안에서 오버라이드한다.
   - `Panel`/`Button`은 이미 `bg-clay-bg`, `bg-bg-light` 등 변수 기반 클래스를 사용 중이므로,  
     대부분의 변경은 CSS 변수만 오버라이드하면 자동 적용됨.

2. **Tailwind 4 문법**
   - `@theme`과 `@custom-variant` 문법을 프로젝트 설정(tsconfig, tailwind v4)에 맞춰 사용.
   - Tailwind 4는 `darkMode: "class"` config 대신 CSS 기반 `@custom-variant` 권장.

3. **localStorage 동기화**
   - `utils/theme.ts`에서만 `localStorage`에 접근하고, `hooks/useTheme.ts`는 이 유틸을 사용.
   - `Header` 외 다른 곳에서도 `useTheme` 또는 `utils/theme`를 사용해 일관성 유지.

4. **FOUC(Flash of Unstyled Content) 방지**
   - 테마 클래스는 가능한 한 `<head>`/초기 JS에서 먼저 적용. (선택 사항: index.html inline script)
   - React `useEffect`에서 초기화하면 짧은 깜빡임 가능. 무시 가능한 수준이면 React 내에서 처리.

5. **그림자/테두리 대비**
   - 다크모드에서 `border-white/20`은 거의 보이지 않을 수 있음.
   - `--color-clay-border` 등으로 보더 색상도 다크에 맞춰 조정.

---

## 8. 완료 기준

- [ ] `src/index.css`에 `html.dark` 오버라이드 및 `--color-app-bg`가 추가되어 있음.
- [ ] `src/utils/theme.ts`가 생성되어 있음 (localStorage, DOM 클래스, 토글 책임 분리).
- [ ] `src/hooks/useTheme.ts`가 생성되어 있음 (React 상태/마운트/이벤트 연동).
- [ ] `MainLayout.tsx`의 최상위 배경이 `--color-app-bg`를 참조함.
- [ ] `Header.tsx`가 `useTheme`를 사용하고, 두 테마 버튼에 `toggleTheme`이 연결됨.
- [ ] `localStorage`에 현재 테마(`light`/`dark`)가 저장되고, 새로고침 시 복원됨.
- [ ] 다크모드에서 `Panel`, `Button`, `MainLayout` 배경/그림자가 라이트와 다르게 표시됨.
