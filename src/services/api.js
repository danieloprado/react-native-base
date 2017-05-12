import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';
import settings from '../settings';
import tokenService from './token';

export class ApiService {
  constructor() {
    const headers = { 'Content-type': 'application/json' };
    tokenService.getToken().subscribe(tokens => {
      delete headers['Authorization'];
      delete headers['RefreshToken'];

      if (tokens) {
        headers['Authorization'] = `bearer ${tokens.accessToken}`;
        headers['RefreshToken'] = tokens.refreshToken;
      }
    });

    this.http = (method, url, data = null) => {
      const body = data ? JSON.stringify(data) : null;
      return Observable
        .fromPromise(fetch(`${settings.apiEndpoint}/${url}`, { method, headers, body }))
        .map(res => this.checkResponse(res))
        .do(res => this.checkNewToken(res))
        // .timeout(settings.apiTimeout)
        .flatMap(res => Observable.fromPromise(res.json()))
        .catch(err => this.errorHandler(err));
    };
  }

  get(url) {
    return this.http('GET', url);
  }

  post(url, body) {
    return this.http('POST', url, body);
  }

  checkResponse(response) {
    if (response.ok) {
      return response;
    }

    throw response;
  }

  checkNewToken(response) {
    const accessToken = response.headers.get('X-Token');

    if (accessToken) {
      tokenService.setAccessToken(accessToken).subscribe();
    }
  }

  errorHandler(err) {
    if (settings.env === 'development') {
      console.log('******* API ERROR ********');
      console.log(err);
    }

    if (err.status === 401) {
      return tokenService.clearToken().flatMap(() => {
        return Observable.throw(err);
      });
    }

    return Observable.throw(err);
  }

}

export default new ApiService();