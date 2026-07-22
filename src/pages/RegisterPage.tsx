import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Panel } from "../components/common/Panel";
import { Button } from "../components/common/Button";
import { registerApi } from "../services/authApi";
import { Sparkles, Mail, Lock, User } from "lucide-react";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // 상태 선언 (이메일, 닉네임, 비밀번호, 비밀번호 확인, 로딩, 에러/성공 메시지)
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 회원가입 제출 처리
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !nickname.trim()) {
      setErrorMessage("모든 정보를 입력해 주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // 회원가입 API 호출
      await registerApi({ email, password, nickname });
      setSuccessMessage(
        "회원가입이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다.",
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Register Error:", err);
      setErrorMessage(
        err.response?.data?.message ||
          "회원가입에 실패했습니다. 입력한 정보를 확인해 주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-bg-light animate-in fade-in duration-300">
      <div className="w-full max-w-md p-4">
        <Panel
          variant="neumorphism"
          className="p-8 rounded-[36px] flex flex-col space-y-4"
        >
          {/* 헤더 영역 */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-bg-light shadow-[var(--shadow-neumorphism)] mx-auto text-2xl">
              로고
            </div>
            <h2 className="text-xl font-bold text-gray-20 tracking-tight">
              Sign Up
            </h2>
          </div>

          {/* 회원가입 폼 */}
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            {/* 이메일 입력 */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-30 font-bold tracking-widest block uppercase font-mono pl-1">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 text-xs bg-bg-light shadow-[var(--shadow-neumorphism-inset)] border border-transparent rounded-2xl focus:outline-none focus:border-gray-40 text-gray-10 font-sans"
                />
              </div>
            </div>

            {/* 닉네임 입력 */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-30 font-bold tracking-widest block uppercase font-mono pl-1">
                NICKNAME
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-30" />
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임"
                  required
                  className="w-full pl-11 pr-4 py-3.5 text-xs bg-bg-light shadow-[var(--shadow-neumorphism-inset)] border border-transparent rounded-2xl focus:outline-none focus:border-gray-40 text-gray-10 font-sans"
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-30 font-bold tracking-widest block uppercase font-mono pl-1">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3.5 text-xs bg-bg-light shadow-[var(--shadow-neumorphism-inset)] border border-transparent rounded-2xl focus:outline-none focus:border-gray-40 text-gray-10 font-mono"
                />
              </div>
            </div>

            {/* 비밀번호 확인 입력 */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-30 font-bold tracking-widest block uppercase font-mono pl-1">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-30" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3.5 text-xs bg-bg-light shadow-[var(--shadow-neumorphism-inset)] border border-transparent rounded-2xl focus:outline-none focus:border-gray-40 text-gray-10 font-mono"
                />
              </div>
            </div>

            {/* 가입 완료 버튼 */}
            <Button
              type="submit"
              disabled={isLoading}
              variant="neumorphism"
              className="w-full py-3 rounded-2xl text-xs font-bold tracking-widest text-gray-20 bg-bg-light shadow-[var(--shadow-neumorphism)] hover:scale-[1.01] active:shadow-[var(--shadow-neumorphism-inset)] transition-all flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <span className="animate-spin text-xs">⏳</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  JOIN OASIS
                </>
              )}
            </Button>

            {/* 알림 메시지 노출 */}
            <div className="h-5 flex items-center justify-center mt-1 text-center px-2">
              {errorMessage && (
                <p className="text-[11px] text-primary font-semibold animate-pulse">
                  ⚠️ {errorMessage}
                </p>
              )}
              {successMessage && (
                <p className="text-[11px] text-green-50 font-semibold">
                  🎉 {successMessage}
                </p>
              )}
            </div>
          </form>

          {/* 로그인 링크 */}
          <p className="text-[10px] text-center text-gray-30 -mt-2">
            이미 계정이 있으신가요?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary font-bold hover:underline cursor-pointer ml-1"
            >
              로그인하기
            </button>
          </p>
        </Panel>
      </div>
    </div>
  );
};

export default RegisterPage;
