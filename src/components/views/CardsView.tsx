import { Box, Container, Paper, TablePagination } from "@mui/material";
import type { AlumnoCreditosReport } from "../../types/alumno";
import ReportCard from "../cards/reporCard/ReportCard";

interface CardsViewProps {
    paginatedReports: AlumnoCreditosReport[];
    filteredReports: AlumnoCreditosReport[];
    page: number;
    rowsPerPage: number;
    onCardClick: (report: AlumnoCreditosReport) => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    creditosRequeridos: number;
}

export const CardsView = ({
    paginatedReports,
    filteredReports,
    page,
    rowsPerPage,
    onCardClick,
    onPageChange,
    onRowsPerPageChange,
    creditosRequeridos,
}: CardsViewProps) => {
    return (
        <>
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    px: 3,
                    pt: 2
                }}
            >
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: 2.5,
                            justifyContent: 'center'
                        }}
                    >
                        {paginatedReports.map((report) => (
                            <Box 
                                key={report.alumno.id} 
                                onClick={() => onCardClick(report)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <ReportCard report={report} creditosRequeridos={creditosRequeridos} />
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            <Paper
                elevation={3}
                sx={{
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 10,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)'
                }}
            >
                <TablePagination
                    component="div"
                    count={filteredReports.length}
                    page={page}
                    onPageChange={onPageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={onRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </Paper>
        </>
    );
};

export default CardsView;
