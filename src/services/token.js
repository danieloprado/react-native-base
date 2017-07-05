import { BehaviorSubject } from 'rxjs/Rx';
import base64 from 'base-64';
import storage from './storage';

class TokenService {
  constructor() {
    this.authToken$ = new BehaviorSubject(null);
    storage.get('authToken').subscribe(token => {
      this.token = token;
      this.authToken$.next(token);
    });
  }

  getToken() {
    return this.authToken$.distinctUntilChanged();
  }

  getUser() {
    return this.getToken().map(tokens => {
      if (!tokens) return;

      const user = JSON.parse(base64.decode(tokens.accessToken.split('.')[1]));
      user.canAccess = roles => {
        if (!roles || roles.length === 0) return true;
        if (user.roles.includes('sysAdmin') || user.roles.includes('admin')) return true;

        return roles.some(r => user.roles.includes(r));
      };

      return user;
    });
  }

  setToken(token) {
    return storage.set('authToken', token).do(() => {
      this.token = token;
      this.authToken$.next(token);
    });
  }

  clearToken() {
    return this.setToken(null).map(() => null);
  }

  setAccessToken(accessToken) {
    this.token.accessToken = accessToken;
    return storage.set('authToken', this.token).do(() => {
      this.authToken$.next(this.token);
    });
  }

  isAuthenticated() {
    return this.getToken().map(token => !!token);
  }
}

export default new TokenService();