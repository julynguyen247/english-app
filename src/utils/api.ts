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
export const getAllExerciseAndOptionAPI = (lessonId: number) => {
  return axios.get("/api/exercise-options/getallexerciseandoption", {
    params: { lessonId },
  });
};
export const loginWithGoogleAPI = (
  returnUrl = "/api/Authentication/profile"
) => {
  const url = `/api/Authentication/signin-google?returnUrl=${encodeURIComponent(
    returnUrl
  )}`;
  return axios.get(url);
};
export const loginWithFacebookAPI = () => {
  return axios.get(`/api/Authentication/login-facebook`);
};
export const getCurrentUserInfoAPI = () => {
  return axios.get("/getcurrentuserinfo");
};
export const addDeckAPI = async (name: string) => {
  const response = await axios.post("/api/adddeck", {
    name,
    flashCardNumber: 0,
  });
  return response;
};
export const getFlashcardsByDeckIdAPI = async (idDeck: number | string) => {
  const response = await axios.get<IFlashcard[]>(
    `/api/getflashcardbyiddeck/${idDeck}`
  );
  return response;
};
export const addFlashcardAPI = async (
  deckId: number | string,
  cards: { frontText: string; backText: string }[]
) => {
  const response = await axios.post("/api/addflashcard", cards, {
    params: { deckId },
  });
  return response;
};
export const getAllSavedDecksAPI = async () => {
  const response = await axios.get("/api/allsaveddecks");
  return response;
};
export const getAllDecksAPI = async () => {
  const response = await axios.get<IDeck[]>("/api/getallpublicdeck");
  return response;
};
