import api from './api';
import cache from './cache';

class ChurchService {

  info(refresh = false) {
    const stream$ = api.get('info');
    return cache.from('service-church-info', stream$, refresh);
  }

}

export default new ChurchService();