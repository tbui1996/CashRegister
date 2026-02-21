import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useRecoilState } from 'recoil';
import {
  amountOwedState,
  amountPaidState,
  changeResultState,
  loadingState,
  errorState,
} from '../state/atoms';
import { ChangeResponse } from '../types';
import useCalculateChange from '../api/mutations/useCalculateChange';
/**
 * ChangeCalculatorForm Component
 * Handles user input for amount owed and amount paid.
 * Single responsibility: Form input and change calculation.
 */
const ChangeCalculatorForm: React.FC = () => {
  const [amountOwed, setAmountOwed] = useRecoilState(amountOwedState);
  const [amountPaid, setAmountPaid] = useRecoilState(amountPaidState);
  const [changeResult, setChangeResult] = useRecoilState(changeResultState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [error, setError] = useRecoilState(errorState);

  // Dropdown state
  const [divisor, setDivisor] = useState(3);
  const [country, setCountry] = useState('US');
  const [specialCase, setSpecialCase] = useState('None');

  // Feature flag: show country/specialCase dropdowns if ?flag=true
  const [showFlag, setShowFlag] = useState(false);
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setShowFlag(params.get('flag') === 'true');
  }, []);

  const calculateMutation = useCalculateChange();

  // Fetch config on mount (optional)
  React.useEffect(() => {
    fetch('http://localhost:8080/api/config')
      .then(res => res.json())
      .then(cfg => {
        setDivisor(cfg.randomDivisor || 3);
        setCountry(cfg.country || 'US');
        setSpecialCase(cfg.specialCases?.[0] || 'None');
      });
  }, []);

  const handleConfigChange = async () => {
    await fetch('http://localhost:8080/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        randomDivisor: divisor,
        country,
        specialCases: specialCase === 'None' ? [] : [specialCase],
      }),
    });
  };

  const handleCalculate = async () => {
    setError(null);
    setChangeResult(null);

    const owed = parseFloat(amountOwed);
    const paid = parseFloat(amountPaid);

    if (isNaN(owed) || isNaN(paid)) {
      setError('Please enter valid numbers');
      return;
    }
    if (paid < owed) {
      setError('Amount paid must be greater than or equal to amount owed');
      return;
    }

    setLoading(true);
    try {
      await handleConfigChange(); // Update backend config before calculation
      const result = await calculateMutation.mutateAsync({
        amountOwed: owed,
        amountPaid: paid,
      });
      setChangeResult(result as ChangeResponse);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to calculate change';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setAmountOwed('');
    setAmountPaid('');
    setChangeResult(null);
    setError(null);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Cash Register Calculator
        </Typography>

        <Box sx={{ mt: 3, mb: 3 }}>
          <TextField
            fullWidth
            label="Amount Owed"
            type="number"
            value={amountOwed}
            onChange={(e) => setAmountOwed(e.target.value)}
            inputProps={{ step: '0.01', min: '0' }}
            margin="normal"
            placeholder="e.g., 2.13"
          />

          <TextField
            fullWidth
            label="Amount Paid"
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            inputProps={{ step: '0.01', min: '0' }}
            margin="normal"
            placeholder="e.g., 3.00"
          />

          {/* Dropdowns for config */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Random Divisor</Typography>
            <select value={divisor} onChange={e => setDivisor(Number(e.target.value))} style={{ width: '100%', padding: '8px', marginBottom: '8px' }}>
              {[3, 5, 7, 10].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>

            {showFlag && (
              <>
                <Typography variant="subtitle1">Country</Typography>
                <select value={country} onChange={e => setCountry(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '8px' }}>
                  {['US', 'FR', 'CA', 'UK'].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>

                <Typography variant="subtitle1">Special Case</Typography>
                <select value={specialCase} onChange={e => setSpecialCase(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '8px' }}>
                  {['None', 'Twist', 'Bonus', 'Holiday'].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </>
            )}
          </Box>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleCalculate}
            disabled={loading}
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Calculate Change'}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={handleClear}
            disabled={loading}
            size="large"
          >
            Clear
          </Button>
        </Box>

        {changeResult && (
          <Card sx={{ mt: 4, bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Change Due
              </Typography>

              <Typography variant="h5" color="success.main" sx={{ mb: 2 }}>
                ${changeResult.change.toFixed(2)}
              </Typography>

              <Typography variant="body2" color="textSecondary" gutterBottom>
                Denominations:
              </Typography>

              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                {changeResult.formattedChange || 'No change required'}
              </Typography>

              <Grid container spacing={2}>
                {Object.entries(changeResult.denominations).map(([name, count]) => (
                  <Grid item xs={6} key={name}>
                    <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Typography>
                      <Typography variant="h6">{count}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
};

export default ChangeCalculatorForm;
