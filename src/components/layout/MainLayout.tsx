import { Outlet } from "react-router-dom";
import Header from "../common/Header";

// [components/layout] Header, Sidebar 등 전체 화면 구조(뼈대)를 구성하는 컴포넌트를 담는 공간입니다.
export default function MainLayout() {
  return (
    <div className="min-h-screen bg-bg-light">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className=" p-4 pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
