export class QuizService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  saveAnswer(model) {
    return this.apiService.post('quiz', model);
  }

}