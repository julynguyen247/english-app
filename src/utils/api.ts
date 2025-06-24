import axios from "@/utils/api.customize";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const signUpSendOtpAPI = (
  email: string,
  password: string,
  confirmPassword: string
) => {
  const url = `/api/Authentication/signupsendotp`;
  return axios.post(url, { email, password, confirmPassword });
};
export const signUpReceiveOtpAPI = (email: string, otp: string) => {
  const url = `/api/Authentication/signupreceiveotp`;
  return axios.post(url, { email, otp });
};
export const login = (email: string, password: string) => {
  const url = `/api/Authentication/login`;
  return axios.post(url, { email, password });
};
export const resetMailPass = (email: string) => {
  const url = `/api/Authentication/sendresetpasswordcode`;
  return axios.post(url, { email });
};
export const resetPass = (
  email: string,
  resetCode: string,
  newPassword: string
) => {
  const url = `/api/Authentication/resetpassword`;
  return axios.post(url, { email, resetCode, newPassword });
};
export const sendResetPasswordCodeAPI = (email: string) => {
  const url = "/api/Authentication/sendresetpasswordcode";
  return axios.post(url, { email });
};
export const resetPasswordAPI = (
  email: string,
  resetCode: string,
  newPassword: string
) => {
  const url = "/api/Authentication/resetpassword";
  return axios.post(url, {
    email,
    resetCode,
    newPassword,
  });
};
export const getCategoriesAPI = () => {
  return axios.get("/api/categories");
};
export const getLessonsByCategoryAPI = (categoryId: number, level: string) => {
  return axios.get<ILesson[]>("/api/lessons", {
    params: {
      categoryId,
      level,
    },
  });
};
export const getExercisesByLessonIdAPI = (lessonId: number) => {
  return axios.get(`/api/exercises/${lessonId}`);
};
