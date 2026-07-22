import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { Panel } from "./Panel";
import { cn } from "../../utils/cn";
import { Button } from "./Button";
import { Sun, User, LogOut } from "lucide-react";
import { logoutApi } from "../../services/authApi";
import { FeedbackModal } from "./FeedbackModal";

const NAV_ITEMS = [
  { to: "/", label: "홈" },
  { to: "/retrospect", label: "회고" },
  { to: "/stats", label: "통계" },
  { to: "/mypage", label: "마이페이지" },
];

const Header = () => {
  // 프로필 드롭다운 열림 여부 상태 및 참조
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 외부 영역 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
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
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center py-5 bg-bg-light/80 backdrop-blur-md px-4">
      <div className="flex-1 flex justify-start">
        <img src="/OASIS25.png" alt="logo" />
      </div>
      <Panel
        variant="neumorphism"
        inset
        className="px-5 py-2.5 flex gap-5 rounded-4xl"
      >
        {NAV_ITEMS.map((item) => {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  "rounded-4xl neumorphism-size-sm border border-transparent transition-all duration-200 select-none",
                  "neumorphism-hover",
                  isActive && "neumorphism-active",
                )
              }
            >
              {item.label}
            </NavLink>
          );
        })}
      </Panel>
      <div className="flex-1 flex justify-end gap-5">
        <Button variant="neumorphism" className="rounded-full w-12 h-12 p-0">
          <Sun className="w-6 h-6 text-[#718096]" />
        </Button>
        <Button
          variant="neumorphism"
          onClick={() => setIsFeedbackOpen(true)}
          className="rounded-full px-4 h-12 text-xs font-bold text-[#718096]"
        >
          VOC
        </Button>
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="neumorphism"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="rounded-full w-12 h-12 p-0 overflow-hidden relative group"
          >
            <User
              className="w-9 h-9 text-[#6c757d] fill-[#6c757d]"
              strokeWidth={0}
            />
          </Button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-40 bg-bg-light shadow-[var(--shadow-neumorphism)] rounded-2xl p-2 border border-white/40 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              <Button
                variant="neumorphism"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-gray-20 hover:text-primary rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4 text-primary" />
                로그아웃
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 피드백 모달 */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </header>
  );
};

export default Header;
