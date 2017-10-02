export class ChurchService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  info(refresh = false) {
    return this.apiService.get('info').cache('service-church-info', refresh);
  }

}