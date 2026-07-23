import { RetrospectSearchPanel } from "../components/retrospect/RetrospectSearchPanel";
import { RetrospectWritePanel } from "../components/retrospect/RetrospectWritePanel";

export const RetrospectPage = () => {
    return (
        <div
            className="
                h-full
                grid
                grid-cols-[2fr_3fr]
                gap-4
                col-span-2
            "
        >
            {/* 이전 회고 조회 패널 */}
            <RetrospectSearchPanel />

            {/* 회고 작성 패널 */}
            <RetrospectWritePanel />
        </div>
    );
};
