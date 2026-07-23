import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { Panel } from "./Panel";
import { RestrictedArea } from "./RestrictedArea";
import { cn } from "../../utils/cn";
import { Button } from "./Button";
import { Sun, LogOut, LogIn, User } from "lucide-react";
import { logoutApi } from "../../services/authApi";
import { FeedbackModal } from "./FeedbackModal";

const NAV_ITEMS = [
    { to: "/main", label: "홈" },
    { to: "/main/retrospect", label: "회고" },
    { to: "/main/stats", label: "통계" },
    { to: "/main/mypage", label: "마이페이지" },
];

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("accessToken");
    const isGuest = !token;

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
                    const isItemDisabled = isGuest && item.to !== "/";
                    return (
                        <RestrictedArea
                            key={item.to}
                            isRestricted={isItemDisabled}
                        >
                            <NavLink
                                to={item.to}
                                end
                                className={({ isActive }) =>
                                    cn(
                                        "rounded-4xl neumorphism-size-sm border border-transparent transition-all duration-200 select-none block",
                                        "neumorphism-hover",
                                        isActive &&
                                            !isItemDisabled &&
                                            "neumorphism-active",
                                        isItemDisabled &&
                                            "opacity-50 cursor-not-allowed",
                                    )
                                }
                            >
                                {item.label}
                            </NavLink>
                        </RestrictedArea>
                    );
                })}
            </Panel>
            <div className="flex-1 flex justify-end gap-5 items-center">
                <Button
                    variant="neumorphism"
                    className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
                >
                    <Sun className="w-6 h-6 text-[#718096]" />
                </Button>
                <RestrictedArea isRestricted={isGuest}>
                    <Button
                        variant="neumorphism"
                        onClick={() => setIsFeedbackOpen(true)}
                        className={cn(
                            "rounded-full px-4 h-12 text-xs font-bold text-[#718096]",
                            isGuest && "opacity-50 cursor-not-allowed",
                        )}
                    >
                        VOC
                    </Button>
                </RestrictedArea>

                {/* 프로필 이미지 (User 버튼) 드롭다운 컴포넌트 */}
                <div className="relative" ref={dropdownRef}>
                    <Button
                        variant="neumorphism"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="rounded-full w-12 h-12 p-0 overflow-hidden relative group"
                        title={isGuest ? "로그인" : "마이페이지"}
                    >
                        <User
                            className="w-9 h-9 text-[#6c757d] fill-[#6c757d]"
                            strokeWidth={0}
                        />
                    </Button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-40 bg-bg-light shadow-[var(--shadow-neumorphism)] rounded-2xl p-2 border border-white/40 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                            {isGuest ? (
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        navigate("/login");
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-gray-700 hover:text-primary rounded-xl transition-all duration-200 cursor-pointer hover:bg-black/5"
                                >
                                    <LogIn className="w-4 h-4 transition-colors" />
                                    로그인
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-gray-700 hover:text-primary rounded-xl transition-all duration-200 cursor-pointer hover:bg-black/5"
                                >
                                    <LogOut className="w-4 h-4 transition-colors" />
                                    로그아웃
                                </button>
                            )}
                        </div>
                    )}
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
