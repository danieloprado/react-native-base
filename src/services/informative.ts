import { Observable } from 'rxjs';

import { dateFormatter } from '../formatters/date';
import { IInformative } from '../interfaces/informative';
import apiService, { ApiService } from './api';
import { enInformativeType } from '../interfaces/enums/informativeType';

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
    return this.list(refresh)
      .first()
      .switchMap(informatives => {
        const informative = informatives.find(i => i.id === id);

        if (informative) {
          return Observable.of(informative);
        }

        return this.apiService
          .get<IInformative>(`informatives/${id}`)
          .map(i => dateFormatter.parseObj(i));
      });
  }

  public last(refresh?: boolean): Observable<IInformative> {
    return this.list(refresh).map(informatives => informatives[0]);
  }

}

const informativeService = new InformativeService(apiService);
export default informativeService;