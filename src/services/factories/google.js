import { GoogleService } from '../models/google';

export default function googleFactory(container) {
  return new GoogleService(
    container.get('settings'),
    container.get('logService')
  );
}