import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Panel } from "../components/common/Panel";
import { Button } from "../components/common/Button";
import { InputField } from "../components/common/InputField";
import { registerApi } from "../services/authApi";
import { toast } from "../components/common/Toast";
import { Sparkles, Mail, Lock, User, Loader2 } from "lucide-react";
import OASIS25 from "../assets/images/OASIS25.png";
import { Tumbleweeds } from "../components/common/Tumbleweeds";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // 상태 선언 (이메일, 닉네임, 비밀번호, 비밀번호 확인, 로딩, 에러/성공 메시지)
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 회원가입 제출 처리
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !nickname.trim()) {
      toast.error("모든 정보를 입력해 주세요.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      // 회원가입 API 호출
      await registerApi({ email, password, nickname });
      toast.success(
        "회원가입이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다.",
        2500,
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Register Error:", err);
      toast.error(
        err.response?.data?.message ||
          "회원가입에 실패했습니다. 입력한 정보를 확인해 주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-bg-light overflow-hidden animate-in fade-in duration-300">
      <Tumbleweeds />
      <div className="w-full max-w-md p-4 z-10 relative">
        <Panel
          variant="clay"
          className="p-8 rounded-[36px] flex flex-col space-y-4">
          {/* 헤더 영역 */}
          <div className="text-center mb-8 mt-2">
            <img
              src={OASIS25}
              alt="OASIS25"
              className="h-7 object-contain mx-auto drop-shadow-sm"
            />
          </div>

          {/* 회원가입 폼 */}
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            {/* 이메일 입력 */}
            <InputField
              label="EMAIL ADDRESS"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />

            {/* 닉네임 입력 */}
            <InputField
              label="NICKNAME"
              icon={User}
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
              required
            />

            {/* 비밀번호 입력 */}
            <InputField
              label="PASSWORD"
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {/* 비밀번호 확인 입력 */}
            <InputField
              label="CONFIRM PASSWORD"
              icon={Lock}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {/* 가입 완료 버튼 */}
            <Button
              type="submit"
              disabled={isLoading}
              variant="clay"
              className="w-full py-3 rounded-2xl text-xs font-bold tracking-widest text-text bg-[var(--color-app-bg)] shadow-[var(--shadow-clay)] hover:scale-[1.01] active:shadow-[var(--shadow-clay-inset)] transition-all flex items-center justify-center gap-1.5">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  JOIN OASIS
                </>
              )}
            </Button>
          </form>

          {/* 로그인 링크 */}
          <p className="text-[10px] text-center text-text-muted">
            이미 계정이 있으신가요?
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary font-bold hover:underline cursor-pointer ml-1">
              로그인하기
            </button>
          </p>
        </Panel>
      </div>
    </div>
  );
};

export default RegisterPage;
