import { Button } from "../../common/Button";

interface Props {
    isEditMode: boolean;

    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;

    onComplete: () => void;
}

export const ProfileActions = ({
    isEditMode,
    setIsEditMode,
    onComplete,
}: Props) => {
    return (
        <div
            className="
        h-10
        flex
        justify-end
        items-center
        gap-2
        shrink-0
    "
        >
            {isEditMode ? (
                <>
                    <Button variant="clay" onClick={() => setIsEditMode(false)}>
                        취소
                    </Button>

                    <Button onClick={onComplete}>완료</Button>
                </>
            ) : (
                <Button onClick={() => setIsEditMode(true)}>수정</Button>
            )}
        </div>
    );
};
