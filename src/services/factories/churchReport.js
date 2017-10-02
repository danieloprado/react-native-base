import { ChurchReportService } from '../models/churchReport';

export default function churchReportFactory(container) {
  return new ChurchReportService(
    container.get('apiService')
  );
}