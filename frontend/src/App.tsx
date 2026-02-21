import React from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
  Chip,
} from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ChangeCalculatorForm from './components/mainCard/ChangeCalculatorForm';
import FileUploadComponent from './components/fileUpload/FileUploadComponent';
import { theme } from './theme/theme';
import useHealthCheck from './api/queries/useHealthCheck';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000 // refresh data if unused for ten or more seconds
    }
  }
});
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * AppHeader Component
 * Displays application header with health status.
 * Single responsibility: Header display and health indicator.
 */
const AppHeader: React.FC = () => {
  const { data: isHealthy } = useHealthCheck();

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          Cash Register Application
        </Typography>
        <Chip
          label={isHealthy ? 'Backend Connected' : 'Backend Offline'}
          color={isHealthy ? 'success' : 'error'}
          variant="outlined"
        />
      </Box>
    </Paper>
  );
};

/**
 * App Component
 * Main application container that combines calculator and file upload features.
 * Single responsibility: Application layout and tab management.
 */
const App: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <AppHeader />

            <Paper elevation={2} sx={{ mb: 4 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="application tabs"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Single Calculation" id="tab-0" aria-controls="tabpanel-0" />
                <Tab label="Batch Upload" id="tab-1" aria-controls="tabpanel-1" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <ChangeCalculatorForm />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <FileUploadComponent />
              </TabPanel>
            </Paper>

            <Alert severity="info" sx={{ mt: 4 }}>
              <Typography variant="body2">
                <strong>How it works:</strong> Enter the amount owed and amount paid to
                calculate change. If the change amount (in cents) is divisible by 3, the
                denominations will be randomized for variety!
              </Typography>
            </Alert>
          </Container>
        </ThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default App;
