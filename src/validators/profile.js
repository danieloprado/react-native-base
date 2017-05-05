import BaseValidator from './base';

class ProfileValidator extends BaseValidator {
  rules = {
    id: 'integer|required|min:1',
    firstName: 'string|required|min:3|max:50',
    lastName: 'string|max:50',
    email: 'string|email|max:150',
    gender: 'string|in:f,m',
    birthday: 'date',
    cep: 'string|min:8|max:8',
    address: 'string|max:150',
    city: 'string|max:100',
    state: 'string|max:2',
    number: 'string|max:10',
    complement: 'string|max:10',
  };
}

export default new ProfileValidator();