import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Joyride, ACTIONS, EVENTS } from "react-joyride";
import type { Step, TooltipRenderProps } from "react-joyride";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

const CustomTooltip = ({
  index,
  step,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
}: TooltipRenderProps) => {
  const { isDark } = useTheme();

  return (
    <div
      {...tooltipProps}
      className={`w-[90vw] max-w-[320px] p-5 rounded-[20px] z-[10001] flex flex-col gap-4 border backdrop-blur-xl ${
        (step as any).isCentered
          ? "!fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !m-0"
          : ""
      } ${
        isDark
          ? "bg-[#2a251f]/90 text-white border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          : "bg-white/95 text-black border-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
      }`}
    >
      <div
        style={{
          textShadow: isDark
            ? "0 1px 2px rgba(0,0,0,0.8)"
            : "0 1px 2px rgba(255,255,255,0.8)",
        }}
      >
        {step.content}
      </div>
    </div>
  );
};

interface OnboardingTourProps {
  run: boolean;
  setRun: (run: boolean) => void;
}

const steps: Step[] = [
  {
    target: "#tour-pomodoro",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-xl font-extrabold">
          집중의 시작, <span className="text-[#72c877]">뽀모도로</span>
        </h3>
        <p className="text-[15px] leading-relaxed opacity-90">
          타이머를 설정하고 몰입해보세요.{" "}
          <strong className="font-bold text-[#72c877]">집중 모드</strong>를 켜면
          불필요한 요소들이 사라집니다.
        </p>
      </div>
    ),
    placement: "right",
    route: "/main",
  } as any,
  {
    target: "#tour-todo",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-xl font-extrabold">
          오늘 할 일 <span className="text-[#72c877]">(To-Do)</span>
        </h3>
        <p className="text-[15px] leading-relaxed opacity-90">
          목표한 시간을 설정하고 할 일을 적어보세요. 입력창에 내용을 작성한 후{" "}
          <strong className="font-bold text-[#72c877]">엔터</strong>를 누르면
          손쉽게 리스트에 추가됩니다. 체계적으로 하루를 계획해 볼까요?
        </p>
      </div>
    ),
    placement: "right",
    route: "/main",
  } as any,
  {
    target: "#tour-cactus",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-xl font-extrabold">
          나만의 반려 식물, <span className="text-[#72c877]">선인장</span>
        </h3>
        <p className="text-[15px] leading-relaxed opacity-90">
          수분과 카페인 섭취량에 따라{" "}
          <strong className="font-bold text-[#72c877]">선인장의 모습</strong>이
          변합니다. 건강한 습관을 기록하며 선인장도 예쁘게 키워보세요!
        </p>
      </div>
    ),
    placement: "left",
    route: "/main",
  } as any,
  {
    target: "#tour-nav-retrospect",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-xl font-extrabold">페이지 이동</h3>
        <p className="text-[15px] leading-relaxed opacity-90">
          상단의 네비게이션 메뉴를 통해 화면이 전환됩니다.{" "}
          <strong className="font-bold text-[#72c877]">회고 페이지</strong>로
          이동해볼까요?
        </p>
      </div>
    ),
    placement: "bottom",
    route: "/main",
  } as any,
  {
    target: "#tour-retrospect-content",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-xl font-extrabold">
          하루를 마무리하는 <span className="text-[#72c877]">회고</span>
        </h3>
        <p className="text-[15px] leading-relaxed opacity-90">
          오늘 하루 집중한 시간과 완료한 일들을 돌아보며 뜻깊은 회고록을
          남겨보세요.{" "}
          <strong className="font-bold text-[#72c877]">
            달력에서 원하는 날짜를 선택
          </strong>
          하면 지난 날의 회고 기록들도 언제든지 다시 열어볼 수 있습니다.
        </p>
      </div>
    ),
    placement: "bottom",
    route: "/retrospect",
    isCentered: true,
  } as any,
  {
    target: "#tour-nav-stats",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-xl font-extrabold">통계로 이동</h3>
        <p className="text-[15px] leading-relaxed opacity-90">
          다음으로 나의 성장 기록을 볼 수 있는{" "}
          <strong className="font-bold text-[#72c877]">통계 페이지</strong>로
          넘어가겠습니다.
        </p>
      </div>
    ),
    placement: "bottom",
    route: "/retrospect",
  } as any,
  {
    target: "#tour-stats-content",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-xl font-extrabold">
          나의 성장 <span className="text-[#72c877]">통계</span>
        </h3>
        <p className="text-[15px] leading-relaxed opacity-90">
          차곡차곡 쌓인 나의 생산성 데이터를 한눈에 확인해보세요!{" "}
          <strong className="font-bold text-[#72c877]">시간대</strong>,{" "}
          <strong className="font-bold text-[#72c877]">날씨</strong>,{" "}
          <strong className="font-bold text-[#72c877]">감정</strong>, 그리고{" "}
          <strong className="font-bold text-[#72c877]">월별 통계</strong>를 통해
          나의 몰입 패턴이 어떻게 변화하는지 심층적으로 파악할 수 있습니다.
        </p>
      </div>
    ),
    placement: "bottom",
    route: "/stats",
    isCentered: true,
  } as any,
  {
    target: "#tour-nav-mypage",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-xl font-extrabold">마이페이지로 이동</h3>
        <p className="text-[15px] leading-relaxed opacity-90">
          마지막으로 사용자 설정을 관리하는{" "}
          <strong className="font-bold text-[#72c877]">마이페이지</strong>를
          살펴보겠습니다.
        </p>
      </div>
    ),
    placement: "bottom",
    route: "/stats",
  } as any,
  {
    target: "#tour-mypage-content",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-xl font-extrabold">마이페이지</h3>
        <p className="text-[15px] leading-relaxed opacity-90">
          프로필과 환경 설정을 취향에 맞게 관리해보세요. 집중을 도와줄 다양한{" "}
          <strong className="font-bold text-[#72c877]">ASMR</strong>을 들어보고,
          가장 마음에 드는{" "}
          <strong className="font-bold text-[#72c877]">알람음</strong>을 직접
          선택하실 수도 있습니다. 이제 Oasis25로 떠나볼까요?
        </p>
      </div>
    ),
    placement: "bottom",
    route: "/mypage",
    isCentered: true,
  } as any,
].map((step) => ({
  ...step,
  disableBeacon: true,
  disableArrow: true,
  spotlightRadius: 16,
  spotlightPadding: 8,
}));

