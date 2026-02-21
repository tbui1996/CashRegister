import React, { useRef } from 'react';
import {
  Container,
  Paper,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRecoilState } from 'recoil';
import { loadingState, errorState, batchResultsState } from '../state/atoms';
import { ChangeResponse } from '../types/index';
import useUploadFile from '../api/mutations/useUploadFile';
/**
 * FileUploadComponent
 * Handles CSV file uploads for batch change calculations.
 * Single responsibility: File upload and batch processing.
 */
const FileUploadComponent: React.FC = () => {
  const [loading, setLoading] = useRecoilState(loadingState);
  const [error, setError] = useRecoilState(errorState);
  const [batchResults, setBatchResults] = useRecoilState(batchResultsState);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadFile();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('Please upload a valid CSV file');
      return;
    }

    setError(null);
    setBatchResults([]);
    setLoading(true);

    try {
      const results = await uploadMutation.mutateAsync(file);
      setBatchResults(results as ChangeResponse[]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to process file';
      setError(errorMessage);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearResults = () => {
    setBatchResults([]);
    setError(null);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Batch File Upload
        </Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Upload a CSV file with rows in the format: amountOwed,amountPaid
        </Typography>

        <Box sx={{ mb: 3 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Upload CSV File'}
          </Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {batchResults.length > 0 && (
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
                  {batchResults.map((result: ChangeResponse, index: number) => (
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
              onClick={handleClearResults}
              sx={{ mt: 2 }}
            >
              Clear Results
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default FileUploadComponent;
