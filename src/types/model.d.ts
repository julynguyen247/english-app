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
    userId: string;
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
}
