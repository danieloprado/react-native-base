import { Client, Configuration } from 'bugsnag-react-native';

import { ServiceError } from '../errors/serviceError';
import settings from '../settings';
import toast from './toast';

const DEFAULT_MESSAGES = {
  'empty-cache': 'Sem dados...',
  'no-internet': 'Você não está conectado'
};

export class Log {
  constructor() {
    const config = new Configuration();
    // config.notifyReleaseStages = ['production'];

    this.bugsnag = new Client(config);
  }

  setUser(user) {
    if (!user) {
      this.bugsnag.clearUser();
      return;
    }

    this.bugsnag.setUser(user.id.toString(), user.fullName, user.email);
  }

  breadcrumb(text, type = 'manual', extraData = {}) {
    delete (extraData || {}).type;
    this.bugsnag.leaveBreadcrumb(text, { type, ...extraData });
  }

  handleError(err) {
    if (typeof err === 'string') {
      err = new Error(err);
    }

    if (settings.isDevelopment) {
      console.error(err);
      return;
    }

    if (err instanceof ServiceError || err.serviceError) {
      toast(DEFAULT_MESSAGES[err.message] || 'Algo de errado aconteceu...', 10000);
      return;
    }

    toast('Erro inesperado...', 10000);
    this.bugsnag.notify(err);
  }

}

export default new Log();