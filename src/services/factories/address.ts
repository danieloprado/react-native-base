import * as settings from '../../settings';
import { Container } from '../container';
import { AddressService } from '../models/address';

export function addressFactory(container: Container): AddressService {
  return new AddressService(
    settings.defaultAddress.state,
    settings.defaultAddress.city
  );
}