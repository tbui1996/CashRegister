import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { ChangeResponse } from '../../api/types';

interface ChangeResultCardProps {
  result: ChangeResponse;
}

const ChangeResultCard: React.FC<ChangeResultCardProps> = ({ result }) => (
  <Card sx={{ mt: 4, bgcolor: '#f5f5f5' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Change Due
      </Typography>
      <Typography variant="h5" color="success.main" sx={{ mb: 2 }}>
        ${result.change.toFixed(2)}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Denominations:
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
        {result.formattedChange || 'No change required'}
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(result.denominations).map(([name, count]) => (
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
);

export default ChangeResultCard;
