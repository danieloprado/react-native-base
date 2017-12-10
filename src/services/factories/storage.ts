import { Container } from '../container';
import { StorageService } from '../models/storage';

export function storageFactory(container: Container): StorageService {
  return new StorageService();
}