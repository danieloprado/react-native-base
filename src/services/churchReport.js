import * as lodash from 'lodash';

import { Subject } from 'rxjs';
import api from './api';
import cache from './cache';
import dateFormatter from '../formatters/date';

class ChurchReportService {

  constructor() {
    this.reports = [];
    this.reportUpdate$ = new Subject();
  }

  list(refresh = false) {
    const stream$ = api.get('church-report');
    return cache.from('church-report', stream$, refresh)
      .concat(this.reportUpdate$)
      .do(reports => this.reports = reports || [])
      .map(reports => {
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
    return api.post('church-report', model).map(report => {
      return dateFormatter.parseObj(report);
    }).do(report => {
      const reportModel = this.reports.filter(r => r.id === report.id)[0];

      !reportModel ?
        this.reports.push(reportModel) :
        lodash.merge(reportModel, report);

      this.reportUpdate$.next(this.reports);
    });
  }

}

export default new ChurchReportService();