import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    IconButton,
    CircularProgress,
    alpha,
    Chip,
} from '@mui/material';
import {
    Warning as WarningIcon,
    Close as CloseIcon,
    DeleteForever as DeleteIcon,
    Event as EventIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    School as SchoolIcon,
} from '@mui/icons-material';
import type { Actividad } from '../../types/actividad';

interface DeleteActividadDialogProps {
    open: boolean;
    actividad: Actividad | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const DeleteActividadDialog = ({
    open,
    actividad,
    onClose,
    onConfirm,
}: DeleteActividadDialogProps) => {
    const [deleting, setDeleting] = useState(false);

    const handleConfirm = async () => {
        try {
            setDeleting(true);
            await onConfirm();
            setDeleting(false);
            onClose();
        } catch (error) {
            console.error('Error in delete confirm:', error);
            setDeleting(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={deleting ? undefined : onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                elevation: 3,
                sx: {
                    borderRadius: 2,
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 1,
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.05),
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <WarningIcon 
                        sx={{ 
                            fontSize: 32, 
                            color: 'error.main',
                        }} 
                    />
                    <Box>
                        <Typography variant="h6" component="div" fontWeight={600} color="error.main">
                            Confirmar Eliminación
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Esta acción es permanente
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={onClose}
                    disabled={deleting}
                    size="small"
                    sx={{
                        color: 'text.secondary',
                        '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                            color: 'error.main',
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 3, pb: 2 }}>
                <Box 
                    sx={{ 
                        p: 2.5, 
                        borderRadius: 2,
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                        border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <EventIcon color="action" />
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Datos de la Actividad
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                                Nombre:
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {actividad?.act_nombre}
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                                Créditos:
                            </Typography>
                            <Chip 
                                label={actividad?.act_creditos} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                                Horario:
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {actividad?.act_hora_inicio.substring(0, 5)} - {actividad?.act_hora_fin.substring(0, 5)}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                                Docente:
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {actividad?.docente.nombre} {actividad?.docente.apellidos}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                                Periodo:
                            </Typography>
                            <Chip 
                                label={actividad?.periodo.nombre} 
                                size="small" 
                                color="info" 
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </Box>

                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mt: 2.5, fontStyle: 'italic', textAlign: 'center' }}
                >
                    ¿Estás seguro de que deseas continuar?
                </Typography>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button 
                    onClick={onClose} 
                    disabled={deleting}
                    variant="outlined"
                    color="inherit"
                    sx={{
                        minWidth: 100,
                        textTransform: 'none',
                        fontWeight: 500,
                    }}
                >
                    Cancelar
                </Button>
                <Button 
                    onClick={handleConfirm} 
                    variant="contained" 
                    color="error"
                    disabled={deleting}
                    startIcon={deleting ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
                    sx={{
                        minWidth: 140,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 2,
                        '&:hover': {
                            boxShadow: 4,
                        }
                    }}
                >
                    {deleting ? 'Eliminando...' : 'Eliminar Actividad'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteActividadDialog;
