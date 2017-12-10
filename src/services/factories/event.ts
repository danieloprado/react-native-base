import { Container } from '../container';
import { EventService } from '../models/event';

export function eventFactory(container: Container): EventService {
  return new EventService(container.get('apiService'));
}