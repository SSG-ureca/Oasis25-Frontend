import { Outlet } from "react-router-dom";
import Header from "../common/Header";

// [components/layout] Header, Sidebar 등 전체 화면 구조(뼈대)를 구성하는 컴포넌트를 담는 공간입니다.
export default function MainLayout() {
  return (
    <div className="w-screen h-screen flex flex-col bg-bg-light overflow-hidden">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col overflow-hidden px-4">
        <Header />
        <main className="flex-1 overflow-hidden p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
