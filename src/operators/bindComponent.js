import { Observable } from 'rxjs/Observable';

Observable.prototype.bindComponent = function (component) {
  return this.lift(new BindComponentOperator(component));
};

class BindComponentOperator {
  constructor(component) {
    this.component = component;
  }

  call(subscriber, source) {
    const subscription = source.subscribe(subscriber);

    if (this.component.subscriptions) {
      this.component.subscriptions.push(subscription);
    }

    return subscription;
  }
}