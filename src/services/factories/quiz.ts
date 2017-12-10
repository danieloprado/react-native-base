import { Container } from '../container';
import { QuizService } from '../models/quiz';

export function quizFactory(container: Container): QuizService {
  return new QuizService(container.get('apiService'));
}