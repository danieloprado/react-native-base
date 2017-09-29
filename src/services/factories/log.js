import { LogService } from '../models/log';

export default function logFactory(container) {
  return new LogService(
    container.get('settings')
  );
}