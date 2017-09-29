import { ApiService } from '../models/api';

export default function apiFactory(container) {
  return new ApiService(
    container.get('settings'),
    container.get('logService'),
    container.get('tokenService')
  );
}