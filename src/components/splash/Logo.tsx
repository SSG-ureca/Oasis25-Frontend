import splashLogo from "../../assets/images/splashLogo.png";
import splashName from "../../assets/images/splashName.png";

export const Logo = () => {
    return (
        <div className="flex flex-col items-center gap-6">
            {/* 로고 */}
            <div
                className="
                    flex
                    h-32
                    w-32
                    items-center
                    justify-center
                    rounded-full
                    bg-bg-light
                    shadow-glass-neumorphism
                "
            >
                <img
                    src={splashLogo}
                    alt="Oasis25 Logo"
                    className="h-20 w-20 object-contain"
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
