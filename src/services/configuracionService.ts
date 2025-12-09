import api from './api';
import type { Configuracion, CreateConfiguracionDto, UpdateConfiguracionDto } from '../types/configuracion';

export class ConfiguracionService {
    private static BASE_URL = '/api/configuracion';

    static async getAll(): Promise<Configuracion[]> {
        const response = await api.get<Configuracion[]>(`${this.BASE_URL}`);
        return response.data;
    }

    static async getByNombre(nombre: string): Promise<Configuracion> {
        const response = await api.get<Configuracion>(`${this.BASE_URL}/${nombre}`);
        return response.data;
    }

    static async create(configuracion: CreateConfiguracionDto): Promise<Configuracion> {
        const response = await api.post<Configuracion>(`${this.BASE_URL}`, configuracion);
        return response.data;
    }

    static async update(nombre: string, configuracion: UpdateConfiguracionDto): Promise<Configuracion> {
        const response = await api.put<Configuracion>(`${this.BASE_URL}/${nombre}`, configuracion);
        return response.data;
    }

    static async delete(nombre: string): Promise<void> {
        await api.delete(`${this.BASE_URL}/${nombre}`);
    }
}

export default ConfiguracionService;
