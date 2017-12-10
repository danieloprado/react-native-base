import { Container } from '../container';
import { FacebookService } from '../models/facebook';

export function facebookFactory(container: Container): FacebookService {
  return new FacebookService(container.get('logService'));
}