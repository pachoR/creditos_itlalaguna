export interface Configuracion {
    config_nombre: string;
    config_valor: string;
}

export interface CreateConfiguracionDto {
    config_nombre: string;
    config_valor: string;
}

export interface UpdateConfiguracionDto {
    config_valor: string;
}
