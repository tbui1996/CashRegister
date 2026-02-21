import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { ChangeResponse } from '../../api/types';

interface BatchResultsTableProps {
  results: ChangeResponse[];
  onClear: () => void;
}

const BatchResultsTable: React.FC<BatchResultsTableProps> = ({ results, onClear }) => (
  <>
    <TableContainer sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f5f5f5' }}>
            <TableCell>Amount Owed</TableCell>
            <TableCell>Amount Paid</TableCell>
            <TableCell>Change</TableCell>
            <TableCell>Denominations</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result: ChangeResponse, index: number) => (
            <TableRow key={index}>
              <TableCell>${result.amountOwed.toFixed(2)}</TableCell>
              <TableCell>${result.amountPaid.toFixed(2)}</TableCell>
              <TableCell>${result.change.toFixed(2)}</TableCell>
              <TableCell>{result.formattedChange || 'No change'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Button
      variant="outlined"
      color="secondary"
      onClick={onClear}
      sx={{ mt: 2 }}
    >
      Clear Results
    </Button>
  </>
);

export default BatchResultsTable;
