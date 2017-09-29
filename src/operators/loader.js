import lodash from 'lodash';
import { Subscriber } from 'rxjs';
import { Observable } from 'rxjs/Observable';

let loader;

export default function setup(loaderComponent) {
  loader = loaderComponent;
  Observable.prototype.loader = function (loaderComponent) {
    return this.lift(new LoaderOperator(loaderComponent));
  };
}

class LoaderOperator {
  constructor(loaderComponent) {
    this.loaderComponent = loaderComponent;
  }

  call(subscriber, source) {
    return source.subscribe(new LoaderSubscriber(subscriber, this.loaderComponent));
  }
}

class LoaderSubscriber extends Subscriber {
  hided = false;

  constructor(destination, loaderComponent) {
    super(destination);

    this.ref = lodash.uniqueId();
    this.loader = loaderComponent;
    this.show();
  }

  _next(value) {
    this.hide();
    this.destination.next(value);
  }

  _complete() {
    this.hide();
    this.destination.complete();
  }

  _error(err) {
    this.hide();
    this.destination.error(err);
  }

  _unsubscribe() {
    this.hide();
    this.destination.unsubscribe();
  }

  show() {
    loader.show(this.ref);
  }

  hide() {
    loader.hide(this.ref);
  }
}