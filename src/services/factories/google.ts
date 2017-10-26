import { googleApi } from '../../settings';
import { Container } from '../container';
import { IGooglekService } from '../interfaces/google';
import { GoogleService } from '../models/google';

export function googleFactory(container: Container): IGooglekService {
  return new GoogleService(
    container.get('logService'),
    googleApi
  );
}