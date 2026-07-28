import { RetrospectSearchPanel } from "../components/retrospect/RetrospectSearchPanel";
import { RetrospectWritePanel } from "../components/retrospect/RetrospectWritePanel";

export const RetrospectPage = () => {
    return (
        <div
            className="
        

        grid
        grid-cols-1
        gap-4
        pb-5
        880:grid-cols-[2fr_3fr]
    "
        >
            <RetrospectSearchPanel />

            <RetrospectWritePanel />
        </div>
    );
};
