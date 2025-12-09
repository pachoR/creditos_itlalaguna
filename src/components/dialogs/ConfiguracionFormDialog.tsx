import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Divider,
    IconButton,
    CircularProgress,
    alpha,
} from '@mui/material';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import type { Configuracion, CreateConfiguracionDto } from '../../types/configuracion';

interface FormData {
    config_nombre: string;
    config_valor: string;
}

const initialFormData: FormData = {
    config_nombre: '',
    config_valor: '',
};

interface ConfiguracionFormDialogProps {
    open: boolean;
    configuracion: Configuracion | null;
    onClose: () => void;
    onSubmit: (data: CreateConfiguracionDto) => Promise<void>;
}

export const ConfiguracionFormDialog = ({
    open,
    configuracion,
    onClose,
    onSubmit,
}: ConfiguracionFormDialogProps) => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (configuracion) {
            setFormData({
                config_nombre: configuracion.config_nombre,
                config_valor: configuracion.config_valor,
            });
        } else {
            setFormData(initialFormData);
        }
        setFormErrors({});
    }, [configuracion, open]);

    const validateForm = (): boolean => {
        const errors: Partial<FormData> = {};

        if (!formData.config_nombre.trim()) {
            errors.config_nombre = 'El nombre de configuración es requerido';
        }
        if (!formData.config_valor.trim()) {
            errors.config_valor = 'El valor de configuración es requerido';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            const configuracionData: CreateConfiguracionDto = {
                config_nombre: formData.config_nombre.trim(),
                config_valor: formData.config_valor.trim(),
            };

            await onSubmit(configuracionData);
            handleClose();
        } catch (error) {
            console.error('Error in form submit:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData(initialFormData);
        setFormErrors({});
        onClose();
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (formErrors[field]) {
            setFormErrors({ ...formErrors, [field]: undefined });
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={submitting ? undefined : handleClose} 
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
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {configuracion ? (
                        <EditIcon color="primary" sx={{ fontSize: 28 }} />
                    ) : (
                        <AddIcon color="primary" sx={{ fontSize: 28 }} />
                    )}
                    <Box>
                        <Typography variant="h6" component="div" fontWeight={600}>
                            {configuracion ? 'Editar Configuración' : 'Nueva Configuración'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {configuracion ? 'Actualizar valor de configuración' : 'Agregar nueva configuración'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={handleClose}
                    disabled={submitting}
                    size="small"
                    sx={{
                        color: 'text.secondary',
                        '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 3, pb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        fullWidth
                        label="Nombre de Configuración"
                        value={formData.config_nombre}
                        onChange={(e) => handleInputChange('config_nombre', e.target.value)}
                        error={!!formErrors.config_nombre}
                        helperText={formErrors.config_nombre || 'Identificador único de la configuración'}
                        disabled={submitting || !!configuracion}
                        InputProps={{
                            startAdornment: (
                                <SettingsIcon sx={{ mr: 1, color: 'action.active' }} />
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Valor de Configuración"
                        value={formData.config_valor}
                        onChange={(e) => handleInputChange('config_valor', e.target.value)}
                        error={!!formErrors.config_valor}
                        helperText={formErrors.config_valor || 'Valor asignado a la configuración'}
                        disabled={submitting}
                        multiline
                        rows={2}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                            }
                        }}
                    />
                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    disabled={submitting}
                    variant="outlined"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={16} /> : <SaveIcon />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        minWidth: 120,
                    }}
                >
                    {submitting ? 'Guardando...' : configuracion ? 'Actualizar' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
