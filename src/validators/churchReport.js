import BaseValidator from './base';

class ChurchReportValidator extends BaseValidator {
  rules = {
    id: 'integer|min:1',
    title: 'string|required|min:3|max:100',
    date: 'date|required',
    totalMembers: 'integer|required|min:0',
    totalNewVisitors: 'integer|required|min:0',
    totalFrequentVisitors: 'integer|required|min:0',
    totalKids: 'integer|required|min:0'
  };
}

export default new ChurchReportValidator();