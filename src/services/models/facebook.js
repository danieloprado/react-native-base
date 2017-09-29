import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { Observable } from 'rxjs';

export class FacebookService {
  constructor(settings, logService) {
    this.settings = settings;
    this.logService = logService;
  }

  login() {
    return Observable
      .fromPromise(LoginManager.logInWithReadPermissions(['public_profile', 'email']))
      .switchMap(({ isCancelled }) => {
        if (isCancelled) {
          return Observable.of({});
        }

        return Observable.fromPromise(AccessToken.getCurrentAccessToken());
      }).map(({ accessToken }) => accessToken);
  }

}