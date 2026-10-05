import { IDashboardRepository } from '../../domain/repositories/IManagementRepository';

export class GetDashboardStatus {
  constructor(private readonly repository: IDashboardRepository) {}

  execute(): Promise<string> {
    return this.repository.getStatus();
  }
}