import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { Observable } from 'rxjs';

export class FacebookService {
  constructor(settings, logService) {
    this.settings = settings;
    this.logService = logService;
  }

  login() {
    return Observable
      .of(true)
      .do(() => LoginManager.logOut())
      .switchMap(() => Observable.fromPromise(LoginManager.logInWithReadPermissions(['public_profile', 'email'])))
      .switchMap(({ isCancelled }) => {
        return isCancelled ?
          Observable.of({}) :
          Observable.fromPromise(AccessToken.getCurrentAccessToken());
      })
      .catch(err => err.message === 'Login Failed' ? Observable.of({ accessToken: null }) : Observable.throw(err))
      .map(({ accessToken }) => accessToken);
  }

}