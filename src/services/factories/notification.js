import { NotificationService } from '../models/notification';

export default function notificationFactory() {
  return new NotificationService();
}