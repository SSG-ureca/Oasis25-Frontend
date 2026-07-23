export const Loading = () => {
    return (
        <div
            className="
                flex
                items-center
                gap-2
                text-gray-30
            "
        >
            <span className="animate-pulse">●</span>
            <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>
                ●
            </span>
            <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>
                ●
            </span>
        </div>
    );
};
