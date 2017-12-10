import { Container } from '../container';
import { INotificationService } from '../interfaces/notification';
import { handle as openInformativeHandler } from './openInformative';

export function register(container: Container): void {
  const notificationService = container.get<INotificationService>('notificationService');

  notificationService.registerHandler('open-informative', openInformativeHandler);
}