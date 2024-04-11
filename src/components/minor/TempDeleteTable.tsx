import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function TempDeleteTable({ show, results }: { show: boolean; results: any }) {
  if (!show) {
    return <></>;
  }
  return (
    <TableContainer component={Paper} elevation={6}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">monthly_interval</TableCell>
            <TableCell align="right">billed_cost</TableCell>
            <TableCell align="right">monthly_cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((row: any) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.description}</TableCell>
              {row?.monthly_interval ? <TableCell align="right">{row.monthly_interval}</TableCell> : null}
              {row?.billed_cost ? <TableCell align="right">{row.billed_cost}</TableCell> : null}
              {row?.monthly_cost ? <TableCell align="right">{row.monthly_cost}</TableCell> : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
