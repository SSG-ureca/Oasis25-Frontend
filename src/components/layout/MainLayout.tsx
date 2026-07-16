import { Outlet } from "react-router-dom";

// [components/layout] Header, Sidebar 등 전체 화면 구조(뼈대)를 구성하는 컴포넌트를 담는 공간입니다.
export default function MainLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
