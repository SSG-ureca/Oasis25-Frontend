import { Button } from "../../common/Button";
import { Panel } from "../../common/Panel";

interface ProfileOptionsProps {
    autoPlay: boolean;
    setAutoPlay: (value: boolean) => void;

    focusMode: boolean;
    setFocusMode: (value: boolean) => void;
}

export const ProfileOptions = ({
    autoPlay,
    setAutoPlay,
    focusMode,
    setFocusMode,
}: ProfileOptionsProps) => {
    return (
        <div
            className="
                h-full
                flex
                flex-col
                justify-center
                gap-4
            "
        >
            {/* 음악 자동 재생 */}
            <OptionToggle
                label="음악 자동 재생"
                value={autoPlay}
                onChange={setAutoPlay}
            />

            {/* 집중 모드 */}
            <OptionToggle
                label="집중 모드"
                value={focusMode}
                onChange={setFocusMode}
            />
        </div>
    );
};

interface OptionToggleProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

const OptionToggle = ({ label, value, onChange }: OptionToggleProps) => {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                gap-4
            "
        >
            <span className="text-sm sm:text-base">{label}</span>

            <Panel
                variant="clay"
                inset
                className="
                    p-2
                    px-4
                    flex
                    items-center
                    gap-1
                "
            >
                <Button
                    onClick={() => onChange(true)}
                    className={`
                        transition-all
                        duration-200
                        rounded-2xl
                        shadow-md
                        ${
                            value
                                ? `
                                px-3
                                py-1
                                `
                                : `
                                px-3
                                py-1
                                 bg-transparent
                                shadow-none
                                border-none
                               
                                opacity-50
                               
                                `
                        }
                    `}
                >
                    ON
                </Button>

                <Button
                    onClick={() => onChange(false)}
                    className={`
                    
                        transition-all
                        duration-200
                        shadow-md
                        ${
                            !value
                                ? `
                                px-3
                                py-1                      
                                `
                                : `
                                px-3
                                py-1
                                bg-transparent
                                shadow-none
                                border-none
                                
                                opacity-50                      
                                `
                        }
                    `}
                >
                    OFF
                </Button>
            </Panel>
        </div>
    );
};
