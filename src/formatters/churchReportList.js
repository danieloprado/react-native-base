import lodash from 'lodash';

import dateFormatter from '../formatters/date';

export default function churchReportListFormatter(reports) {
  return lodash.orderBy(mapper(reports), ['date', 'id']);
}

function mapper(reports) {
  return reports.map(r => {
    return dateFormatter.parseObj(r);
  });
}