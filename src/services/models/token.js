import base64 from 'base-64';
import { BehaviorSubject } from 'rxjs/Rx';

export class TokenService {
  constructor(storageService) {
    this.storageService = storageService;
    this.authToken$ = new BehaviorSubject(null);

    this.storageService.get('authToken').logError().subscribe(token => {
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
      user.fullName = `${user.firstName} ${user.lastName}`;
      user.canAccess = roles => {
        if (!roles || roles.length === 0) return true;
        if (user.roles.includes('sysAdmin') || user.roles.includes('admin')) return true;

        return roles.some(r => user.roles.includes(r));
      };

      return user;
    });
  }

  setToken(token) {
    return this.storageService.set('authToken', token).do(() => {
      this.token = token;
      this.authToken$.next(token);
    });
  }

  clearToken() {
    return this.setToken(null).map(() => null);
  }

  setAccessToken(accessToken) {
    this.token.accessToken = accessToken;
    return this.storageService.set('authToken', this.token).do(() => {
      this.authToken$.next(this.token);
    });
  }

  isAuthenticated() {
    return this.getToken().map(token => !!token);
  }
}