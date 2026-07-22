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
            variant="glassNeumorphism"
            className="
                p-6
                h-full
                w-full
                flex
                flex-col
                gap-6
                min-h-0
                items-start
                justify-start
            "
        >
            {/* 패널 명, 헤더 버튼 */}
            <div
                className="
                w-full
                flex
                items-center
                justify-between
            "
            >
                <h2
                    className="
                    text-xl
                    font-semibold
                    text-gray-10
                "
                >
                    {title}
                </h2>

                {header}
            </div>

            {/* 패널 내부 요소 */}
            <div
                className="
                    flex-1
                    min-h-0
                    w-full
                "
            >
                {children}
            </div>
            <div className="w-full flex justify-end">{footer}</div>
        </Panel>
    );
};
