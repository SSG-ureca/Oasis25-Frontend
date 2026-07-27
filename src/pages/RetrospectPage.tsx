import { RetrospectSearchPanel } from "../components/retrospect/RetrospectSearchPanel";
import { RetrospectWritePanel } from "../components/retrospect/RetrospectWritePanel";

export const RetrospectPage = () => {
    return (
        <div
            className="
                h-full
                min-h-0
                w-full

                grid
                grid-cols-1

                gap-4

                880:grid-cols-[2fr_3fr]
            "
        >
            <RetrospectSearchPanel />

            <RetrospectWritePanel />
        </div>
    );
};
