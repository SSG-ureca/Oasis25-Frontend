export interface ProfileResponse {
    email: string;
    nickname: string;
    profileImage: string;
}

export interface UpdateProfileRequest {
    nickname: string;
}

export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface UploadProfileImageResponse {
    id: number;
    email: string;
    nickname: string;
    role: string;
    profileImageUrl: string;
}
