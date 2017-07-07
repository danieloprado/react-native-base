import 'rxjs/add/operator/map';

import { BehaviorSubject, Observable } from 'rxjs';

import { NetInfo } from 'react-native';
import { ServiceError } from '../errors/serviceError';
import logService from './log';
import profileService from './profile';
import settings from '../settings';
import tokenService from './token';

export class ApiService {
  constructor() {
    const headers = { 'Content-type': 'application/json' };
    this._connection$ = new BehaviorSubject(false);

    NetInfo.isConnected.addEventListener('change', isConnected => {
      this._connection$.next(isConnected);
    });

    tokenService.getToken().subscribe(tokens => {
      delete headers['Authorization'];
      delete headers['RefreshToken'];

      if (tokens) {
        headers['Authorization'] = `bearer ${tokens.accessToken}`;
        headers['RefreshToken'] = tokens.refreshToken;
      }
    }, err => {
      logService.handleError(err);
    });

    this.http = (method, url, data = null) => {
      logService.breadcrumb('Api Request', 'manual', { method, url, data });

      if (!this._connection$.getValue()) {
        return Observable.throw(new ServiceError('no-internet'));
      }

      const body = data ? JSON.stringify(data) : null;
      return Observable
        .fromPromise(fetch(`${settings.apiEndpoint}/${url}`, { method, headers, body }))
        .map(res => this.checkResponse(res))
        .do(res => this.checkNewToken(res))
        // .timeout(settings.apiTimeout)
        .switchMap(res => Observable.fromPromise(res.text()))
        .map(bodyText => bodyText ? JSON.parse(bodyText) : null)
        .do(res => logService.breadcrumb('Api Response', 'manual', res))
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

    if (!accessToken) return;

    logService.breadcrumb('Api New Token', 'manual', accessToken);
    tokenService.setAccessToken(accessToken).subscribe(() => { }, err => logService.handleError(err));
  }

  errorHandler(err) {
    if (settings.env === 'development') {
      console.log('******* API ERROR ********');
      console.log(err);
      console.log(err.data);
    }

    logService.breadcrumb('Api Error', 'error', err);

    if (err.status === 401) {
      return profileService.logout().switchMap(() => {
        return Observable.throw(err);
      });
    }

    return Observable.throw(err);
  }

  connection() {
    return this._connection$.asObservable();
  }

}

export default new ApiService();