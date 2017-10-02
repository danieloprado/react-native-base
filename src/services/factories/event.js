import { EventService } from '../models/event';

export default function eventServiceFactory(container) {
  return new EventService(
    container.get('apiService')
  );
}