import { googleApi } from '../../settings';
import { Container } from '../container';
import { GoogleService } from '../models/google';

export function googleFactory(container: Container): GoogleService {
  return new GoogleService(
    container.get('logService'),
    googleApi
  );
}