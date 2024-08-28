import { useEffect, useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { getPendingCompanies, verifyCompany } from '@/services/api';
import { Company } from '@/types/types';

const AdministrationPage = () => {
  const [value, setValue] = useState(0);
  const [pendingCompanies, setPendingCompanies] = useState<Company[]>([]); // State for pending companies

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const fetchPendingCompanies = async () => {
    try {
      const companies = await getPendingCompanies();
      setPendingCompanies(companies);
    } catch (error) {
      console.error("Error fetching pending companies", error);
    }
  };

  useEffect(() => {
    fetchPendingCompanies();
  }, []);

  const handleApprove = async (companyId: string) => {
    try {
      await verifyCompany(companyId);
      // Refresh the list of pending companies after successful approval
      fetchPendingCompanies();
    } catch (error) {
      console.error("Error approving company", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4">Administration</Typography>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={value} onChange={handleChange} aria-label="administration tabs">
          <Tab icon={<SettingsIcon />} label="General" />
          <Tab icon={<PeopleIcon />} label="User Administration" />
          <Tab icon={<StoreIcon />} label="Wholesalers / Carriers" />
          <Tab icon={<MonetizationOnIcon />} label="Financing / Fees" />
        </Tabs>
      </Box>
      {value === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            General Administration
          </Typography>
          <TextField
            label="Minimal Approval Limit"
            variant="outlined"
            InputProps={{
              startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>,
            }}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" sx={{ ml: 2 }}>
            Save
          </Button>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Organizations
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Organization Name</TableCell>
                    <TableCell>Owner Name</TableCell>
                    <TableCell>Owner Email</TableCell>
                    <TableCell>Owner Phone</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingCompanies.length > 0 ? (
                    pendingCompanies.map((company) => (
                      <TableRow key={company._id}>
                        <TableCell>{company.companyName}</TableCell>
                        <TableCell>
                          {company.businessOwner[0]?.firstName} {company.businessOwner[0]?.lastName}
                        </TableCell>
                        <TableCell>{company.businessOwner[0]?.email}</TableCell>
                        <TableCell>{company.businessOwner[0]?.mobileNumber}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleApprove(company._id)}
                          >
                            Approve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No pending companies available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default AdministrationPage;
