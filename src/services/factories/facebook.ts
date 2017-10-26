import { Container } from '../container';
import { IFacebookService } from '../interfaces/facebook';
import { FacebookService } from '../models/facebook';

export function cacheFactory(container: Container): IFacebookService {
  return new FacebookService(container.get('logService'));
}