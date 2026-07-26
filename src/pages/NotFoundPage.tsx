import { useNavigate } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

import { Button } from "../components/common/Button";
import { Panel } from "../components/common/Panel";
import { Tumbleweeds } from "../components/common/Tumbleweeds";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <main
            className="
                relative
                flex
                h-screen
                w-screen
                items-center
                justify-center
                overflow-hidden

                bg-[var(--color-app-bg)]

                desert-grain
            "
        >
            <div className="sand-overlay" />

            <div
                className="
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_50%_30%,rgba(255,248,230,.22),transparent_65%)]
                "
            />

            <Tumbleweeds />

            <div className="relative z-10 w-full max-w-xl px-6">
                <Panel
                    variant="clay"
                    className="
                        flex
                        flex-col
                        items-center
                        gap-6
                        rounded-3xl
                        p-10
                        text-center
                    "
                >
                    <TriangleAlert
                        size={72}
                        className="text-[var(--color-text-muted)]"
                    />

                    <h1
                        className="
                            text-6xl
                            font-bold
                            tracking-wider
                        "
                    >
                        404
                    </h1>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">
                            잘못된 페이지 입니다.
                        </h2>

                        <p
                            className="
                                text-base
                                leading-relaxed
                                text-[var(--color-text-muted)]
                            "
                        >
                            사막을 헤매는 동안
                            <br />
                            찾으시는 오아시스를 발견하지 못했습니다.
                        </p>
                    </div>

                    <Button
                        variant="clay"
                        onClick={() => navigate("/")}
                        className="
                            mt-2
                            w-full
                            max-w-xs
                            py-3
                        "
                    >
                        Oasis25 로 돌아가기
                    </Button>
                </Panel>
            </div>
        </main>
    );
}
