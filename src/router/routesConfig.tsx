import React from 'react';
import type { SvgIconProps } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

import { 
    Login, 
    Unauthorized,
    Home,
    Creditos,
    Actividades,
    Alumnos,
    Docentes,
    Usuarios,
    Periodos,
    Configuraciones,
    NotFound
} from '../pages';

export interface RouteConfig {
    path: string;
    title: string;
    component: React.ComponentType;
    icon?: React.ComponentType<SvgIconProps>;
    isPublic?: boolean;
    allowedRoles?: string[];
    showInNav?: boolean;
}

export const routesConfig: RouteConfig[] = [
    {
        path: '/login',
        title: 'Login',
        component: Login,
        isPublic: true,
        showInNav: false,
    },
    {
        path: '/unauthorized',
        title: 'No autorizado',
        component: Unauthorized,
        isPublic: true,
        showInNav: false,
    },
    {
        path: '/',
        title: 'Inicio',
        component: Home,
        icon: HomeIcon,
        showInNav: true,
    },
    {
        path: '/creditos',
        title: 'Créditos',
        component: Creditos,
        icon: PeopleIcon,
        allowedRoles: ['ADMINISTRADOR', 'DOCENTE'],
        showInNav: true,
    },
    {
        path: '/actividades',
        title: 'Actividades',
        component: Actividades,
        icon: EventNoteIcon,
        allowedRoles: ['ADMINISTRADOR', 'DOCENTE'],
        showInNav: true,
    },
    {
        path: '/alumnos',
        title: 'Alumnos',
        component: Alumnos,
        icon: SchoolIcon,
        allowedRoles: ['ADMINISTRADOR'],
        showInNav: true,
    },
    {
        path: '/docentes',
        title: 'Docentes',
        component: Docentes,
        icon: PersonIcon,
        allowedRoles: ['ADMINISTRADOR'],
        showInNav: true,
    },
    {
        path: '/usuarios',
        title: 'Usuarios',
        component: Usuarios,
        icon: PeopleIcon,
        allowedRoles: ['ADMINISTRADOR'],
        showInNav: true,
    },
    {
        path: '/periodos',
        title: 'Periodos',
        component: Periodos,
        icon: HomeIcon,
        showInNav: true,
        allowedRoles: ['ADMINISTRADOR'],
    },
    {
        path: '/configuraciones',
        title: 'Configuracion',
        component: Configuraciones,
        icon: SettingsIcon,
        showInNav: true,
        allowedRoles: ['ADMINISTRADOR'],
    },
    {
        path: '*',
        title: 'No encontrado',
        component: NotFound,
        isPublic: true,
        showInNav: false,
    },
];

export const getPublicRoutes = () => routesConfig.filter(route => route.isPublic);
export const getProtectedRoutes = () => routesConfig.filter(route => !route.isPublic);
export const getNavigationRoutes = () => routesConfig.filter(route => route.showInNav);
