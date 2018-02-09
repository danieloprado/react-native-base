export interface IQuizAnswerItem {
  questionId: number;
  title: string;
  description: string;
  answer: any;
}

export interface IQuizAnswer {
  id?: number;
  quizId: number;
  quizVersion: number;
  answers: IQuizAnswerItem[];

  createdBy?: number;

  createdDate?: Date;
  updatedDate?: Date;
}