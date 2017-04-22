import api from './api';
import cache from './cache';

class ChurchService {

  constructor(cache, api) {
    this.cache = cache;
    this.api = api;
  }

  info(refresh = false) {
    const stream$ = this.api.get('info');
    return this.cache.from('service-church-info', stream$, refresh);
  }

}

export default new ChurchService(cache, api);