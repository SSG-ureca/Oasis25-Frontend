import { api } from "./api";
import type {
  ProfileResponse,
  UpdateProfileRequest,
  UpdatePasswordRequest,
  UploadProfileImageResponse,
} from "../types/profile";

const PROFILE_API = "/api/users/me";

// 프로필 조회
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>(PROFILE_API);
  return response.data;
};
//닉네임 수정
export const updateProfile = async (
  request: UpdateProfileRequest,
): Promise<ProfileResponse> => {
  const response = await api.patch<ProfileResponse>(PROFILE_API, request);

  return response.data;
};
//프로필 이미지 수정
export const updateProfileImage = async (
  image: File,
): Promise<UploadProfileImageResponse> => {
  const formData = new FormData();

  formData.append("image", image);

  const response = await api.patch<UploadProfileImageResponse>(
    `${PROFILE_API}/profile-image`,
    formData,
  );

  return response.data;
};
//비밀번호 변경
export const updatePassword = async (
  request: UpdatePasswordRequest,
): Promise<void> => {
  await api.patch(`${PROFILE_API}/password`, request);
};
