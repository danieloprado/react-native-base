import api from './api';
import cache from './cache';
import dateFormatter from '../formatters/date';

export const enInformativeType = {
  church: 1,
  cell: 2
};

class InformativeService {

  constructor(cache, api, dateFormatter) {
    this.cache = cache;
    this.api = api;
    this.dateFormatter = dateFormatter;
  }

  list(refresh = false) {
    const stream$ = this.api.get('informatives');

    return this.cache.from('service-informative-list', stream$, refresh).map(data => {
      return (data || []).map(informative => {
        informative.icon = informative.typeId === enInformativeType.cell ? 'home' : 'paper';
        return this.dateFormatter.parseObj(informative);
      });
    });
  }

  get(id) {
    return this.list().map(informatives => {
      return informatives.filter(i => i.id === id)[0];
    });
  }

  last(refresh = false) {
    return this.list(refresh).map(informatives => informatives[0]);
  }

}

export default new InformativeService(cache, api, dateFormatter);