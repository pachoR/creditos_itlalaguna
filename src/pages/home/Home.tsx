import { useEffect, useState, useCallback } from "react";
import AlumnosService from "../../services/alumnosService";
import ConfiguracionService from "../../services/configuracionService";
import type { AlumnoCreditosReport } from "../../types/alumno";
import { Box, Typography, Container, TextField, InputAdornment, Switch, FormControlLabel } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useReportsPagination } from "../../hooks/useReportsPagination";
import AlumnoReportDialog from "../../components/dialogs/AlumnoReportDialog";
import { CardsView, TableView } from "../../components/views";

export const Home = () => {
    const [reports, setReports] = useState<AlumnoCreditosReport[]>([]);
    const [selectedReport, setSelectedReport] = useState<AlumnoCreditosReport | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isTableView, setIsTableView] = useState(false);
    const [creditosRequeridos, setCreditosRequeridos] = useState<number>(6);

    const {
        page,
        rowsPerPage,
        searchQuery,
        filteredReports,
        paginatedReports,
        handleChangePage,
        handleChangeRowsPerPage,
        handleSearchChange,
    } = useReportsPagination({ reports });

    const fetchReport = async () => {
        try {
            const reports = await AlumnosService.getAlumnosCreditosReport();
            setReports(reports);
        } catch (error) {
            console.error('Error fetching report:', error);
        }
    }

    const fetchCreditosRequeridos = async () => {
        try {
            const config = await ConfiguracionService.getByNombre('creditos_a_completar');
            const creditos = parseInt(config.config_valor, 10);
            if (!isNaN(creditos) && creditos > 0) {
                setCreditosRequeridos(creditos);
            }
        } catch (error) {
            console.error('Error fetching creditos_a_completar:', error);
            // Si hay error, mantener el valor por defecto de 6
        }
    }

    const getData = async () => {
        await Promise.all([
            fetchReport(),
            fetchCreditosRequeridos()
        ]);
    };

    useEffect(() => {
        getData();
    }, []);

    const handleCardClick = useCallback((report: AlumnoCreditosReport) => {
        setSelectedReport(report);
        setDialogOpen(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
        setSelectedReport(null);
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 200px)',
                overflow: 'hidden'
            }}
        >
            <Container maxWidth="xl" sx={{ pt: 4, pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1">
                        Créditos ITL
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isTableView}
                                    onChange={(e) => setIsTableView(e.target.checked)}
                                />
                            }
                            label={"Vista Tabla"}
                        />
                        <TextField
                            placeholder="Buscar alumno..."
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            sx={{ width: '300px' }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Box>
            </Container>

            {!isTableView ? (
                <CardsView
                    paginatedReports={paginatedReports}
                    filteredReports={filteredReports}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onCardClick={handleCardClick}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    creditosRequeridos={creditosRequeridos}
                />
            ) : (
                <TableView
                    filteredReports={filteredReports}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onRowClick={handleCardClick}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}

            <AlumnoReportDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                report={selectedReport}
            />
        </Box>
    )
}

export default Home