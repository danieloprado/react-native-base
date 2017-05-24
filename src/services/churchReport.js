import { Observable, Subject } from 'rxjs';

import api from './api';
import cache from './cache';
import dateFormatter from '../formatters/date';
import device from 'react-native-device-info';
import notificationService from './notification';
import settings from '../settings';
import tokenService from './token';

class ChurchReportService {

  types() {
    const stream$ = api.get('church-report/types');
    return cache.from('church-report-types', stream$, false);
  }

  save(model) {
    return api.post('profile', model).map(profile => {
      profile = dateFormatter.parseObj(profile);
      this.profileUpdate$.next(profile);
      return profile;
    });
  }

}

export default new ChurchReportService();