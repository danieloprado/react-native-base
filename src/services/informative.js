import api from './api';
import cache from './cache';
import dateFormatter from '../formatters/date';

export const enInformativeType = {
  church: 1,
  cell: 2
};

class InformativeService {

  list(refresh = false) {
    const stream$ = api.get('informatives');

    return cache.from('service-informative-list', stream$, refresh).map(data => {
      return (data || []).map(informative => {
        informative.icon = informative.typeId === enInformativeType.cell ? 'home' : 'paper';
        return dateFormatter.parseObj(informative);
      });
    });
  }

  last(refresh = false) {
    return this.list(refresh).map(informatives => informatives[0]);
  }

}

export default new InformativeService();