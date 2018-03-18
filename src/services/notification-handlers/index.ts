import { handle as openInformativeHandler } from './openInformative';
import notificationService from '../notification';

notificationService.registerHandler('open-informative', openInformativeHandler);