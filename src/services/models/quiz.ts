import { Observable } from 'rxjs/Rx';

import { IQuizAnswer } from '../../interfaces/quizAnswer';
import { ApiService } from './api';

export class QuizService {
  constructor(private apiService: ApiService) { }

  public saveAnswer(model: IQuizAnswer): Observable<void> {
    return this.apiService.post('quiz', model);
  }
}