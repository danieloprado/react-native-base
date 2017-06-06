import dateFormatter from '../formatters/date';
import lodash from 'lodash';

export default function churchReportListFormatter(reports) {
  return lodash.orderBy(mapper(reports), ['date', 'id']);
}

function mapper(reports) {
  return reports.map(r => {
    r.total = r.totalMembers + r.totalNewVisitors + r.totalFrequentVisitors + r.totalKids;
    return dateFormatter.parseObj(r);
  });
}