import api from './api';
import cache from './cache';
import dateFormatter from '../formatters/date';

class ChurchReportService {

  types() {
    const stream$ = api.get('church-report/types');
    return cache.from('church-report-types', stream$, false);
  }

  save(model) {
    return api.post('church-report', model).map(churchReport => {
      return dateFormatter.parseObj(churchReport);
    });
  }

}

export default new ChurchReportService();