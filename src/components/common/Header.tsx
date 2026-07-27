import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import { Panel } from "./Panel";
import { cn } from "../../utils/cn";
import { Button } from "./Button";
import { Sun, Moon, LogOut, Menu, X, LogIn, User } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { logoutApi } from "../../services/authApi";
import { FeedbackModal } from "./FeedbackModal";
import { toast } from "./Toast";
import { RestrictedArea } from "./RestrictedArea";
import oasis25Light from "../../assets/images/Oasis25-lightmode.png";
import oasis25Dark from "../../assets/images/Oasis25-darkmode.png";

const PROTECTED_PATHS = ["/main/retrospect", "/main/stats", "/main/mypage"];

const NAV_ITEMS = [
  { to: "/main", label: "홈" },
  { to: "/main/retrospect", label: "회고" },
  { to: "/main/stats", label: "통계" },
  { to: "/main/mypage", label: "마이페이지" },
];

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // 모바일 메뉴(820px 미만 햄버거) 펼침 여부 상태 및 참조
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("accessToken");
  const isGuest = !token;

  const handleProtectedNav = (to: string): boolean => {
    if (isGuest && PROTECTED_PATHS.includes(to)) {
      toast.error("로그인 후 이용할 수 있습니다.", 2000);
      return true;
    }
    return false;
  };

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
    <header className="sticky top-0 z-50 flex justify-between items-center h-13 px-4">
      {/* 로고 */}
      <div className="flex-1 flex justify-start">
        <img src={isDark ? oasis25Dark : oasis25Light} alt="logo" className="h-6 object-contain" />
      </div>

      {/* Nav items */}
      <Panel
        variant="clay"
        inset
        className="px-5 py-2.5 hidden 880:flex gap-5 rounded-4xl bg-panel-bg">
        {NAV_ITEMS.map((item) => {
          const isProtected = isGuest && PROTECTED_PATHS.includes(item.to);
          return (
            <RestrictedArea
              key={item.to}
              isRestricted={isProtected}
              className="rounded-4xl"
              tooltipText={
                <span className="text-text-muted">
                  로그인 후 이용할 수 있습니다
                </span>
              }>
              <NavLink
                to={item.to}
                end
                className={({ isActive }) =>
                  cn(
                    "rounded-4xl px-4 py-2 transition-all duration-200 select-none",
                    "clay-hover",
                    isActive && "clay-active",
                  )
                }>
                {item.label}
              </NavLink>
            </RestrictedArea>
          );
        })}
      </Panel>

      {/* 우측 메뉴 */}
      <div className="flex-1 flex justify-end gap-5">
        {/* 햄버거 버튼 및 모바일 메뉴: 820px 미만에서만 표시 */}
        <div className="relative flex 880:hidden" ref={mobileMenuRef}>
          <Button
            variant="clay"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-full w-12 h-12 p-0 bg-panel-bg">
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-text-muted" />
            ) : (
              <Menu className="w-6 h-6 text-text-muted" />
            )}
          </Button>

          {isMobileMenuOpen && (
            <Panel
              variant="clayFlat"
              className="absolute right-0 top-full mt-3 w-48 bg-clay-bg rounded-2xl p-2 border border-white/20 z-50 flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.to}
                  variant="clayFlat"
                  onClick={() => {
                    if (handleProtectedNav(item.to)) return;
                    setIsMobileMenuOpen(false);
                    navigate(item.to);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 h-12 text-xs font-semibold  rounded-xl justify-start clay-hover",
                    location.pathname === item.to && "clay-active",
                  )}>
                  {item.label}
                </Button>
              ))}

              <Button
                variant="clayFlat"
                onClick={toggleTheme}
                className="w-full flex items-center gap-2.5 px-4 h-12 text-xs font-semibold rounded-xl justify-start clay-hover">
                {isDark ? (
                  <Moon className="w-4 h-4 text-text-muted" />
                ) : (
                  <Sun className="w-4 h-4 text-text-muted" />
                )}
                테마
              </Button>
              <Button
                variant="clayFlat"
                onClick={() => {
                  if (isGuest) {
                    toast.error("로그인 후 이용할 수 있습니다.", 2000);
                    return;
                  }
                  setIsFeedbackOpen(true);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-4 h-12 text-xs font-semibold rounded-xl justify-start clay-hover",
                )}>
                VOC
              </Button>
              <Button
                variant="clayFlat"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (isGuest) {
                    navigate("/login");
                  } else {
                    handleLogout();
                  }
                }}
                className="w-full flex items-center gap-2.5 px-4 h-12 text-xs font-semibold rounded-xl justify-start clay-hover">
                {isGuest ? (
                  <LogIn className="w-4 h-4 text-text-muted" />
                ) : (
                  <LogOut className="w-4 h-4 text-text-muted" />
                )}
                {isGuest ? "로그인" : "로그아웃"}
              </Button>
            </Panel>
          )}
        </div>
        {/* 데스크탑 버튼 그룹: 820px 이상에서만 표시 */}
        <div className="hidden 880:flex items-center gap-5">
          <Button
            variant="clay"
            onClick={toggleTheme}
            className="rounded-full w-12 h-12 p-0 bg-panel-bg">
            {isDark ? (
              <Moon className="w-6 h-6 text-text-muted" />
            ) : (
              <Sun className="w-6 h-6 text-text-muted" />
            )}
          </Button>
          <RestrictedArea
            isRestricted={isGuest}
            className="rounded-full"
            tooltipText={
              <span className="text-text-muted">
                로그인 후 이용할 수 있습니다
              </span>
            }>
            <Button
              variant="clay"
              onClick={() => setIsFeedbackOpen(true)}
              className="rounded-full px-4 h-12 text-xs font-bold text-text-muted bg-panel-bg">
              VOC
            </Button>
          </RestrictedArea>
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="clay"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="rounded-full w-12 h-12 p-0 overflow-hidden relative group bg-panel-bg">
              <User
                className="w-9 h-9 text-text-muted fill-current"
                strokeWidth={0}
              />
            </Button>

            {isDropdownOpen && (
              <Panel
                variant="clay"
                className="absolute right-0 mt-3 w-40 rounded-2xl p-2 border border-white/40 z-50">
                {isGuest ? (
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold  hover:text-primary rounded-xl transition-all duration-200 cursor-pointer hover:bg-black/5">
                    <LogIn className="w-4 h-4 transition-colors" />
                    로그인
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold hover:text-primary rounded-xl transition-all duration-200 cursor-pointer hover:bg-black/5">
                    <LogOut className="w-4 h-4 transition-colors" />
                    로그아웃
                  </button>
                )}
              </Panel>
            )}
          </div>
        </div>
      </div>

      {/* 피드백 모달 */}
      {isFeedbackOpen && (
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
