import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../common/Header";
import { MusicPlayer } from "../common/MusicPlayer";
import { Panel } from "../common/Panel";
import { OnboardingTour } from "../common/OnboardingTour";

export default function MainLayout() {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [pendingTourStart, setPendingTourStart] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [autoPlaySignal, setAutoPlaySignal] = useState(0);
  const [isFocusMode, setIsFocusMode] = useState(false);

  React.useEffect(() => {
    if (pendingTourStart && location.pathname === "/main") {
      // 렌더링이 완료된 후 투어를 시작하도록 타이머 사용
      const timer = setTimeout(() => {
        setIsTourOpen(true);
        setPendingTourStart(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pendingTourStart, location.pathname]);

  const handleStartTour = () => {
    if (location.pathname !== "/main" && location.pathname !== "/") {
      navigate("/main");
      setPendingTourStart(true);
    } else {
      setIsTourOpen(true);
    }
  };

  return (
    <div className="min-w-90 w-full bg-(--color-app-bg) desert-grain">
      <div className="sand-overlay"></div>
      <div className="mx-auto flex h-dvh min-h-170 max-w-7xl flex-col gap-y-[clamp(1rem,3vh,2.5rem)] px-4 py-[clamp(1.5rem,4vh,3rem)]">
        <Header onStartTour={handleStartTour} />
        <main className="flex min-h-0 flex-1">
          <Panel
            variant="clay"
            className="bg-panel-bg flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto p-[clamp(1.25rem,3vh,2rem)] custom-scrollbar"
          >
            <div className="min-h-0 min-w-0 w-full flex-1">
              <Outlet
                context={{
                  triggerAutoPlay: () => setAutoPlaySignal((prev) => prev + 1),

                  isFocusMode,
                  setFocusMode: setIsFocusMode,
                }}
              />
            </div>
          </Panel>
        </main>
        <footer className="shrink-0">
          <MusicPlayer autoPlaySignal={autoPlaySignal} />
        </footer>
      </div>
      <OnboardingTour run={isTourOpen} setRun={setIsTourOpen} />
    </div>
  );
}
