import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import { MusicPlayer } from "../common/MusicPlayer";
import { Panel } from "../common/Panel";
import { useState } from "react";

// [components/layout] Header, Sidebar 등 전체 화면 구조(뼈대)를 구성하는 컴포넌트를 담는 공간입니다.
export default function MainLayout() {
    const [autoPlaySignal, setAutoPlaySignal] = useState(0);
    const [isFocusMode, setIsFocusMode] = useState(false);
    return (
        <div className="min-w-90 w-full bg-(--color-app-bg) desert-grain">
            <div className="sand-overlay"></div>
            <div className="mx-auto flex h-dvh min-h-170 max-w-7xl flex-col gap-y-[clamp(1rem,3vh,2.5rem)] px-4 py-[clamp(1.5rem,4vh,3rem)]">
                <Header />
                <main className="flex min-h-0 flex-1">
                    <Panel
                        variant="clay"
                        className="bg-panel-bg flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto p-[clamp(1.25rem,3vh,2rem)] custom-scrollbar"
                    >
                        <div className="min-h-0 min-w-0 w-full flex-1">
                            <Outlet
                                context={{
                                    triggerAutoPlay: () =>
                                        setAutoPlaySignal((prev) => prev + 1),

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
        </div>
    );
}
