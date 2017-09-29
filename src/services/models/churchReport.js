import * as lodash from 'lodash';
import { Subject } from 'rxjs';

import churchReportListFormatter from '../formatters/churchReportList';
import dateFormatter from '../formatters/date';

export class ChurchReportService {

  constructor(apiService, cacheService) {
    this.reports = [];
    this.reportUpdate$ = new Subject();

    this.apiService = apiService;
    this.cacheService = cacheService;
  }

  list(refresh = false) {
    const stream$ = this.apiService.get('church-report');
    return this.cacheService.from('church-report', stream$, refresh)
      .concat(this.reportUpdate$)
      .do(reports => this.reports = reports || [])
      .map(reports => churchReportListFormatter(reports));
  }

  types() {
    const stream$ = this.apiService.get('church-report/types');
    return this.cacheService.from('church-report-types', stream$, false);
  }

  save(model) {
    return this.apiService.post('church-report', model).map(report => {
      return dateFormatter.parseObj(report);
    }).do(report => {
      const reportModel = this.reports.filter(r => r.id === report.id)[0];

      !reportModel ?
        this.reports.push(report) :
        lodash.merge(reportModel, report);

      this.reportUpdate$.next(this.reports);
    });
  }

}