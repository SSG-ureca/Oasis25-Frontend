import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { Panel } from "./Panel";
import { cn } from "../../utils/cn";
import { Button } from "./Button";
import { Sun, User, LogOut, Menu, X } from "lucide-react";
import { logoutApi } from "../../services/authApi";

const NAV_ITEMS = [
  { to: "/", label: "홈" },
  { to: "/retrospect", label: "회고" },
  { to: "/stats", label: "통계" },
  { to: "/mypage", label: "마이페이지" },
];

const Header = () => {
  // 프로필 드롭다운 열림 여부 상태 및 참조
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // 모바일 메뉴(820px 미만 햄버거) 펼침 여부 상태 및 참조
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 외부 영역 클릭 시 드롭다운/모바일 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 로그아웃 처리 (API 호출 후 로컬 저장소 토큰 제거 및 로그인 페이지 이동)
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenType");
      setIsMobileMenuOpen(false);
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center h-13.5 bg-clay-bg backdrop-blur-md px-4">
      <div className="flex-1 flex justify-start">
        <img src="/src/assets/images/oasis25.png" alt="logo" />
      </div>
      <Panel
        variant="clay"
        inset
        className="px-5 py-2.5 hidden min-[820px]:flex gap-5 rounded-4xl">
        {NAV_ITEMS.map((item) => {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  "rounded-4xl neumorphism-size-sm transition-all duration-200 select-none",
                  "clay-hover",
                  isActive && "clay-active",
                )
              }>
              {item.label}
            </NavLink>
          );
        })}
      </Panel>
      <div className="flex-1 flex justify-end gap-5">
        {/* 햄버거 버튼 및 모바일 메뉴: 820px 미만에서만 표시 */}
        <div className="relative flex min-[820px]:hidden" ref={mobileMenuRef}>
          <Button
            variant="clay"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-full w-12 h-12 p-0">
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#718096]" />
            ) : (
              <Menu className="w-6 h-6 text-[#718096]" />
            )}
          </Button>

          {isMobileMenuOpen && (
            <div className="absolute right-0 top-full mt-3 w-48 bg-clay-bg shadow-[var(--shadow-clay)] rounded-2xl p-2 border border-white/40 animate-in fade-in slide-in-from-top-2 duration-150 z-50 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "w-full px-4 py-3 text-xs font-semibold text-gray-20 rounded-xl transition-all duration-200 select-none",
                      "clay-hover",
                      isActive && "clay-active",
                    )
                  }>
                  {item.label}
                </NavLink>
              ))}
              <div className="my-1 border-t border-white/40" />
              <Button
                variant="clay"
                className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-gray-20 rounded-xl transition-all duration-200 justify-start">
                <Sun className="w-4 h-4 text-[#718096]" />
                테마
              </Button>
              <Button
                variant="clay"
                className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-gray-20 rounded-xl transition-all duration-200 justify-start">
                명언
              </Button>
              <Button
                variant="clay"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-gray-20 hover:text-primary rounded-xl transition-all duration-200">
                <LogOut className="w-4 h-4 text-primary" />
                로그아웃
              </Button>
            </div>
          )}
        </div>
        {/* 데스크탑 버튼 그룹: 820px 이상에서만 표시 */}
        <div className="hidden min-[820px]:flex items-center gap-5">
          <Button variant="clay" className="rounded-full w-12 h-12 p-0">
            <Sun className="w-6 h-6 text-[#718096]" />
          </Button>
          <Button variant="clay" className="rounded-full w-12 h-12 p-0">
            명언
          </Button>
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="clay"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="rounded-full w-12 h-12 p-0 overflow-hidden relative group">
              <User
                className="w-9 h-9 text-[#6c757d] fill-[#6c757d]"
                strokeWidth={0}
              />
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-40 bg-bg-light shadow-[var(--shadow-neumorphism)] rounded-2xl p-2 border border-white/40 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                <Button
                  variant="clay"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-gray-20 hover:text-primary rounded-xl transition-all duration-200">
                  <LogOut className="w-4 h-4 text-primary" />
                  로그아웃
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
