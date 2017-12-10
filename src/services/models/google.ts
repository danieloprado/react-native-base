import { GoogleSignin } from 'react-native-google-signin';
import { Observable } from 'rxjs';

import { LogService } from './log';

export class GoogleService {
  constructor(
    private logService: LogService,
    googleApi: { iosClientId: string, webClientId: string }
  ) {
    const options = { ...googleApi, offlineAccess: true };

    GoogleSignin
      .hasPlayServices({ autoResolve: true })
      .then(() => GoogleSignin.configure(options))
      .catch(err => logService.handleError(err));
  }

  public login(): Observable<string> {
    return Observable
      .of(true)
      .do(() => this.logService.breadcrumb('Google Login'))
      .switchMap(() => Observable.fromPromise(GoogleSignin.signIn()))
      .catch(err => [-5, 12501].includes(err.code) ? Observable.of({ accessToken: null }) : Observable.throw(err))
      .map(({ accessToken }) => accessToken)
      .do(a => this.logService.breadcrumb(`Google Login ${a ? 'Completed' : 'Cancelled'}`));
  }

}