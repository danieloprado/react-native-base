import BaseValidator from './base';

export class QuizFormValidator extends BaseValidator {
  constructor(quiz) {
    super();

    const typeRules = {
      'text': 'string',
      'email': 'string|email',
      'phone': 'string',
      'date': 'date',
      'zipcode': 'string|zipcode',
      'number': 'number',
      'boolean': 'boolean',
      'chooseOne': 'string',
      'multiple': 'string',
    };

    this.rules = quiz.questions.reduce((rules, question, index) => {
      rules[`question-${index}`] = typeRules[question.type];
      rules[`question-${index}`] += question.required ? '|required' : '';

      return rules;
    }, {});
  }
}