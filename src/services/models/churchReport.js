import * as lodash from 'lodash';
import { Subject } from 'rxjs';

import churchReportListFormatter from '../../formatters/churchReportList';
import dateFormatter from '../../formatters/date';

export class ChurchReportService {

  constructor(apiService) {
    this.reports = [];
    this.reportUpdate$ = new Subject();

    this.apiService = apiService;
  }

  list(refresh = false) {
    return this.apiService.get('church-report')
      .cache('church-report', refresh)
      .concat(this.reportUpdate$)
      .do(reports => this.reports = reports || [])
      .map(reports => churchReportListFormatter(reports));
  }

  types() {
    return this.apiService.get('church-report/types').cache('church-report-types', false);
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