import validator from 'validatorjs';
import lang from 'validatorjs/src/lang';
lang._set('en', {});

export default class BaseValidator {
  rules = {};
  messages = {
    email: 'Inválido',
    date: 'Inválido',
    in: 'Inválido',
    integer: 'Inválido',
    min: {
      numeric: 'Valor mínimo :min',
      string: 'Mínimo :min caracteres'
    },
    max: {
      numeric: 'Valor máximo :max',
      string: 'Máximo :max caracteres'
    },
    required: 'Obrigatório',
    required_if: 'Obrigatório'
  };

  validate(model) {
    const result = new validator(model, this.rules, this.messages);

    if (result.passes()) {
      return Promise.resolve(this.cleanModel(model));
    }

    return Promise.reject(result.errors.all());
  }

  cleanModel(model) {
    const result = {};

    Object.keys(this.rules).forEach(key => {
      result[key] = model[key];
    });

    return result;
  }
}