import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Panel } from "../components/common/Panel";
import { Button } from "../components/common/Button";
import { InputField } from "../components/common/InputField";
import { loginApi } from "../services/authApi";
import { Sparkles, Mail, Lock } from "lucide-react";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await loginApi({ email, password });

      // JWT 토큰 로컬 스토리지에 저장
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("tokenType", response.tokenType);

      navigate("/");
    } catch (err: any) {
      console.error("Login Error:", err);
      setErrorMessage(
        err.response?.data?.message ||
          "로그인에 실패했습니다. 정보를 다시 확인해 주세요.",
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
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-bg-light shadow-[var(--shadow-neumorphism)] mx-auto text-2xl">
              로고
            </div>
            <h2 className="text-xl font-bold text-gray-20 tracking-tight">
              Login
            </h2>
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
              variant="neumorphism"
              className="w-full py-3 rounded-2xl text-xs font-bold tracking-widest text-gray-20 bg-bg-light shadow-[var(--shadow-neumorphism)] hover:scale-[1.01] active:shadow-[var(--shadow-neumorphism-inset)] transition-all flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <span className="animate-spin text-xs">⏳</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  ENTER OASIS
                </>
              )}
            </Button>

            {/* 에러 메시지 영역*/}
            <div className="h-5 flex items-center justify-center mt-1">
              {errorMessage && (
                <p className="text-[11px] text-primary font-semibold animate-pulse">
                  ⚠️ {errorMessage}
                </p>
              )}
            </div>
          </form>

          {/* 회원가입 페이지 유도 링크 */}
          <p className="text-[10px] text-center text-gray-30 -mt-2">
            계정이 없으신가요?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-primary font-bold hover:underline cursor-pointer ml-1"
            >
              회원가입하기
            </button>
          </p>
        </Panel>
      </div>
    </div>
  );
};

export default LoginPage;
