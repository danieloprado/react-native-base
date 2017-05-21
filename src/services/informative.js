import { Observable } from 'rxjs';
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

  get(id, refresh = false) {
    return new Observable(observer => {
      this.list(refresh).first().subscribe(informatives => {
        const informative = informatives.filter(i => i.id === id)[0];

        if (informative) {
          observer.next(informative);
          observer.complete();
          return;
        }

        if (!refresh) {
          this.list(true).first().subscribe(informatives => {
            const informative = informatives.filter(i => i.id === id)[0];
            observer.next(informative);
            observer.complete();
          });
          return;
        }

        observer.next(null);
        observer.complete();
      }, error => observer.error(error), () => {
        observer.next(null);
      });
    });
  }

  last(refresh = false) {
    return this.list(refresh).map(informatives => informatives[0]);
  }

}

export default new InformativeService();