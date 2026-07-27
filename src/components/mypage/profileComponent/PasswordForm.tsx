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
        h-full
        flex
        flex-col
        justify-center
        gap-4
    "
        >
            <input
                type="password"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="
rounded-lg
p-2
border
"
            />

            <input
                type="password"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="
rounded-lg
p-2
border
"
            />
        </div>
    );
};
