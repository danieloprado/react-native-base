import 'rxjs/add/operator/map';
import settings from '../settings';
import { Observable } from 'rxjs/Observable';
import tokenService from './token';

export class ApiService {
  constructor(fetch, settings, tokenService) {
    const headers = { 'Content-type': 'application/json' };

    this.settings = settings;
    this.tokenService = tokenService;
    this.http = (method, url, data = null) => {
      const body = data ? JSON.stringify(data) : null;
      return Observable
        .fromPromise(fetch(`${this.settings.apiEndpoint}/${url}`, { method, headers, body }))
        .do(res => this.checkNewToken(res))
        // .timeout(this.settings.apiTimeout)
        .flatMap(res => Observable.fromPromise(res.json()))
        .catch(err => this.errorHandler(err));
    };

    this.tokenService.getToken().subscribe(tokens => {
      delete headers['Authorization'];
      delete headers['RefreshToken'];

      if (tokens) {
        headers['Authorization'] = `bearer ${tokens.accessToken}`;
        headers['RefreshToken'] = tokens.refreshToken;
      }
    });
  }

  get(url) {
    return this.http('GET', url);
  }

  post(url, body) {
    return this.http('POST', url, body);
  }

  checkNewToken(response) {
    const accessToken = response.headers.get('X-Token');

    if (accessToken) {
      this.tokenService.setAccessToken(accessToken).subscribe();
    }
  }

  errorHandler(err) {
    if (this.settings.env === 'development') {
      console.log('******* API ERROR ********');
      console.log(err);
    }

    if (err.status === 401) {
      return this.tokenService.clearToken().flatMap(() => {
        return Observable.throw(err);
      });
    }

    return Observable.throw(err);
  }

}

export default new ApiService(fetch, settings, tokenService);