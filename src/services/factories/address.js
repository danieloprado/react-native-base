import { AddressService } from '../models/address';

export default function addressFactory(container) {
  return new AddressService(
    container.get('settings'),
    container.get('storageService')
  );
}