import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Panel } from "../components/common/Panel";
import { Button } from "../components/common/Button";
import { InputField } from "../components/common/InputField";
import { loginApi } from "../services/authApi";
import { toast } from "../components/common/Toast";
import { Sparkles, Mail, Lock, Loader2 } from "lucide-react";
import { Tumbleweeds } from "../components/common/Tumbleweeds";
import OASIS25 from "../assets/images/OASIS25.png";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginApi({ email, password });

      // JWT 토큰 로컬 스토리지에 저장
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("tokenType", response.tokenType);

      const from = (location.state as { from?: string } | null)?.from;
      navigate(from || "/", { replace: true });
    } catch (err: any) {
      console.error("Login Error:", err);
      toast.error(
        err.response?.data?.message ||
          "로그인에 실패했습니다. 정보를 다시 확인해 주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[var(--color-app-bg)] overflow-hidden animate-in fade-in duration-300">
      <Tumbleweeds />
      <div className="w-full max-w-md p-4 z-10 relative">
        <Panel
          variant="clay"
          className="p-8 rounded-[36px] flex flex-col space-y-4">
          <div className="text-center mb-8 mt-2">
            <img
              src={OASIS25}
              alt="OASIS25"
              className="h-7 object-contain mx-auto drop-shadow-sm"
            />
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <InputField
              label="EMAIL ADDRESS"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />

            <InputField
              label="PASSWORD"
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {/* 로그인 버튼*/}
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
                  ENTER OASIS
                </>
              )}
            </Button>
          </form>

          {/* 회원가입 및 게스트 로그인 유도 링크 */}
          <p className="text-[10px] text-center text-text-muted flex items-center justify-center gap-1 select-none">
            <span>계정이 없으신가요?</span>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-primary font-bold hover:underline cursor-pointer">
              회원가입
            </button>
            <span className="text-text-muted">또는</span>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("tokenType");
                navigate("/");
              }}
              className="text-primary font-bold hover:underline cursor-pointer">
              게스트로 입장
            </button>
          </p>
        </Panel>
      </div>
    </div>
  );
};

export default LoginPage;
