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
flex

justify-center
880:justify-end

gap-2

shrink-0
"
        >
            {isEditMode ? (
                <>
                    <Button
                        className="
        min-w-20
        880:min-w-0
    "
                        variant="clay"
                        onClick={() => setIsEditMode(false)}
                    >
                        취소
                    </Button>

                    <Button
                        className="
        min-w-20
        880:min-w-0
    "
                        onClick={onComplete}
                    >
                        완료
                    </Button>
                </>
            ) : (
                <Button
                    className="
        min-w-20
        880:min-w-0
    "
                    onClick={() => setIsEditMode(true)}
                >
                    수정
                </Button>
            )}
        </div>
    );
};
