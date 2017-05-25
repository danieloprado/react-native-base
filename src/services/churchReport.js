import api from './api';
import cache from './cache';
import dateFormatter from '../formatters/date';

class ChurchReportService {

  types() {
    const stream$ = api.get('church-report/types');
    return cache.from('church-report-types', stream$, false).map(types => {
      return types.map(type => ({ value: type.id, display: type.name }));
    });
  }

  save(model) {
    return api.post('profile', model).map(profile => {
      profile = dateFormatter.parseObj(profile);
      this.profileUpdate$.next(profile);
      return profile;
    });
  }

}

export default new ChurchReportService();