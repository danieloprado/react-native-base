import { Observable } from 'rxjs';

export interface IGooglekService {
  login(): Observable<string>;
}