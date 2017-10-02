export class CacheService {
  constructor(settings, storageService) {
    this.connected = false;

    this.settings = settings;
    this.storageService = storageService;
  }

  isExpirated(cache) {
    if (this.settings.isDevelopment) return true;

    const difference = Date.now() - new Date(cache.createdAt).getTime();
    return (difference / 1000 / 60) > 5; //5 minutes
  }

  getData(key) {
    return this.storageService.get('church-cache-' + key);
  }


  saveData(key, data) {
    return this.storageService.set('church-cache-' + key, { createdAt: new Date(), data });
  }

  clear() {
    return this.storageService.clear(/^church-cache-/gi);
  }

}