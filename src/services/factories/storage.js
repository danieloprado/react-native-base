import { StorageService } from '../models/storage';

export default function storageFactory() {
  return new StorageService();
}