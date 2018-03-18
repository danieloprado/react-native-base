import { Observable } from 'rxjs/Rx';

import { IChurch } from '../interfaces/church';
import apiService, { ApiService } from './api';

export class ChurchService {
  constructor(private apiService: ApiService) { }

  public info(refresh: boolean = false): Observable<IChurch> {
    return this.apiService.get<IChurch>('info').cache('service-church-info', { refresh });
  }
}

const churchService = new ChurchService(apiService);
export default churchService;