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
        if (!isEditMode) return;

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
        justify-center
        shrink-0

        pt-6
        sm:pt-7
        880:pt-8
    "
        >
            <div
                className="
            relative

            w-44
            h-44

            sm:w-48
            sm:h-48

            880:w-60
            880:h-60
        "
            >
                <img
                    src={previewUrl}
                    alt="프로필"
                    onClick={handleClick}
                    title={isEditMode ? "프로필 사진 변경" : undefined}
                    className={`
                    
                        w-44
                        h-44

                        sm:w-48
                        sm:h-48

                        880:w-60
                        880:h-60

                    
                    rounded-full
                    object-cover
                    border
                    transition

                    ${isEditMode ? "cursor-pointer hover:opacity-80" : ""}
                `}
                />

                {isEditMode && (
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleChange}
                    />
                )}
            </div>
        </div>
    );
};
