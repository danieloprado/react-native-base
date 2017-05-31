import api from './api';
import cache from './cache';
import dateFormatter from '../formatters/date';

class ChurchReportService {

  list(refresh = false) {
    const stream$ = api.get('church-report');
    return cache.from('church-report', stream$, refresh).map(reports => {
      return reports.map(r => {
        r.total = r.totalMembers + r.totalNewVisitors + r.totalFrequentVisitors + r.totalKids;
        return dateFormatter.parseObj(r);
      });
    });
  }

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