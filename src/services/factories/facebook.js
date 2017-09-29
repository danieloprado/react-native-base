import { FacebookService } from '../models/facebook';

export default function cacheFactory(container) {
  return new FacebookService(
    container.get('settings'),
    container.get('logService')
  );
}