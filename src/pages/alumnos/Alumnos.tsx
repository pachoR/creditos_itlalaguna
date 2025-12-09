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
import AlumnosService from '../../services/alumnosService';
import ConfiguracionService from '../../services/configuracionService';
import type { Alumno, CreateAlumnoDto } from '../../types/alumno';
import AlumnoFormDialog from '../../components/dialogs/AlumnoFormDialog';
import DeleteAlumnoDialog from '../../components/dialogs/DeleteAlumnoDialog';
import GenericDataGrid from '../../components/dataGrid/GenericDataGrid';

export const Alumnos = () => {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [filteredAlumnos, setFilteredAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null);
    const [deletingAlumno, setDeletingAlumno] = useState<Alumno | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [numeroControlLength, setNumeroControlLength] = useState<number>(9);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info';
    }>({ open: false, message: '', severity: 'success' });

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90,
        },
        {
            field: 'nctrl',
            headerName: 'No. Control',
            width: 150,
            flex: 1,
        },
        {
            field: 'nombres',
            headerName: 'Nombres',
            width: 200,
            flex: 1,
        },
        {
            field: 'apellidos',
            headerName: 'Apellidos',
            width: 200,
            flex: 1,
        },
    ];

    useEffect(() => {
        loadAlumnos();
        loadNumeroControlLength();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredAlumnos(alumnos);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = alumnos.filter(
                (alumno) =>
                    alumno.nctrl.toLowerCase().includes(query) ||
                    alumno.nombres.toLowerCase().includes(query) ||
                    alumno.apellidos.toLowerCase().includes(query)
            );
            setFilteredAlumnos(filtered);
        }
    }, [searchQuery, alumnos]);

    const loadAlumnos = async () => {
        try {
            setLoading(true);
            const data = await AlumnosService.getAll();
            setAlumnos(data);
        } catch (error) {
            showSnackbar('Error al cargar los alumnos', 'error');
            console.error('Error loading alumnos:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadNumeroControlLength = async () => {
        try {
            const config = await ConfiguracionService.getByNombre('numero_control_length');
            const length = parseInt(config.config_valor, 10);
            if (!isNaN(length) && length > 0) {
                setNumeroControlLength(length);
            }
        } catch (error) {
            console.error('Error fetching numero_control_length:', error);
            // Si hay error, mantener el valor por defecto de 9
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenDialog = (alumno?: Alumno) => {
        setEditingAlumno(alumno || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingAlumno(null);
    };

    const handleSubmitAlumno = async (alumnoData: CreateAlumnoDto) => {
        const nctrlLength = alumnoData.nctrl.trim().length;
        if (nctrlLength !== numeroControlLength) {
            showSnackbar(`Número de control inválido. Debe tener exactamente ${numeroControlLength} caracteres`, 'error');
            throw new Error('Número de control inválido');
        }

        try {
            if (editingAlumno) {
                await AlumnosService.update(editingAlumno.id, alumnoData);
                showSnackbar('Alumno actualizado exitosamente', 'success');
            } else {
                await AlumnosService.create(alumnoData);
                showSnackbar('Alumno creado exitosamente', 'success');
            }
            loadAlumnos();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al guardar el alumno';
            showSnackbar(message, 'error');
            throw error;
        }
    };

    const handleOpenDeleteDialog = (alumno: Alumno) => {
        setDeletingAlumno(alumno);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeletingAlumno(null);
    };

    const handleDeleteAlumno = async () => {
        if (!deletingAlumno) return;

        try {
            await AlumnosService.delete(deletingAlumno.id);
            showSnackbar('Alumno eliminado exitosamente', 'success');
            loadAlumnos();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al eliminar el alumno';
            showSnackbar(message, 'error');
            throw error;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Gestión de Alumnos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Administra la información de los alumnos del sistema
                </Typography>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    placeholder="Buscar por número de control, nombre o apellido..."
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
                    Nuevo Alumno
                </Button>
            </Box>

            <GenericDataGrid
                rows={filteredAlumnos}
                columns={columns}
                loading={loading}
                onEdit={handleOpenDialog}
                onDelete={handleOpenDeleteDialog}
                emptyMessage={
                    searchQuery
                        ? 'No se encontraron alumnos que coincidan con la búsqueda'
                        : 'No hay alumnos registrados. Crea uno nuevo para comenzar.'
                }
                pageSize={10}
            />

            <AlumnoFormDialog
                open={openDialog}
                alumno={editingAlumno}
                onClose={handleCloseDialog}
                onSubmit={handleSubmitAlumno}
            />

            <DeleteAlumnoDialog
                open={openDeleteDialog}
                alumno={deletingAlumno}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteAlumno}
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

export default Alumnos;
