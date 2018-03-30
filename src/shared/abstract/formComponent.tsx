import { toastError } from '../../providers/toast';
import { BaseValidator } from '../../validators/base';
import BaseComponent from './baseComponent';

export interface IStateForm<T = any> {
  model?: Partial<T>;
  validation?: {
    [key: string]: string;
  };
}

export default abstract class FormComponent<S extends IStateForm, P = any, R = any> extends BaseComponent<S, P, R> {

  protected updateModel(key: string, value: string): void;
  protected updateModel(validator: BaseValidator<any>, key: string, value: string): void;
  protected updateModel(validator: any, key: string, value?: string): void {
    if (arguments.length === 2) {
      key = validator;
      validator = null;
    }

    let { model } = this.state as any;
    model[key] = value;

    if (!validator) {
      this.setState({ validation: {}, model }, true);
      return;
    }

    validator.validate(model)
      .logError()
      .bindComponent(this)
      .subscribe(({ model, errors }: any) => {
        this.setState({ validation: errors, model }, true);
      }, (err: any) => toastError(err));
  }

}