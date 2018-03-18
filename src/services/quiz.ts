import { Observable } from 'rxjs/Rx';

import { IQuizAnswer } from '../interfaces/quizAnswer';
import apiService, { ApiService } from './api';

export class QuizService {
  constructor(private apiService: ApiService) { }

  public saveAnswer(model: IQuizAnswer): Observable<void> {
    return this.apiService.post('quiz', model);
  }
}

const quizService = new QuizService(apiService);
export default quizService;