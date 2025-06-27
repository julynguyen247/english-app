export {};
declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }
  export interface IPaginationMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }
  interface IRegister {
    displayName: string;
    email: string;
    password: string;
  }
  interface ILogin {
    accessToken: string;
  }
  export interface IFetchUser {
    userId: number;
    email: string;
  }

  export interface ICategory {
    categoryId: number;
    categoryName: string;
    categoryDescription: string;
    lessons: any;
  }
  export interface ILesson {
    lessonId: number;
    title: string;
    description: string;
    level: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    categoryId: number;
  }
  export interface IExercise {
    exerciseId: number;
    lessonId: number;
    type: string;
    question: string;
    explanation: string;
  }
  export interface IFlashcard {
    flashcardId: number;
    frontText: string;
    backText: string;
  }
  export interface IDeck {
    id: number;
    name: string;
    flashCardNumber: number;
    status: string;
    ownerId: number;
    flashCards?: any;
    favoriteDecks?: any;
    owner?: any;
  }
  export interface IExam {
    examId: number;
    title: string;
    description: string;
    level: string;
    createdAt: string;
    sections: any;
  }
  export interface ISection {
    sectionId: number;
    examId: number;
    name: string;
    audioUrl: string;
    transcript: string;
    sortOrder: number;
    questions: IQuestion[] | null;
  }
  export interface IOption {
    optionId: number;
    questionId: number;
    optionText: string;
    isCorrect: boolean;
    sortOrder: number;
  }

  export interface IQuestion {
    questionId: number;
    sectionId: number;
    questionText: string;
    type: string;
    sortOrder: number;
    correctAnswer: string;
    options: IOption[];
  }
  export interface IUserExamResult {
    userId: number;
    examId: number;
    sectionId: number;
    questionId: number;
    answerOptionId: number;
    answerText: string;
    answerJson: any;
    isSubmitted: boolean;
    answeredAt: string;
  }
  export interface IExercise {
    lessonId: number;
    type: "single_choice" | "multiple_choice" | string;
    question: string;
    explanation: string;
    sortOrder: number;
    createdAt: string;
    lastUpdatedAt: string;
  }

  export interface IExerciseOption {
    optionId: number;
    exerciseId: number;
    optionText: string;
    isCorrect: boolean;
    sortOrder: number;
  }

  export interface IExerciseWithOptions {
    exercise: IExercise;
    exerciseOptionList: IExerciseOption[];
  }
  export interface ITypeStat {
    type: string;
    total: number;
    correct: number;
    incorrect: number;
  }

  export interface IExamScore {
    sectionId: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    percentCorrect: number;
    typeStats: ITypeStat[];
  }
  export interface IAnswerDetail {
    userAnswerId: number;
    userAnswer: string;
    isCorrect: boolean;
    correctOptionId: number;
    correctAnswer: string;
  }

  export interface IExamAnswerResponse {
    transcript: string;
    detailedResults: IAnswerDetail[];
  }
  export interface IExam {
    id: number;
    title: string;
    description: string;
  }
  export interface IUserHistory {
    examId: number;
    examTitle: string;
    sectionId: number;
    sectionName: string;
    latestAnsweredAt: string; // ISO string
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    score: number;
  }
  export interface IUserHistoryExam {
    id: number;
    examId: number;
    title: string;
    description: string;
    userAnswer: string;
    aiFeedback: string;
  }
}