const AutoClickBeacon = React.forwardRef<HTMLSpanElement, any>((props, ref) => {
  const localRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localRef.current && localRef.current.parentElement) {
        localRef.current.parentElement.click();
      }
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span
      ref={(node) => {
        localRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as any).current = node;
      }}
      className="opacity-0 pointer-events-none absolute w-0 h-0"
    />
  );
});

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  run,
  setRun,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  const [stepIndex, setStepIndex] = useState(0);

  const handleJoyrideCallback = (data: any) => {
    const { action, index, status, type } = data;

    const isFinished =
      status === "finished" ||
      status === "skipped" ||
      action === "close" ||
      action === "skip" ||
      type === "tour:end";

    if (isFinished) {
      setRun(false);
      setStepIndex(0);
      navigate("/main"); // 투어 종료 시 기본 화면으로 복귀
      return;
    }

    if (type === EVENTS.STEP_AFTER) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      if (nextStepIndex >= 0 && nextStepIndex < steps.length) {
        const nextRoute = (steps[nextStepIndex] as any).route;

        // 경로가 변경되어야 한다면 네비게이트 후 스텝 변경
        if (nextRoute && location.pathname !== nextRoute) {
          navigate(nextRoute);
        }

        // 페이지 렌더링(타겟 렌더링)을 기다린 후 스텝을 변경
        setTimeout(() => {
          setStepIndex(nextStepIndex);
        }, 300);
      } else if (nextStepIndex >= steps.length) {
        // 마지막 스텝에서 다음(완료)을 누른 경우
        setRun(false);
        setStepIndex(0);
        navigate("/main");
      }
    } else if (type === EVENTS.TARGET_NOT_FOUND) {
      console.warn("Tour target not found:", data);
      // 타겟을 못찾으면 일단 중단하지 말고 기다림 (또는 StrictMode 이슈 회피)
      // setRun(false);
      // setStepIndex(0);
    }
  };

  const handleNext = () => {
    const nextStepIndex = stepIndex + 1;
    if (nextStepIndex < steps.length) {
      const nextRoute = (steps[nextStepIndex] as any).route;
      if (nextRoute && location.pathname !== nextRoute) {
        navigate(nextRoute);
        setTimeout(() => setStepIndex(nextStepIndex), 300);
      } else {
        setStepIndex(nextStepIndex);
      }
    } else {
      setRun(false);
      setStepIndex(0);
      navigate("/main");
    }
  };

  const handlePrev = () => {
    const prevStepIndex = stepIndex - 1;
    if (prevStepIndex >= 0) {
      const prevRoute = (steps[prevStepIndex] as any).route;
      if (prevRoute && location.pathname !== prevRoute) {
        navigate(prevRoute);
        setTimeout(() => setStepIndex(prevStepIndex), 300);
      } else {
        setStepIndex(prevStepIndex);
      }
    }
  };

  const handleSkip = () => {
    setRun(false);
    setStepIndex(0);
    navigate("/main");
  };

  return (
    <>
      {run &&
        createPortal(
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10002] w-full max-w-7xl px-8 flex justify-end pointer-events-none">
            <div className="flex gap-2 items-center pointer-events-auto">
              <button
                onClick={handleSkip}
                className={`px-4 py-2.5 text-sm rounded-full backdrop-blur-md shadow-lg ${isDark ? "text-[#e0e0e0] bg-black/40 hover:bg-black/60" : "text-[#333] bg-white/60 hover:bg-white/80"} transition-all`}
              >
                건너뛰기
              </button>
              {stepIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className={`px-5 py-2.5 text-sm font-medium rounded-full shadow-lg backdrop-blur-md ${isDark ? "text-white bg-white/10 hover:bg-white/20" : "text-black bg-white/80 hover:bg-white"} transition-all`}
                >
                  이전
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-2.5 text-sm bg-[#72c877] text-white rounded-full font-bold shadow-lg hover:bg-[#2c8f31] transition-colors whitespace-nowrap"
              >
                {stepIndex === steps.length - 1 ? "Oasis25 시작하기!" : "다음"}
              </button>
            </div>
          </div>,
          document.body,
        )}
      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        continuous
        disableScrolling
        onEvent={handleJoyrideCallback}
        tooltipComponent={CustomTooltip}
        beaconComponent={AutoClickBeacon}
        floaterProps={{ hideArrow: true }}
        styles={{
          options: {
            arrowColor: "transparent",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          spotlight: {
            stroke: "#72c877",
            strokeWidth: 3,
            rx: 16,
            filter: "drop-shadow(0 0 10px rgba(114, 200, 119, 0.8))",
          },
        }}
      />
    </>
  );
};
