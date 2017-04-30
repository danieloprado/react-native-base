import BaseValidator from './base';

class ProfileValidator extends BaseValidator {
  rules = {
    id: 'integer|required|min:1',
    firstName: 'required|min:3|max:50',
    lastName: 'max:50',
    email: 'email|max:150',
    gender: 'in:f,m',
    birthday: 'date'
  };
}

export default new ProfileValidator();