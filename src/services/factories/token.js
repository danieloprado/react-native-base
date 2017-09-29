import { TokenService } from '../models/token';

export default function tokenFactory(container) {
  return new TokenService(
    container.get('storageService')
  );
}