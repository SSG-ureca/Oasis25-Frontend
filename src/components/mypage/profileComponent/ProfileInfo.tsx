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
    <>
      {isEditMode ? (
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="
rounded-lg
p-2
border
"
        />
      ) : (
        <div className="text-xl font-semibold">{profile?.nickname}</div>
      )}

      <div className="text-sm text-text-muted">{profile?.email}</div>
    </>
  );
};
