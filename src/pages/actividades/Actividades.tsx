import { useEffect, useState } from "react";
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Stack,
    List,
    ListItemButton,
    Divider,
    InputAdornment,
    Avatar,
    Chip,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import {
    Search,
    Add,
    Save,
    Delete,
    Event,
    Person,
    Schedule,
    School
} from "@mui/icons-material";
import { ActividadesService } from "../../services/actividadesService";
import type { Actividad, CreateActividadDto } from "../../types/actividad";
import type { Periodo } from "../../types/periodo";
import type { Docente } from "../../types/docente";
import PeriodoService from "../../services/periodoService";
import DocentesService from "../../services/docentsService";
import DeleteActividadDialog from "../../components/dialogs/DeleteActividadDialog";

export const Actividades = () => {
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [filteredActividades, setFilteredActividades] = useState<Actividad[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);
    const [loading, setLoading] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [periodos, setPeriodos] = useState<Periodo[]>([]);
    const [docentes, setDocentes] = useState<Docente[]>([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deletingActividad, setDeletingActividad] = useState<Actividad | null>(null);
    const [formData, setFormData] = useState<CreateActividadDto>({
        act_nombre: '',
        act_creditos: 0,
        act_hor_ini: '',
        act_hor_fin: '',
        per_id: 0,
        doc_responsable: 0
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [severity, setSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    useEffect(() => {
        if (selectedActividad) {
            setFormData({
                act_nombre: selectedActividad.act_nombre,
                act_creditos: selectedActividad.act_creditos,
                act_hor_ini: selectedActividad.act_hora_inicio.substring(0, 5), // Formato HH:MM
                act_hor_fin: selectedActividad.act_hora_fin.substring(0, 5), // Formato HH:MM
                per_id: selectedActividad.periodo.id,
                doc_responsable: parseInt(selectedActividad.docente.id)
            });
        } else {
            setFormData({
                act_nombre: '',
                act_creditos: 0,
                act_hor_ini: '',
                act_hor_fin: '',
                per_id: 0,
                doc_responsable: 0
            });
        }
    }, [selectedActividad]);

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const fetchActividades = async () => {
        try {
            setLoading(true);
            const response = await ActividadesService.getAll();
            setActividades(response);
        } catch (error) {
            console.log("Error fetching actividades:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchPeriodos = async () => {
        try {
            setLoading(true);
            const response = await PeriodoService.getAll();
            setPeriodos(response);
        } catch (error) {
            console.log("Error fetching periodos:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchDocentes = async () => {
        try {
            setLoading(true);
            const response = await DocentesService.getAll();
            setDocentes(response);
        } catch (error) {
            console.log("Error fetching docentes:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredActividades(actividades);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = actividades.filter(
                (actividad) =>
                    actividad.act_nombre.toLowerCase().includes(query) ||
                    actividad.docente.nombre.toLowerCase().includes(query) ||
                    actividad.docente.apellidos.toLowerCase().includes(query) ||
                    actividad.periodo.nombre.toLowerCase().includes(query)
            );
            setFilteredActividades(filtered);
        }
    }, [searchQuery, actividades]);

    const handleCreateActividad = async () => {
        if (!formData.act_nombre.trim()) {
            setSeverity('error');
            setSnackbarMessage('El nombre de la actividad es requerido');
            setOpenSnackbar(true);
            return;
        }

        if (formData.act_creditos <= 0) {
            setSeverity('error');
            setSnackbarMessage('Los créditos deben ser mayor a 0');
            setOpenSnackbar(true);
            return;
        }

        if (!formData.act_hor_ini || !formData.act_hor_fin) {
            setSeverity('error');
            setSnackbarMessage('Las horas de inicio y fin son requeridas');
            setOpenSnackbar(true);
            return;
        }

        if (formData.per_id === 0) {
            setSeverity('error');
            setSnackbarMessage('Debe seleccionar un periodo');
            setOpenSnackbar(true);
            return;
        }

        if (formData.doc_responsable === 0) {
            setSeverity('error');
            setSnackbarMessage('Debe seleccionar un docente responsable');
            setOpenSnackbar(true);
            return;
        }

        try {
            setLoading(true);

            // Formatear las horas al formato HH:MM:SS si es necesario
            const dataToSend = {
                ...formData,
                act_hor_ini: formData.act_hor_ini.length === 5
                    ? `${formData.act_hor_ini}:00`
                    : formData.act_hor_ini,
                act_hor_fin: formData.act_hor_fin.length === 5
                    ? `${formData.act_hor_fin}:00`
                    : formData.act_hor_fin,
            };

            await ActividadesService.create(dataToSend);
            setSeverity('success');
            setSnackbarMessage('Actividad creada exitosamente');
            setOpenSnackbar(true);
            setIsCreatingNew(false);
            setFormData({
                act_nombre: '',
                act_creditos: 0,
                act_hor_ini: '',
                act_hor_fin: '',
                per_id: 0,
                doc_responsable: 0
            });
            await fetchActividades();
        } catch (error: any) {
            console.error('Error al crear actividad:', error);
            console.error('Respuesta del servidor:', error.response?.data);
            setSeverity('error');
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Error al crear la actividad';
            setSnackbarMessage(errorMessage);
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateActividad = async () => {
        if (!selectedActividad) return;

        if (!formData.act_nombre.trim()) {
            setSeverity('error');
            setSnackbarMessage('El nombre de la actividad es requerido');
            setOpenSnackbar(true);
            return;
        }

        if (formData.act_creditos <= 0) {
            setSeverity('error');
            setSnackbarMessage('Los créditos deben ser mayor a 0');
            setOpenSnackbar(true);
            return;
        }

        if (!formData.act_hor_ini || !formData.act_hor_fin) {
            setSeverity('error');
            setSnackbarMessage('Las horas de inicio y fin son requeridas');
            setOpenSnackbar(true);
            return;
        }

        if (formData.per_id === 0) {
            setSeverity('error');
            setSnackbarMessage('Debe seleccionar un periodo');
            setOpenSnackbar(true);
            return;
        }

        if (formData.doc_responsable === 0) {
            setSeverity('error');
            setSnackbarMessage('Debe seleccionar un docente responsable');
            setOpenSnackbar(true);
            return;
        }

        try {
            setLoading(true);

            // Formatear las horas al formato HH:MM:SS si es necesario
            const dataToUpdate = {
                act_id: selectedActividad.act_id,
                ...formData,
                act_hor_ini: formData.act_hor_ini.length === 5
                    ? `${formData.act_hor_ini}:00`
                    : formData.act_hor_ini,
                act_hor_fin: formData.act_hor_fin.length === 5
                    ? `${formData.act_hor_fin}:00`
                    : formData.act_hor_fin,
            };

            await ActividadesService.update(dataToUpdate);
            setSeverity('success');
            setSnackbarMessage('Actividad actualizada exitosamente');
            setOpenSnackbar(true);
            await fetchActividades();
            const updatedActividad = await ActividadesService.getById(selectedActividad.act_id.toString());
            setSelectedActividad(updatedActividad);
        } catch (error: any) {
            console.error('Error al actualizar actividad:', error);
            console.error('Respuesta del servidor:', error.response?.data);
            setSeverity('error');
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Error al actualizar la actividad';
            setSnackbarMessage(errorMessage);
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDeleteDialog = () => {
        if (!selectedActividad) return;
        setDeletingActividad(selectedActividad);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeletingActividad(null);
    };

    const handleDeleteActividad = async () => {
        if (!deletingActividad) return;

        try {
            await ActividadesService.delete(deletingActividad.act_id.toString());
            setSeverity('success');
            setSnackbarMessage('Actividad eliminada exitosamente');
            setOpenSnackbar(true);
            setSelectedActividad(null);
            setFormData({
                act_nombre: '',
                act_creditos: 0,
                act_hor_ini: '',
                act_hor_fin: '',
                per_id: 0,
                doc_responsable: 0
            });
            await fetchActividades();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al eliminar la actividad';
            setSeverity('error');
            setSnackbarMessage(message);
            setOpenSnackbar(true);
            throw error;
        }
    };

    useEffect(() => {
        fetchActividades();
        fetchPeriodos();
        fetchDocentes();
    }, []);

    return (
        <>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Gestión de Actividades
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Administra las actividades culturales y deportivas
                    </Typography>
                </Box>

                <Stack direction="row" spacing={3} sx={{ height: 'calc(90vh - 250px)' }}>
                    {/* Panel Izquierdo - Lista de Actividades */}
                    <Card sx={{ width: 350, display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    placeholder="Buscar por nombre, docente o periodo..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                fullWidth
                                sx={{ mb: 2 }}
                                onClick={() => {
                                    setIsCreatingNew(true);
                                    setSelectedActividad(null);
                                    setFormData({
                                        act_nombre: '',
                                        act_creditos: 0,
                                        act_hor_ini: '',
                                        act_hor_fin: '',
                                        per_id: 0,
                                        doc_responsable: 0
                                    });
                                }}
                            >
                                Nueva Actividad
                            </Button>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ flex: 1, overflow: 'auto' }}>
                                {filteredActividades.length > 0 ? (
                                    <List>
                                        {filteredActividades.map((actividad) => (
                                            <ListItemButton
                                                key={actividad.act_id}
                                                selected={selectedActividad?.act_id === actividad.act_id && !isCreatingNew}
                                                onClick={() => {
                                                    setSelectedActividad(actividad);
                                                    setIsCreatingNew(false);
                                                }}
                                                sx={{ borderRadius: 1, mb: 1, p: 1.5 }}
                                            >
                                                <Box sx={{ width: '100%' }}>
                                                    <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600 }}>
                                                        {actividad.act_nombre}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                                        <Person sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {actividad.docente.nombre} {actividad.docente.apellidos}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                        <Chip
                                                            label={`${actividad.act_creditos} créditos`}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                                        />
                                                        <Chip
                                                            label={actividad.periodo.nombre}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </ListItemButton>
                                        ))}
                                    </List>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No se encontraron actividades
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Panel Derecho - Detalles de Actividad */}
                    <Stack spacing={3} sx={{ flex: 1 }}>
                        <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 0 }}>
                                {isCreatingNew ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <Box sx={{ px: 3, pt: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: 'success.main',
                                                        fontSize: '1.5rem'
                                                    }}
                                                >
                                                    <Add fontSize="large" />
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6" gutterBottom sx={{ mb: 0.5 }}>
                                                        Nueva Actividad
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Completa los campos para crear una nueva actividad
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Divider />
                                        </Box>

                                        <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 3 }}>
                                            <Stack spacing={2.5} sx={{ maxWidth: 600, mx: 'auto' }}>
                                                <TextField
                                                    label="Nombre de la Actividad"
                                                    placeholder="Ingrese el nombre de la actividad"
                                                    size="small"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={formData.act_nombre}
                                                    onChange={(e) => handleChange('act_nombre', e.target.value)}
                                                />

                                                <TextField
                                                    label="Créditos"
                                                    type="number"
                                                    placeholder="Ingrese los créditos"
                                                    size="small"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={formData.act_creditos}
                                                    onChange={(e) => handleChange('act_creditos', Number(e.target.value))}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <School />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />

                                                <Stack direction="row" spacing={2}>
                                                    <TextField
                                                        label="Hora Inicio"
                                                        type="time"
                                                        size="small"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={formData.act_hor_ini}
                                                        onChange={(e) => handleChange('act_hor_ini', e.target.value)}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Schedule />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />

                                                    <TextField
                                                        label="Hora Fin"
                                                        type="time"
                                                        size="small"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={formData.act_hor_fin}
                                                        onChange={(e) => handleChange('act_hor_fin', e.target.value)}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Schedule />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Stack>

                                                <FormControl size="small" fullWidth>
                                                    <InputLabel>Periodo</InputLabel>
                                                    <Select
                                                        value={formData.per_id}
                                                        label="Periodo"
                                                        onChange={(e) => handleChange('per_id', Number(e.target.value))}
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <Event />
                                                            </InputAdornment>
                                                        }
                                                    >
                                                        <MenuItem value={0} disabled>
                                                            <em>Seleccione un periodo</em>
                                                        </MenuItem>
                                                        {periodos.map((periodo) => (
                                                            <MenuItem key={periodo.id} value={periodo.id}>
                                                                {periodo.nombre}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                <FormControl size="small" fullWidth>
                                                    <InputLabel>Docente Responsable</InputLabel>
                                                    <Select
                                                        value={formData.doc_responsable}
                                                        label="Docente Responsable"
                                                        onChange={(e) => handleChange('doc_responsable', Number(e.target.value))}
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <Person />
                                                            </InputAdornment>
                                                        }
                                                    >
                                                        <MenuItem value={0} disabled>
                                                            <em>Seleccione un docente</em>
                                                        </MenuItem>
                                                        {docentes.map((docente) => (
                                                            <MenuItem key={docente.id} value={docente.id}>
                                                                {docente.nombre} {docente.apellidos}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Stack>
                                        </Box>
                                        <Divider />

                                        <Box sx={{ px: 3, pb: 3, pt: 2 }}>
                                            <Stack direction="row" spacing={2} sx={{ maxWidth: 600, mx: 'auto' }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<Save />}
                                                    disabled={loading}
                                                    onClick={handleCreateActividad}
                                                    sx={{ minWidth: 140 }}
                                                >
                                                    Crear Actividad
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => {
                                                        setIsCreatingNew(false);
                                                        setFormData({
                                                            act_nombre: '',
                                                            act_creditos: 0,
                                                            act_hor_ini: '',
                                                            act_hor_fin: '',
                                                            per_id: 0,
                                                            doc_responsable: 0
                                                        });
                                                    }}
                                                    sx={{ minWidth: 140 }}
                                                >
                                                    Cancelar
                                                </Button>
                                            </Stack>
                                        </Box>
                                    </Box>
                                ) : selectedActividad ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <Box sx={{ px: 3, pt: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: 'primary.main',
                                                        fontSize: '1.5rem'
                                                    }}
                                                >
                                                    <Event fontSize="large" />
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6" gutterBottom sx={{ mb: 0.5 }}>
                                                        {selectedActividad.act_nombre}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                        <Chip
                                                            label={`${selectedActividad.act_creditos} créditos`}
                                                            size="small"
                                                            color="primary"
                                                            icon={<School />}
                                                        />
                                                        <Chip
                                                            label={selectedActividad.periodo.nombre}
                                                            size="small"
                                                            variant="outlined"
                                                            icon={<Event />}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Divider />
                                        </Box>

                                        <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 3 }}>
                                            <Stack spacing={2.5} sx={{ maxWidth: 600, mx: 'auto' }}>
                                                <TextField
                                                    label="Nombre de la Actividad"
                                                    size="small"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={formData.act_nombre}
                                                    onChange={(e) => handleChange('act_nombre', e.target.value)}
                                                />

                                                <TextField
                                                    label="Créditos"
                                                    type="number"
                                                    size="small"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={formData.act_creditos}
                                                    onChange={(e) => handleChange('act_creditos', Number(e.target.value))}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <School />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />

                                                <Stack direction="row" spacing={2}>
                                                    <TextField
                                                        label="Hora Inicio"
                                                        type="time"
                                                        size="small"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={formData.act_hor_ini}
                                                        onChange={(e) => handleChange('act_hor_ini', e.target.value)}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Schedule />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />

                                                    <TextField
                                                        label="Hora Fin"
                                                        type="time"
                                                        size="small"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={formData.act_hor_fin}
                                                        onChange={(e) => handleChange('act_hor_fin', e.target.value)}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Schedule />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Stack>

                                                <FormControl size="small" fullWidth>
                                                    <InputLabel>Periodo</InputLabel>
                                                    <Select
                                                        value={formData.per_id}
                                                        label="Periodo"
                                                        onChange={(e) => handleChange('per_id', Number(e.target.value))}
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <Event />
                                                            </InputAdornment>
                                                        }
                                                    >
                                                        <MenuItem value={0} disabled>
                                                            <em>Seleccione un periodo</em>
                                                        </MenuItem>
                                                        {periodos.map((periodo) => (
                                                            <MenuItem key={periodo.id} value={periodo.id}>
                                                                {periodo.nombre}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                <FormControl size="small" fullWidth>
                                                    <InputLabel>Docente Responsable</InputLabel>
                                                    <Select
                                                        value={formData.doc_responsable}
                                                        label="Docente Responsable"
                                                        onChange={(e) => handleChange('doc_responsable', Number(e.target.value))}
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <Person />
                                                            </InputAdornment>
                                                        }
                                                    >
                                                        <MenuItem value={0} disabled>
                                                            <em>Seleccione un docente</em>
                                                        </MenuItem>
                                                        {docentes.map((docente) => (
                                                            <MenuItem key={docente.id} value={docente.id}>
                                                                {docente.nombre} {docente.apellidos}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                                                        Información del Docente
                                                    </Typography>
                                                    <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                                        <Stack spacing={1}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Person sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                                <Typography variant="body2">
                                                                    <strong>Nombre:</strong> {selectedActividad.docente.nombre} {selectedActividad.docente.apellidos}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Schedule sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                                <Typography variant="body2">
                                                                    <strong>Horario:</strong> {selectedActividad.act_hora_inicio.substring(0, 5)} - {selectedActividad.act_hora_fin.substring(0, 5)}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Card>
                                                </Box>
                                            </Stack>
                                        </Box>
                                        <Divider />

                                        <Box sx={{ px: 3, pb: 3, pt: 2 }}>
                                            <Stack direction="row" spacing={2} sx={{ maxWidth: 600, mx: 'auto' }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<Save />}
                                                    disabled={loading}
                                                    onClick={handleUpdateActividad}
                                                    sx={{ minWidth: 140 }}
                                                >
                                                    Guardar
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    startIcon={<Delete />}
                                                    disabled={loading}
                                                    onClick={handleOpenDeleteDialog}
                                                    sx={{ minWidth: 140 }}
                                                >
                                                    Eliminar
                                                </Button>
                                            </Stack>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            textAlign: 'center',
                                            p: 4
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                bgcolor: 'grey.200',
                                                color: 'grey.400',
                                                mb: 2
                                            }}
                                        >
                                            <Event fontSize="large" />
                                        </Avatar>
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            Sin actividad seleccionada
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Selecciona una actividad de la lista para ver y editar sus detalles
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Stack>
                </Stack>
            </Container>

            <DeleteActividadDialog
                open={openDeleteDialog}
                actividad={deletingActividad}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteActividad}
            />
        </>
    )
}

export default Actividades