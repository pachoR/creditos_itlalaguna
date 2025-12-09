import { Card, CardContent, Box, Typography, CircularProgress } from "@mui/material";
import type { AlumnoCreditosReport } from "../../../types/alumno";

interface ReportCardProps {
    report: AlumnoCreditosReport;
    creditosRequeridos?: number;
}

export const ReportCard = ({ report, creditosRequeridos = 6 }: ReportCardProps) => {
    const porcentaje = Math.min((report.totalCreditos / creditosRequeridos) * 100, 100);
    const creditosCompletos = report.totalCreditos >= creditosRequeridos;

    return (
        <Card
            sx={{
                width: 280,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                },
                border: creditosCompletos ? '2px solid #4caf50' : '1px solid rgba(0, 0, 0, 0.12)',
                position: 'relative',
                overflow: 'visible'
            }}
        >
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, gap: 2 }}>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body1" sx={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.3, textAlign: 'center' }}>
                        {report.alumno.nombres}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.3, textAlign: 'center' }}>
                        {report.alumno.apellidos}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mt: 0.5, textAlign: 'center' }}>
                        {report.alumno.nctrl}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                            variant="determinate"
                            value={100}
                            size={70}
                            thickness={4}
                            sx={{ color: 'rgba(0, 0, 0, 0.1)' }}
                        />
                        <CircularProgress
                            variant="determinate"
                            value={porcentaje}
                            size={70}
                            thickness={4}
                            sx={{
                                color: creditosCompletos ? '#4caf50' : '#ff9800',
                                position: 'absolute',
                                left: 0
                            }}
                        />
                        <Box
                            sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                                {report.totalCreditos}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                                de {creditosRequeridos}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default ReportCard;