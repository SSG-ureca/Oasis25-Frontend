import type { ProfileResponse } from "../../../types/profile";

interface Props {
    profile: ProfileResponse | null;

    isEditMode: boolean;

    nickname: string;

    setNickname: React.Dispatch<React.SetStateAction<string>>;
}

export const ProfileInfo = ({
    profile,
    isEditMode,
    nickname,
    setNickname,
}: Props) => {
    return (
        <div
            className="
                flex
                flex-col
                items-center

                gap-1

                text-center
            "
        >
            <div
                className="
                    text-xs
                    sm:text-sm

                    text-text-muted

                    break-all
                "
            >
                {profile?.email}
            </div>

            {isEditMode ? (
                <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="
                    w-full

                    rounded-xl

                    px-4
                    py-2

                    bg-clay-bg

                    text-text

                    text-center

                    outline-none

                    shadow-(--shadow-clay-inset)

                    transition

                    placeholder:text-text-muted
                "
                />
            ) : (
                <div
                    className="
                        text-lg
                        880:text-xl

                        font-semibold
                    "
                >
                    {profile?.nickname}
                </div>
            )}
        </div>
    );
};
