import { isDevelopment } from '../../settings';
import { Container } from '../container';
import { LogService } from '../models/log';

export function logFactory(container: Container): LogService {
  return new LogService(isDevelopment);
}