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
    Settings as SettingsIcon,
} from '@mui/icons-material';
import type { Configuracion } from '../../types/configuracion';

interface DeleteConfiguracionDialogProps {
    open: boolean;
    configuracion: Configuracion | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const DeleteConfiguracionDialog = ({
    open,
    configuracion,
    onClose,
    onConfirm,
}: DeleteConfiguracionDialogProps) => {
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

            <DialogContent sx={{ py: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
                        ¿Estás seguro de que deseas eliminar esta configuración?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Esta acción no se puede deshacer. La configuración será eliminada permanentemente del sistema.
                    </Typography>
                </Box>

                {configuracion && (
                    <Box 
                        sx={{ 
                            p: 2, 
                            borderRadius: 1.5,
                            bgcolor: (theme) => alpha(theme.palette.error.main, 0.05),
                            border: (theme) => `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SettingsIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    CONFIGURACIÓN
                                </Typography>
                            </Box>
                            
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                    Nombre
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
                                    {configuracion.config_nombre}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                    Valor
                                </Typography>
                                <Chip 
                                    label={configuracion.config_valor}
                                    size="small"
                                    sx={{ 
                                        mt: 0.5,
                                        fontWeight: 500,
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button
                    onClick={onClose}
                    disabled={deleting}
                    variant="outlined"
                    sx={{
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
                    startIcon={deleting ? <CircularProgress size={16} /> : <DeleteIcon />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        minWidth: 120,
                    }}
                >
                    {deleting ? 'Eliminando...' : 'Eliminar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
