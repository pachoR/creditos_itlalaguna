import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    Avatar,
    useTheme,
    Menu,
    MenuItem,
    ListItemIcon,
    IconButton,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthService from '../../services/authService';
import { getNavigationRoutes } from '../../router/routesConfig';

export const Header = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleClose();
        AuthService.logout();
    };

    return (
        <AppBar position="sticky" color="default" elevation={1}>
            <Container maxWidth="xl">
                <Toolbar sx={{ py: 1, px: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 0 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: theme.palette.primary.main,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <SchoolIcon sx={{ width: 24, height: 24, color: 'white' }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                                Sistema de Gestión Académica
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 1, pr: 4 }}>
                        {getNavigationRoutes()
                            .filter(route => {
                                if (!route.allowedRoles) return true;
                                return AuthService.hasRole(route.allowedRoles);
                            })
                            .map((route) => {
                                const Icon = route.icon;
                                const isActive = location.pathname === route.path;
                                return (
                                    <Button
                                        key={route.path}
                                        startIcon={Icon && <Icon sx={{ fontSize: 20 }} />}
                                        onClick={() => navigate(route.path)}
                                        color="inherit"
                                        sx={{
                                            borderRadius: 2,
                                            bgcolor: isActive ? theme.palette.primary.main + '15' : 'transparent',
                                            color: isActive ? theme.palette.primary.main : 'inherit',
                                            fontWeight: isActive ? 600 : 400,
                                            '&:hover': {
                                                bgcolor: isActive 
                                                    ? theme.palette.primary.main + '25' 
                                                    : theme.palette.action.hover,
                                            },
                                        }}
                                    >
                                        {route.title}
                                    </Button>
                                );
                            })}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 0 }}>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">{AuthService.getUser()?.nombre || 'Usuario'}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {AuthService.getUser()?.roles?.[0] || 'Sin rol'}
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={handleAvatarClick}
                            size="small"
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette.primary.main + '1A',
                                    color: theme.palette.primary.main,
                                    width: 36,
                                    height: 36,
                                }}
                            >
                                {AuthService.getUser()?.nombre?.[0]?.toUpperCase() || 'U'}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                Cerrar sesión
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}