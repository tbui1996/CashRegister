import axios, { AxiosInstance } from 'axios';

export interface ChangeRequest {
  amountOwed: number;
  amountPaid: number;
}

export interface ChangeResponse {
  amountOwed: number;
  amountPaid: number;
  change: number;
  denominations: Record<string, number>;
  formattedChange: string;
}

class CashRegisterAPI {
  private api: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:8080') {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async calculateChange(request: ChangeRequest): Promise<ChangeResponse> {
    const response = await this.api.post<ChangeResponse>('/api/change', request);
    return response.data;
  }

  async calculateBatch(requests: ChangeRequest[]): Promise<ChangeResponse[]> {
    const response = await this.api.post<ChangeResponse[]>('/api/change/batch', requests);
    return response.data;
  }

  async uploadFile(file: File): Promise<ChangeResponse[]> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.api.post<ChangeResponse[]>('/api/change/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async checkHealth(): Promise<boolean> {
    try {
      await this.api.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

export const cashRegisterAPI = new CashRegisterAPI();
