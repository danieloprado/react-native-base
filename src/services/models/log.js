import { Client, Configuration } from 'bugsnag-react-native';

export class LogService {
  constructor(settings) {
    this.settings = settings;

    const config = new Configuration();
    config.notifyReleaseStages = ['production'];

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
    if (this.settings.isDevelopment) console.log('breadcrumb: ' + type + ' - ' + text);

    extraData = extraData || {};
    delete extraData.type;

    this.bugsnag.leaveBreadcrumb(text, { type, data: extraData });
  }

  handleError(err, force = false) {
    if (!err) return;

    if (typeof err === 'string') {
      err = new Error(err);
    }

    if (['NETWORK_ERROR'].includes(err.message)) {
      return;
    }

    if (err.ignoreLog && !force) {
      return;
    }

    if (this.settings.isDevelopment) {
      console.error(err);
      return;
    }

    this.bugsnag.notify(err);
  }

}