import { useState, useEffect, useRef } from "react";
import { toast } from "../../common/Toast";

import { Panel } from "../../common/Panel";

import type { ProfileResponse } from "../../../types/profile";

import {
    getProfile,
    updateProfile,
    updateProfileImage,
    updatePassword,
} from "../../../services/profileApi";

import { ProfileImage } from "./ProfileImage";
import { ProfileInfo } from "./ProfileInfo";
import { PasswordForm } from "./PasswordForm";
import { ProfileActions } from "./ProfileActions";
import logoImage from "../../../assets/images/logo.png";

const DEFAULT_PROFILE_IMAGE = logoImage;

export const ProfileEditor = () => {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    const [isEditMode, setIsEditMode] = useState(false);

    const [editNickname, setEditNickname] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [imageFile, setImageFile] = useState<File | null>(null);

    const [previewUrl, setPreviewUrl] = useState(DEFAULT_PROFILE_IMAGE);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // 프로필 데이터 갱신 함수
    const loadProfile = async () => {
        const data = await getProfile();

        setProfile(data);

        setEditNickname(data.nickname);

        setPreviewUrl(data.profileImage || DEFAULT_PROFILE_IMAGE);
    };

    // 최초 프로필 조회
    useEffect(() => {
        const initProfile = async () => {
            try {
                setLoading(true);

                await loadProfile();
            } catch {
                setError("프로필을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        initProfile();
    }, []);

    const handleComplete = async () => {
        try {
            if (profile && editNickname !== profile.nickname) {
                await updateProfile({
                    nickname: editNickname,
                });
            }

            if (imageFile) {
                await updateProfileImage(imageFile);
            }

            if (currentPassword && newPassword) {
                await updatePassword({
                    currentPassword,
                    newPassword,
                });
            }

            // 수정 후 최신 데이터 다시 조회
            await loadProfile();

            setImageFile(null);

            setCurrentPassword("");

            setNewPassword("");

            setIsEditMode(false);

            toast.success("프로필이 수정되었습니다.");
        } catch (error) {
            console.error(error);

            toast.error("프로필 수정 실패");
        }
    };

    if (loading) {
        return <div>로딩중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Panel
            className="
        flex
        flex-col
        flex-1

        min-h-0
        overflow-auto

        gap-6
        p-6
    "
        >
            <ProfileImage
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                imageFile={imageFile}
                setImageFile={setImageFile}
                isEditMode={isEditMode}
                fileInputRef={fileInputRef}
            />

            <ProfileInfo
                profile={profile}
                isEditMode={isEditMode}
                nickname={editNickname}
                setNickname={setEditNickname}
            />

            {isEditMode && (
                <PasswordForm
                    currentPassword={currentPassword}
                    newPassword={newPassword}
                    setCurrentPassword={setCurrentPassword}
                    setNewPassword={setNewPassword}
                />
            )}

            <ProfileActions
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
                onComplete={handleComplete}
            />
        </Panel>
    );
};
