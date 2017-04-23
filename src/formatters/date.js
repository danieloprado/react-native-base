import moment from 'moment';
moment.locale('pt-BR');

class DateFormatter {

  constructor() {}

  parseObj(obj, fields = null) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (!fields) {
      fields = Object.keys(obj).filter(x => x.toLowerCase().indexOf('date') > -1 || x.toLowerCase() === 'birthday');
    }

    fields.forEach(key => {
      obj[key] = this.parse(obj[key]);
    });

    return obj;
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
}

export default new DateFormatter();