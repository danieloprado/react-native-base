import { Container } from '../container';
import { ChurchReportService } from '../models/churchReport';

export function churchReportFactory(container: Container): ChurchReportService {
  return new ChurchReportService(container.get('apiService'));
}