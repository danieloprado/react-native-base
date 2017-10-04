import { GoogleSignin } from 'react-native-google-signin';
import { Observable } from 'rxjs';

export class GoogleService {
  constructor(settings, logService) {
    this.settings = settings;
    this.logService = logService;

    this.init();
  }

  async init() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        iosClientId: this.settings.googleApi.iosClientid,
        webClientId: this.settings.googleApi.webClientId,
        offlineAccess: true
      });
    } catch (err) {
      this.logService.handleError(err);
    }
  }

  login() {
    return Observable
      .fromPromise(GoogleSignin.signIn())
      .catch(err => [-5, 12501].includes(err.code) ? Observable.of({ accessToken: null }) : Observable.throw(err))
      .map(({ accessToken }) => accessToken);
  }

}