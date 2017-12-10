import { Container } from '../container';
import { TokenService } from '../models/token';

export function tokenFactory(container: Container): TokenService {
  return new TokenService(
    container.get('storageService')
  );
}