import { describe, expect, it, vi, beforeEach } from 'vitest';
import { HttpOperationUnitRepository } from './HttpOperationUnitRepository';
import { AxiosHttpClient } from '../api/AxiosHttpClient';
import { GetOperationUnits } from '../../use-cases/operation-unit/GetOperationUnits';

vi.mock('../api/AxiosHttpClient', () => ({
  AxiosHttpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('HttpOperationUnitRepository & GetOperationUnits', () => {
  let repository: HttpOperationUnitRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new HttpOperationUnitRepository();
  });

  it('calls /api/operation-units without query string when no params provided', async () => {
    vi.mocked(AxiosHttpClient.get).mockResolvedValueOnce({ data: [] });

    const result = await repository.list();

    expect(AxiosHttpClient.get).toHaveBeenCalledWith('/api/operation-units');
    expect(result).toEqual([]);
  });

  it('appends ?scope=true when scope param is true', async () => {
    vi.mocked(AxiosHttpClient.get).mockResolvedValueOnce({
      data: [
        {
          id: 'ou-sub',
          code: 'CAB-TAG',
          name: 'Cabang Tulungagung',
          type: 'OPERATION_UNIT',
          status: true,
        },
      ],
    });

    const result = await repository.list({ scope: true });

    expect(AxiosHttpClient.get).toHaveBeenCalledWith('/api/operation-units?scope=true');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Cabang Tulungagung');
  });

  it('forwards scope parameter through GetOperationUnits use case', async () => {
    vi.mocked(AxiosHttpClient.get).mockResolvedValueOnce({ data: [] });
    const useCase = new GetOperationUnits(repository);

    await useCase.execute({ scope: true });

    expect(AxiosHttpClient.get).toHaveBeenCalledWith('/api/operation-units?scope=true');
  });
});
