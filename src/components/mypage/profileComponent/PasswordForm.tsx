interface Props {
    currentPassword: string;

    newPassword: string;

    setCurrentPassword: React.Dispatch<React.SetStateAction<string>>;

    setNewPassword: React.Dispatch<React.SetStateAction<string>>;
}

export const PasswordForm = ({
    currentPassword,
    newPassword,
    setCurrentPassword,
    setNewPassword,
}: Props) => {
    return (
        <div
            className="
            flex
            flex-col

            gap-4

            justify-start
         
            "
        >
            <input
                type="password"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="
                w-full

                rounded-xl
                px-4
                py-3

                bg-clay-bg

                text-text

                outline-none

                shadow-(--shadow-clay-inset)

                transition

                placeholder:text-text-muted

                
            "
            />

            <input
                type="password"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="
                w-full

                rounded-xl
                px-4
                py-3

                bg-clay-bg

                text-text

                outline-none

                shadow-(--shadow-clay-inset)

                transition

                placeholder:text-text-muted

                
            "
            />
        </div>
    );
};
