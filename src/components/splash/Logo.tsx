import splashLogo from "../../assets/images/splashLogo.png";
import splashName from "../../assets/images/splashName.png";

export const Logo = () => {
    return (
        <div className="flex flex-col items-center gap-6">
            {/* 로고 */}
            <div
                className="
                flex
                h-70
                w-70
                items-center
                justify-center
                rounded-full

                bg-[var(--color-clay-bg)]
                border
                border-[var(--color-clay-border)]

                shadow-[var(--shadow-clay)]
            "
            >
                <img
                    src={splashLogo}
                    alt="Oasis25 Logo"
                    className="h-56 w-56 object-contain"
                />
            </div>

            {/* 글자 로고 */}
            <img
                src={splashName}
                alt="Oasis25"
                className="
                    h-10
                    object-contain
                    select-none
                "
                draggable={false}
            />
        </div>
    );
};
