import { QuizService } from '../models/quiz';

export default function quizServiceFactory(container) {
  return new QuizService(
    container.get('apiService')
  );
}