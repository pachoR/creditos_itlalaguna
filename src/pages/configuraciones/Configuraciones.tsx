import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    TextField,
    Alert,
    Snackbar,
    InputAdornment,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import ConfiguracionService from '../../services/configuracionService';
import type { Configuracion, CreateConfiguracionDto, UpdateConfiguracionDto } from '../../types/configuracion';
import { ConfiguracionFormDialog } from '../../components/dialogs/ConfiguracionFormDialog';
import { DeleteConfiguracionDialog } from '../../components/dialogs/DeleteConfiguracionDialog';
import GenericDataGrid from '../../components/dataGrid/GenericDataGrid';

export const Configuraciones = () => {
    const [configuraciones, setConfiguraciones] = useState<Configuracion[]>([]);
    const [filteredConfiguraciones, setFilteredConfiguraciones] = useState<Configuracion[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editingConfiguracion, setEditingConfiguracion] = useState<Configuracion | null>(null);
    const [deletingConfiguracion, setDeletingConfiguracion] = useState<Configuracion | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info';
    }>({ open: false, message: '', severity: 'success' });

    const columns: GridColDef[] = [
        {
            field: 'config_nombre',
            headerName: 'Nombre',
            width: 250,
            flex: 1,
        },
        {
            field: 'config_valor',
            headerName: 'Valor',
            width: 300,
            flex: 1,
        },
    ];

    useEffect(() => {
        loadConfiguraciones();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredConfiguraciones(configuraciones);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = configuraciones.filter(
                (config) =>
                    config.config_nombre.toLowerCase().includes(query) ||
                    config.config_valor.toLowerCase().includes(query)
            );
            setFilteredConfiguraciones(filtered);
        }
    }, [searchQuery, configuraciones]);

    const loadConfiguraciones = async () => {
        try {
            setLoading(true);
            const data = await ConfiguracionService.getAll();
            setConfiguraciones(data);
        } catch (error) {
            showSnackbar('Error al cargar las configuraciones', 'error');
            console.error('Error loading configuraciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenDialog = (configuracion?: Configuracion) => {
        setEditingConfiguracion(configuracion || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingConfiguracion(null);
    };

    const handleSubmitConfiguracion = async (configuracionData: CreateConfiguracionDto) => {
        try {
            if (editingConfiguracion) {
                // Para editar, solo enviamos el valor
                const updateData: UpdateConfiguracionDto = {
                    config_valor: configuracionData.config_valor
                };
                await ConfiguracionService.update(editingConfiguracion.config_nombre, updateData);
                showSnackbar('Configuración actualizada exitosamente', 'success');
            } else {
                await ConfiguracionService.create(configuracionData);
                showSnackbar('Configuración creada exitosamente', 'success');
            }
            loadConfiguraciones();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al guardar la configuración';
            showSnackbar(message, 'error');
            throw error;
        }
    };

    const handleOpenDeleteDialog = (configuracion: Configuracion) => {
        setDeletingConfiguracion(configuracion);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeletingConfiguracion(null);
    };

    const handleDeleteConfiguracion = async () => {
        if (!deletingConfiguracion) return;

        try {
            await ConfiguracionService.delete(deletingConfiguracion.config_nombre);
            showSnackbar('Configuración eliminada exitosamente', 'success');
            loadConfiguraciones();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al eliminar la configuración';
            showSnackbar(message, 'error');
            throw error;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Gestión de Configuraciones
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Administra las configuraciones del sistema
                </Typography>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    placeholder="Buscar por nombre o valor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nueva Configuración
                </Button>
            </Box>

            <GenericDataGrid
                rows={filteredConfiguraciones}
                columns={columns}
                loading={loading}
                onEdit={handleOpenDialog}
                onDelete={handleOpenDeleteDialog}
                emptyMessage={
                    searchQuery
                        ? 'No se encontraron configuraciones que coincidan con la búsqueda'
                        : 'No hay configuraciones registradas. Crea una nueva para comenzar.'
                }
                pageSize={10}
                getRowId={(row) => row.config_nombre}
            />

            <ConfiguracionFormDialog
                open={openDialog}
                configuracion={editingConfiguracion}
                onClose={handleCloseDialog}
                onSubmit={handleSubmitConfiguracion}
            />

            <DeleteConfiguracionDialog
                open={openDeleteDialog}
                configuracion={deletingConfiguracion}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteConfiguracion}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Configuraciones;
