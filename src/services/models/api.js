import { NetInfo } from 'react-native';
import { BehaviorSubject, Observable } from 'rxjs';

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

  http(method, url, data = null) {
    this.logService.breadcrumb('Api Request', 'manual', { method, url, data });

    if (!this.connection$.getValue()) {
      return Observable.throw(new Error('no-internet'));
    }

    const body = data ? JSON.stringify(data) : null;
    return Observable
      .of(null)
      .switchMap(() => Observable.fromPromise(fetch(`${this.settings.apiEndpoint}/${url}`, { method, headers: this.headers, body })))
      .map(res => this.checkResponse(res))
      .do(res => this.checkNewToken(res))
      .switchMap(res => Observable.fromPromise(res.text()))
      .map(bodyText => bodyText ? JSON.parse(bodyText) : null)
      .do(res => this.logService.breadcrumb('Api Response', 'manual', res))
      .catch(err => this.errorHandler({ method, url, data }, err));
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

    this.logService.breadcrumb('Api New Token', 'manual', accessToken);
    this.tokenService.setAccessToken(accessToken).logError().subscribe();
  }

  errorHandler(request, err) {
    err.request = request;

    if (this.settings.env === 'development') {
      console.log('******* API ERROR ********');
      console.log(request);
      console.log(err);
      console.log(err.data);
    }

    this.logService.breadcrumb('Api Error', 'error', err);
    return Observable.throw(err);
  }

  get(url) {
    return this.http('GET', url);
  }

  post(url, body) {
    return this.http('POST', url, body);
  }

  connection() {
    return this.connection$.distinctUntilChanged().asObservable();
  }

}