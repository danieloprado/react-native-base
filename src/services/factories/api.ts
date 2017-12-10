import * as settings from '../../settings';
import { Container } from '../container';
import { ApiService } from '../models/api';

export function apiFactory(container: Container): ApiService {
  return new ApiService(
    settings.apiEndpoint,
    container.get('logService'),
    container.get('tokenService')
  );
}