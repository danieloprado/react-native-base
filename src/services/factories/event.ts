import { Container } from '../container';
import { IEventService } from '../interfaces/event';
import { EventService } from '../models/event';

export function eventServiceFactory(container: Container): IEventService {
  return new EventService(container.get('apiService'));
}