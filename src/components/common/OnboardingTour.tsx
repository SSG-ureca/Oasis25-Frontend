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
    <div {...tooltipProps} className="opacity-0 pointer-events-none w-0 h-0 absolute overflow-hidden">
      {createPortal(
        <div className={`fixed top-[10vh] left-1/2 -translate-x-1/2 w-[90%] max-w-[450px] p-6 rounded-[24px] z-[10001] flex flex-col gap-4 border backdrop-blur-xl ${
          isDark 
            ? 'bg-[#2a251f]/60 text-white border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]' 
            : 'bg-white/60 text-black border-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)]'
        }`}>
          <div style={{ textShadow: isDark ? '0 1px 2px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.8)' }}>
            {step.content}
          </div>
          <div className="flex justify-between items-center mt-2">
            <button {...skipProps} className={`text-sm ${isDark ? 'text-[#a3a3a3] hover:text-white' : 'text-[#666666] hover:text-black'} transition-colors`}>
              건너뛰기
            </button>
            <div className="flex gap-2">
              {index > 0 && (
                <button {...backProps} className={`px-4 py-2 text-sm font-medium ${isDark ? 'text-[#a3a3a3] hover:text-white' : 'text-[#666666] hover:text-black'} transition-colors`}>
                  이전
                </button>
              )}
              <button {...primaryProps} className="px-5 py-2.5 text-sm bg-[#E2A03F] text-white rounded-xl font-bold shadow-md hover:bg-[#d18e32] transition-colors">
                {isLastStep ? '완료' : '다음'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
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
        <h3 className="text-lg font-bold">집중의 시작, 뽀모도로</h3>
        <p className="text-sm opacity-90">타이머를 설정하고 몰입해보세요. 집중 모드를 켜면 불필요한 요소들이 사라집니다.</p>
      </div>
    ),
    placement: "right",
    route: "/main",
  } as any,
  {
    target: "#tour-todo",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-lg font-bold">오늘 할 일(To-Do)</h3>
        <p className="text-sm opacity-90">목표한 시간을 설정하고 할 일을 적어보세요. 입력창에 내용을 작성한 후 엔터를 누르면 손쉽게 리스트에 추가됩니다. 체계적으로 하루를 계획해 볼까요?</p>
      </div>
    ),
    placement: "right",
    route: "/main",
  } as any,
  {
    target: "#tour-nav-retrospect",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-lg font-bold">페이지 이동</h3>
        <p className="text-sm opacity-90">상단의 네비게이션 메뉴를 통해 화면이 전환됩니다. 회고 페이지로 이동해볼까요?</p>
      </div>
    ),
    placement: "bottom",
    route: "/main",
  } as any,
  {
    target: "#tour-retrospect-content",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-lg font-bold">하루를 마무리하는 회고</h3>
        <p className="text-sm opacity-90">오늘 하루 집중한 시간과 완료한 일들을 돌아보며 뜻깊은 회고록을 남겨보세요. 달력에서 원하는 날짜를 선택하면 지난 날의 회고 기록들도 언제든지 다시 열어볼 수 있습니다.</p>
      </div>
    ),
    placement: "bottom",
    route: "/retrospect",
  } as any,
  {
    target: "#tour-nav-stats",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-lg font-bold">통계로 이동</h3>
        <p className="text-sm opacity-90">다음으로 나의 성장 기록을 볼 수 있는 통계 페이지로 넘어가겠습니다.</p>
      </div>
    ),
    placement: "bottom",
    route: "/retrospect",
  } as any,
  {
    target: "#tour-stats-content",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-lg font-bold">나의 성장 통계</h3>
        <p className="text-sm opacity-90">차곡차곡 쌓인 나의 생산성 데이터를 한눈에 확인해보세요! 시간대, 날씨, 감정, 그리고 월별 통계를 통해 나의 몰입 패턴이 어떻게 변화하는지 심층적으로 파악할 수 있습니다.</p>
      </div>
    ),
    placement: "bottom",
    route: "/stats",
  } as any,
  {
    target: "#tour-nav-mypage",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-lg font-bold">마이페이지로 이동</h3>
        <p className="text-sm opacity-90">마지막으로 사용자 설정을 관리하는 마이페이지를 살펴보겠습니다.</p>
      </div>
    ),
    placement: "bottom",
    route: "/stats",
  } as any,
  {
    target: "#tour-mypage-content",
    content: (
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-lg font-bold">마이페이지</h3>
        <p className="text-sm opacity-90">나만의 오아시스를 꾸며볼 차례입니다. 프로필과 환경 설정을 취향에 맞게 관리해보세요. 집중을 도와줄 다양한 ASMR을 들어보고, 가장 마음에 드는 알람음을 직접 선택하실 수도 있습니다.</p>
      </div>
    ),
    placement: "bottom",
    route: "/mypage",
  } as any,
].map(step => ({
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
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as any).current = node;
      }} 
      className="opacity-0 pointer-events-none absolute w-0 h-0" 
    />
  );
});

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ run, setRun }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
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

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      onEvent={handleJoyrideCallback}
      tooltipComponent={CustomTooltip}
      beaconComponent={AutoClickBeacon}
      styles={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        },
        spotlight: {
          stroke: "#E2A03F",
          strokeWidth: 3,
          rx: 16,
          filter: "drop-shadow(0 0 10px rgba(226, 160, 63, 0.8))"
        }
      }}
    />
  );
};
