import { Subscriber } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import services from '../services';

Observable.prototype.logError = function (filter) {
  return this.lift(new LogErrorOperator(filter));
};

class LogErrorOperator {
  constructor(filter) {
    this.filter = filter;
  }

  call(subscriber, source) {
    return source.subscribe(new LogErrorSubscriber(subscriber, this.filter));
  }
}

class LogErrorSubscriber extends Subscriber {
  hided = false;

  constructor(destination, filter) {
    super(destination);

    this.filter = filter;
    this.logService = services.get('logService');
  }

  _next(value) {
    this.destination.next(value);
  }

  _complete() {
    this.destination.complete();
  }

  _error(err) {
    this.logService.handleError(err);
    this.destination.error(err);
  }
}