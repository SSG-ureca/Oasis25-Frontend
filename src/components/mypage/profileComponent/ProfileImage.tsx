import { Button } from "../../common/Button";

interface Props {
    previewUrl: string;

    setPreviewUrl: React.Dispatch<React.SetStateAction<string>>;

    imageFile: File | null;

    setImageFile: React.Dispatch<React.SetStateAction<File | null>>;

    isEditMode: boolean;

    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ProfileImage = ({
    previewUrl,
    setPreviewUrl,
    setImageFile,
    isEditMode,
    fileInputRef,
}: Props) => {
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setImageFile(file);

        setPreviewUrl(URL.createObjectURL(file));
    };

    return (
        <div
            className="
flex
flex-col
items-center
gap-3
"
        >
            <img
                src={previewUrl}
                alt="프로필"
                className="
w-28
h-28
rounded-full
object-cover
border
"
            />

            {isEditMode && (
                <>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleChange}
                    />

                    <Button variant="neumorphism" onClick={handleClick}>
                        사진 변경
                    </Button>
                </>
            )}
        </div>
    );
};
