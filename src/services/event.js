import api from './api';
import cache from './cache';
import dateFormatter from '../formatters/date';

class EventService {

  list(refresh = false) {
    const stream$ = api.get('events');

    return cache.from('service-event-list', stream$, refresh).map(data => {
      return (data || []).map(event => {
        event.dates = event.dates.map(d => dateFormatter.parseObj(d));
        return event;
      }).sort((a, b) => this.sortByFirstDate(a, b));
    });
  }

  next(refresh = false) {
    return this.list(refresh).map(events => events[0]);
  }

  sortByFirstDate(a, b) {
    if (a.dates[0].beginDate === b.dates[0].beginDate) return 0;
    if (a.dates[0].beginDate < b.dates[0].beginDate) return -1;
    return 1;
  }

}

export default new EventService();