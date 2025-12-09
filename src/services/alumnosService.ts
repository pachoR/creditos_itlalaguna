import api from './api';
import type { Alumno, CreateAlumnoDto, UpdateAlumnoDto } from '../types/alumno';
import type { AlumnoCreditosReport } from '../types/alumno';

export class AlumnosService {
    private static BASE_URL = '/api/alumno';

    static async getAll(): Promise<Alumno[]> {
        const response = await api.get(`${this.BASE_URL}/all`);
        return response.data;
    }

    static async getAlumnosCreditosReport(): Promise<AlumnoCreditosReport[]> {
        const response = await api.get<AlumnoCreditosReport[]>(`${this.BASE_URL}/creditos-report`);
        return response.data;
    }

    static async create(alumno: CreateAlumnoDto): Promise<Alumno> {
        const response = await api.post<Alumno>(`${this.BASE_URL}/create`, alumno);
        return response.data;
    }

    static async update(id: number, alumno: UpdateAlumnoDto): Promise<Alumno> {
        const response = await api.put<Alumno>(`${this.BASE_URL}/update/${id}`, alumno);
        return response.data;
    }

    static async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete/${id}`);
    }
}

export default AlumnosService;
