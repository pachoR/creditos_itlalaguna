import api from './api';
import type { Credito, CreateCreditoDto, UpdateCreditoDto } from '../types/credito';

export class CreditosService {
    private static BASE_URL = '/api/creditos';

    static async getAll(): Promise<Credito[]> {
        const response = await api.get<Credito[]>(`${this.BASE_URL}/all`);
        return response.data;
    }

    static async getById(id: number): Promise<Credito> {
        const response = await api.get<Credito>(`${this.BASE_URL}/${id}`);
        return response.data;
    }

    static async getByAlumno(alumnoId: string): Promise<Credito[]> {
        const response = await api.get<Credito[]>(`${this.BASE_URL}/alumno/${alumnoId}`);
        return response.data;
    }

    static async create(credito: CreateCreditoDto): Promise<Credito> {
        const response = await api.post<Credito>(`${this.BASE_URL}/create`, credito);
        return response.data;
    }

    static async update(credito: UpdateCreditoDto): Promise<Credito> {
        const response = await api.post<Credito>(`${this.BASE_URL}/update`, credito);
        return response.data;
    }

    static async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete/${id}`);
    }
}

export default CreditosService;
