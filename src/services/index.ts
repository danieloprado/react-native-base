import { Container } from './container';
import { addressFactory } from './factories/address';
import { apiFactory } from './factories/api';
import { cacheFactory } from './factories/cache';
import { churchFactory } from './factories/church';
import { churchReportFactory } from './factories/churchReport';
import { eventFactory } from './factories/event';
import { facebookFactory } from './factories/facebook';
import { googleFactory } from './factories/google';
import { informativeFactory } from './factories/informative';
import { logFactory } from './factories/log';
import { notificationFactory } from './factories/notification';
import { profileFactory } from './factories/profile';
import { quizFactory } from './factories/quiz';
import { storageFactory } from './factories/storage';
import { tokenFactory } from './factories/token';
import { AddressService } from './models/address';
import { ApiService } from './models/api';
import { CacheService } from './models/cache';
import { ChurchService } from './models/church';
import { ChurchReportService } from './models/churchReport';
import { EventService } from './models/event';
import { FacebookService } from './models/facebook';
import { GoogleService } from './models/google';
import { InformativeService } from './models/informative';
import { LogService } from './models/log';
import { NotificationService } from './models/notification';
import { ProfileService } from './models/profile';
import { QuizService } from './models/quiz';
import { StorageService } from './models/storage';
import { TokenService } from './models/token';
import { register as notificationHandlersRegister } from './notification-handlers';

let container: Container;

export function init(): void {
  container = new Container();

  container.register<AddressService>('addressService', addressFactory);
  container.register<ApiService>('apiService', apiFactory);
  container.register<CacheService>('cacheService', cacheFactory);
  container.register<ChurchReportService>('churchReportService', churchReportFactory);
  container.register<ChurchService>('churchService', churchFactory);
  container.register<EventService>('eventService', eventFactory);
  container.register<FacebookService>('facebookService', facebookFactory);
  container.register<GoogleService>('googleService', googleFactory);
  container.register<InformativeService>('informativeService', informativeFactory);
  container.register<LogService>('logService', logFactory);
  container.register<NotificationService>('notificationService', notificationFactory);
  container.register<ProfileService>('profileService', profileFactory);
  container.register<QuizService>('quizService', quizFactory);
  container.register<StorageService>('storageService', storageFactory);
  container.register<TokenService>('tokenService', tokenFactory);

  notificationHandlersRegister(container);
}

export function get<AddressService>(key: 'addressService'): AddressService;
export function get<ApiService>(key: 'apiService'): ApiService;
export function get<CacheService>(key: 'cacheService'): CacheService;
export function get<ChurchReportService>(key: 'churchReportService'): ChurchReportService;
export function get<ChurchSevice>(key: 'churchService'): ChurchSevice;
export function get<EventService>(key: 'eventService'): EventService;
export function get<FacebookService>(key: 'facebookService'): FacebookService;
export function get<GooglekService>(key: 'googleService'): GooglekService;
export function get<InformativeService>(key: 'informativeService'): InformativeService;
export function get<LogService>(key: 'logService'): LogService;
export function get<NotificationService>(key: 'notificationService'): NotificationService;
export function get<ProfileService>(key: 'profileService'): ProfileService;
export function get<QuizService>(key: 'quizService'): QuizService;
export function get<StorageService>(key: 'storageService'): StorageService;
export function get<TokenService>(key: 'tokenService'): TokenService;
export function get<T>(key: string): T {
  if (!container) throw new Error('services not initialized');
  return container.get(key);
}