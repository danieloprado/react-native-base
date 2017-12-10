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
import { IAddressService } from './interfaces/address';
import { IApiService } from './interfaces/api';
import { ICacheService } from './interfaces/cache';
import { IChurchReportService } from './interfaces/chuchReport';
import { IChurchSevice } from './interfaces/church';
import { IEventService } from './interfaces/event';
import { IFacebookService } from './interfaces/facebook';
import { IGoogleService } from './interfaces/google';
import { IInformativeService } from './interfaces/informative';
import { ILogService } from './interfaces/log';
import { INotificationService } from './interfaces/notification';
import { IProfileService } from './interfaces/profile';
import { IQuizService } from './interfaces/quiz';
import { IStorageService } from './interfaces/storage';
import { ITokenService } from './interfaces/token';
import { register as notificationHandlersRegister } from './notification-handlers';

let container: Container;

export function init(): void {
  container = new Container();

  container.register<IAddressService>('addressService', addressFactory);
  container.register<IApiService>('apiService', apiFactory);
  container.register<ICacheService>('cacheService', cacheFactory);
  container.register<IChurchReportService>('churchReportService', churchReportFactory);
  container.register<IChurchSevice>('churchService', churchFactory);
  container.register<IEventService>('eventService', eventFactory);
  container.register<IFacebookService>('facebookService', facebookFactory);
  container.register<IGoogleService>('googleService', googleFactory);
  container.register<IInformativeService>('informativeService', informativeFactory);
  container.register<ILogService>('logService', logFactory);
  container.register<INotificationService>('notificationService', notificationFactory);
  container.register<IProfileService>('profileService', profileFactory);
  container.register<IQuizService>('quizService', quizFactory);
  container.register<IStorageService>('storageService', storageFactory);
  container.register<ITokenService>('tokenService', tokenFactory);

  notificationHandlersRegister(container);
}

export function get<IAddressService>(key: 'addressService'): IAddressService;
export function get<IApiService>(key: 'apiService'): IApiService;
export function get<ICacheService>(key: 'cacheService'): ICacheService;
export function get<IChurchReportService>(key: 'churchReportService'): IChurchReportService;
export function get<IChurchSevice>(key: 'churchService'): IChurchSevice;
export function get<IEventService>(key: 'eventService'): IEventService;
export function get<IFacebookService>(key: 'facebookService'): IFacebookService;
export function get<IGooglekService>(key: 'googleService'): IGooglekService;
export function get<IInformativeService>(key: 'informativeService'): IInformativeService;
export function get<ILogService>(key: 'logService'): ILogService;
export function get<INotificationService>(key: 'notificationService'): INotificationService;
export function get<IProfileService>(key: 'profileService'): IProfileService;
export function get<IQuizService>(key: 'quizService'): IQuizService;
export function get<IStorageService>(key: 'storageService'): IStorageService;
export function get<ITokenService>(key: 'tokenService'): ITokenService;
export function get<T>(key: string): T {
  if (!container) throw new Error('services not initialized');
  return container.get(key);
}