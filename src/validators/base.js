import { Observable } from 'rxjs';
import validator from 'validatorjs';
import lang from 'validatorjs/src/lang';
import langPt from 'validatorjs/src/lang/pt';

lang._set('en', langPt);

validator.register('zipcode', value => {
  if (!value) return true;
  return /^\d{8}$/g.test(value);
}, 'Inválido');

export default class BaseValidator {
  rules = {};
  messages = {
    after: 'Deve ser depois que :after.',
    after_or_equal: 'Deve ser igual ou depois que :after_or_equal.',
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
    const result = new validator(model || {}, this.rules, this.messages);

    if (result.passes()) {
      return Observable.of({ valid: true, model: this.cleanModel(model) });
    }

    const errors = result.errors.all();
    return Observable.of({ valid: false, errors, model });
  }

  cleanModel(model, rules = this.rules) {
    const result = {};

    Object.keys(rules).forEach(key => {
      let value = model[key];

      if (typeof value === 'string') {
        value = value.trim();
      }

      if (value && typeof value === 'object' && !Array.isArray(!value) && !(value instanceof Date)) {
        value = this.cleanModel(value, rules[key]);
      }

      result[key] = value;
    });

    return result;
  }
}