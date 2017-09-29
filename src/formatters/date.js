import 'moment/locale/pt-br';

import moment from 'moment';

moment.locale('pt-BR');

class DateFormatter {

  constructor() { }

  parseObj(obj) {
    if (!obj) return obj;

    if (Array.isArray(obj)) {
      return obj.map(i => this.parseObj(i));
    }

    if (typeof obj === 'string' && this.isISODate(obj)) {
      return new Date(obj);
    }

    if (typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        obj[key] = this.parseObj(obj[key]);
      });
      return obj;
    }

    return obj;
  }

  isISODate(value) {
    return /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d+)Z/.test(value);
  }

  parse(value, format) {
    if (!value) return value;
    if (value instanceof Date) return value;

    const date = moment(value, format);
    if (!date.isValid()) return value;

    return date.toDate();
  }

  format(date, format) {
    return moment(date).format(format).replace('-feira', '');
  }

  formatBirthday(value) {
    if (!value || !(value instanceof Date) || isNaN(value.getTime())) return;

    const format = value.getFullYear() === 1900 ? 'DD [de] MMMM' : 'DD [de] MMMM [de] YYYY';
    return this.format(value, format);
  }

  humanize(date) {
    const now = moment();
    date = moment(date);

    return now.isSame(date, 'day') ?
      `${date.format('HH:mm')} - ${moment.duration(now.diff(date)).humanize()}` :
      now.isSame(date, 'year') ?
        date.format('DD/MMM [às] HH:mm') :
        date.format('DD/MMM/YYYY [às] HH:mm');
  }
}

export default new DateFormatter();