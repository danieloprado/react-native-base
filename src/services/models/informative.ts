import { Observable } from 'rxjs';

import { dateFormatter } from '../../formatters/date';
import { IInformative } from '../../interfaces/informative';
import { enInformativeType } from '../enums/informativeType';
import { ApiService } from './api';

export class InformativeService {
  constructor(private apiService: ApiService) { }

  public list(refresh?: boolean): Observable<IInformative[]> {
    return this.apiService.get<IInformative[]>('informatives')
      .cache('service-informative-list', { refresh })
      .map(data => {
        return (data || []).map(informative => {
          informative.icon = informative.typeId === enInformativeType.cell ? 'home' : 'paper';
          return dateFormatter.parseObj(informative);
        });
      });
  }

  public get(id: number, refresh?: boolean): Observable<IInformative> {
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

  public last(refresh?: boolean): Observable<IInformative> {
    return this.list(refresh).map(informatives => informatives[0]);
  }

}