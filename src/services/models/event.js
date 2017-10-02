import dateFormatter from '../../formatters/date';

export class EventService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  list(refresh = false) {
    return this.apiService.get('events')
      .cache('service-event-list', refresh)
      .map(data => {
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