// 회고 페이지에서 사용하는 패널의 틀 컴포넌트

import type { ReactNode } from "react";
import { Panel } from "../common/Panel";

interface RetrospectPanelProps {
    title: string;
    children: ReactNode;
    header: ReactNode;
    footer: ReactNode;
}

export const RetrospectPanel = ({
    title,
    children,
    header,
    footer,
}: RetrospectPanelProps) => {
    return (
        <Panel
            variant="clay"
            className="
                p-6
                h-full
                w-full

                flex
                flex-col
                gap-6
                min-h-0
                overflow-y-auto
            "
        >
            {/* 헤더 */}
            <div
                className="
                    w-full
                    flex
                    items-center
                    justify-between

                    shrink-0
                "
            >
                <h2
                    className="
                        text-xl
                        font-semibold
                        text-text
                    "
                >
                    {title}
                </h2>

                {header}
            </div>

            {/* 컨텐츠 */}
            <div
                className="
                    flex-1
                    
                    w-full
                    overflow-y-auto
                "
            >
                {children}
            </div>

            {/* 하단 버튼 */}
            <div
                className="
                    w-full
                    flex
                    justify-end

                    shrink-0
                "
            >
                {footer}
            </div>
        </Panel>
    );
};
