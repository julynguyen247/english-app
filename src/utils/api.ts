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
  return axios.get<IExerciseWithOptions[]>(
    "/api/exercise-options/getallexerciseandoption",
    {
      params: { lessonId },
    }
  );
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
  return axios.get<IFetchUser>("/getcurrentuserinfo");
};
export const addDeckAPI = async (name: string, ownerId: number) => {
  const response = await axios.post(
    "/api/adddeck",
    {
      name,
      status: "private",
    },
    {
      params: { ownerId },
    }
  );
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
export const getAllSavedDecksAPI = async (userId: number) => {
  const response = await axios.get("/api/allsaveddecks", {
    params: { userId },
  });
  return response;
};
export const getAllDecksAPI = async () => {
  const response = await axios.get<IDeck[]>("/api/getallpublicdeck");
  return response;
};
export const saveDeckAPI = async (deckID: number) => {
  const response = await axios.post(`/api/savedeck?deckID=${deckID}`);
  return response;
};
export const getOwnDecksAPI = async (ownerId: number) => {
  const response = await axios.get("/api/getowndecks", {
    params: { ownerId },
  });
  return response;
};
export const updateDeckStatusAPI = async (
  deckId: number,
  newStatus: string,
  currentName: string
) => {
  const response = await axios.put(`/api/editdeck/${deckId}`, {
    name: currentName,
    status: newStatus,
  });
  return response;
};
export const getAllExamsAPI = async () => {
  const response = await axios.get<IExam[]>("/api/allexams");
  return response;
};
export const getSectionsByExamIdAPI = async (examId: number) => {
  const response = await axios.get<ISection[]>(
    `/api/exams/GetSectionsByExamId/${examId}`
  );
  return response;
};
export const getQuestionsBySectionIdAPI = async (sectionId: number) => {
  const response = await axios.get(
    `/api/sections/GetQuestionsBySectionId/${sectionId}`
  );
  return response;
};
export const addUserExamResultAPI = async (results: IUserExamResult[]) => {
  const res = await axios.post("/api/adduserexamresult", results);
  return res;
};
export const getExamScoreAPI = async (
  idUser?: number,
  idExam?: number,
  sectionId?: number
): Promise<IExamScore> => {
  const params: any = {};
  if (idUser !== undefined) params.idUser = idUser;
  if (idExam !== undefined) params.idExam = idExam;
  if (sectionId !== undefined) params.sectionId = sectionId;

  const response = await axios.get("/api/getexamscore", { params });
  return response;
};
export const fetchExamAnswerResultAPI = async (
  userId: number,
  examId: number,
  sectionId: number
): Promise<IExamAnswerResponse> => {
  const res = await axios.get("/api/getuserexamresult", {
    params: { userId, examId, sectionId },
  });
  return res;
};
export const getAllExamAPI = async (): Promise<IExam[]> => {
  const res = await axios.get<IExam[]>("/api/getallexam");
  return res;
};
export const getExamQuestionsByIdAPI = async (
  idExam: number
): Promise<any[]> => {
  const res = await axios.get("/api/getexamcontentbyidexam", {
    params: { idExam },
  });
  return res;
};
export const getWritingScoreAPI = async (
  userId: number,
  examWritingId: number,
  deBai: string,
  baiLam: string
): Promise<any> => {
  const res = await axios.post("/writingscore/test", {
    userId,
    examWritingId,
    deBai,
    baiLam,
  });
  return res;
};

export const getUserHistoryAPI = async (
  userId: number
): Promise<IUserHistory[]> => {
  const res = await axios.get<IUserHistory[]>(
    "/api/getuserelisteningreadinghistory",
    { params: { userId } }
  );
  return res;
};
export const getUserHistoryExamAPI = async (
  userId: number
): Promise<IUserHistoryExam[]> => {
  const res = await axios.get<IUserHistoryExam[]>("/api/userhistoryexam", {
    params: { userId },
  });
  return res;
};
export const deleteFlashcardAPI = async (id: number) => {
  const response = await axios.delete(`/api/deleteflashcard/${id}`);
  return response;
};
export const updateFlashcardAPI = async (
  id: number,
  frontText: string,
  backText: string
) => {
  const response = await axios.put(`/api/updateflashcard/${id}`, {
    frontText,
    backText,
  });
  return response;
};
