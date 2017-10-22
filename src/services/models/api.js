import axios from 'axios';
import { NetInfo } from 'react-native';
import { BehaviorSubject, Observable } from 'rxjs';

import { ApiError } from '../../errors/api';
import { NoInternetError } from '../../errors/noInternet';

export class ApiService {
  constructor(settings, logService, tokenService) {
    this.settings = settings;
    this.logService = logService;
    this.tokenService = tokenService;

    this.headers = { 'Content-type': 'application/json' };
    this.connection$ = new BehaviorSubject(false);

    this.watchNetwork();
    this.watchUserToken();
  }

  async watchNetwork() {
    NetInfo.isConnected.fetch().then(isConnected => this.connection$.next(isConnected));
    NetInfo.isConnected.addEventListener('connectionChange', isConnected => {
      this.connection$.next(isConnected);
    });
  }

  watchUserToken() {
    this.tokenService.getToken()
      .logError()
      .subscribe(tokens => {
        delete this.headers['Authorization'];
        delete this.headers['RefreshToken'];

        if (tokens) {
          this.headers['Authorization'] = `bearer ${tokens.accessToken}`;
          this.headers['RefreshToken'] = tokens.refreshToken;
        }
      });
  }

  get(url, params) {
    return this.request('GET', url, params);
  }

  post(url, body) {
    return this.request('POST', url, body);
  }

  connection() {
    return this.connection$.distinctUntilChanged().asObservable();
  }

  request(method, url, data = null) {
    if (!this.connection$.getValue()) {
      return Observable.throw(new NoInternetError());
    }

    return Observable
      .of(null)
      .switchMap(() => {
        return Observable.fromPromise(axios.request({
          baseURL: this.settings.apiEndpoint,
          url,
          method,
          headers: this.headers,
          params: method === 'GET' ? data : null,
          data: method === 'POST' ? data : null
        }));
      })
      .switchMap(res => this.checkNewToken(res))
      .map(response => response.data)
      .catch(err => Observable.throw(new ApiError(err.request, err.response, err)));
  }

  checkNewToken(response) {
    const accessToken = response.headers['x-token'];

    if (!accessToken) {
      return Observable.of(response);
    }

    this.logService.breadcrumb('Api New Token', 'manual', accessToken);

    return this.tokenService
      .setAccessToken(accessToken)
      .map(() => response);
  }

}