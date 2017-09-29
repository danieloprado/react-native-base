export class ChurchService {
  constructor(apiService, cacheService) {
    this.apiService = apiService;
    this.cacheService = cacheService;
  }

  info(refresh = false) {
    const stream$ = this.apiService.get('info');
    return this.cache.from('service-church-info', stream$, refresh);
  }

}