import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Divider,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LinkIcon from '@mui/icons-material/Link';

const AgreementPage = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event:any, newValue:any) => {
    setTabIndex(newValue);
  };

  return (
    <div
      style={{
        width: "80%",
        margin: "auto",
        padding: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          width: "80%",
          margin: "auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            <IconButton sx={{ alignSelf: "flex-start" }}>
              <ArrowBackIcon />
            </IconButton>
            Shubham Jain
            <Chip
              label="Payment Due"
              color="primary"
              sx={{ bgcolor: "#cce7ff", marginLeft: "10px" }}
            />
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            marginLeft: "40px",
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Dashboard
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography variant="body2" color="textSecondary">
            Agreement
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          width: "80%",
          margin: "auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "8px",
          mt: 1, 
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#e6fcf5",
            padding: 2,
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <EmailIcon fontSize="small" />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body2">
                Email payment link to Shubham Jain
              </Typography>
              <Typography variant="body2" color="textSecondary">
                shubhamjain0176@gmail.com
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Tooltip title="Copy Link">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#ccfbf1",
                  padding: "4px 8px",
                  borderRadius: 1,
                  cursor: "pointer",
                }}
              >
                <Typography variant="body2" color="primary">
                  https://sandbox.app.link-finance.co
                </Typography>
                <IconButton size="small">
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip>
            <Button variant="contained" color="success">
              Send Email
            </Button>
          </Box>
        </Box>

        <Box sx={{ marginBottom: 1, marginLeft: "35px" }}>
          <Typography variant="subtitle2" color="textSecondary">
            Gross premium
          </Typography>
          <Typography variant="h6" sx={{ marginTop: 0.5 }}>
            $5,041.00
          </Typography>
        </Box>
      </Box>

      {/* Cards Section */}
      <Grid container spacing={2} sx={{ mt: 2, width: "80%", margin: "auto" }}>
        <Grid item xs={12} md={8}>
          {/* Financed Details Card */}
          <Card
            sx={{
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              padding: 2,
            }}
          >
            <CardContent>
              <Typography variant="body1" color="textPrimary">
                Financed
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Available Until Sep 05, 2024
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Date: Sep 05, 2024, 06:40 PM
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total: $5,215.10
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Down payment: $2,539.00
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  APR: 14.9% ($174.10)
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Agreement duration: 10 monthly installments • $267.61/ea
                  starting Sep 05, 2024
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Service Fees: $16.9
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Card transaction fees: $89.16
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  Generate Agreement PDF
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  Generate Loan Agreement PDF
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Card: Related Details */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              padding: 2,
            }}
          >
            <CardContent>
              <Typography variant="body1" color="textPrimary">
                Related Details
              </Typography>

              {/* Tabs for Contact, Customer, Owner */}
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                aria-label="Contact Details Tabs"
                textColor="primary"
                indicatorColor="primary"
                variant="fullWidth"
                sx={{ mt: 2 }}
              >
                <Tab label="Contact" />
                <Tab label="Customer" />
                <Tab label="Owner" />
              </Tabs>

              {/* Tab Content */}
              <Box sx={{ mt: 2 }}>
                {tabIndex === 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      Shubham Jain
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      shubhamjain0176@gmail.com
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      +1 (545) 454-5452
                    </Typography>
                    <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                      Edit Contact Details
                    </Button>
                  </Box>
                )}
                {tabIndex === 1 && (
                  <Box>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      Customer Details
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Name: Shubham Jain
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Plan: Premium Plan
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Joined: Jan 15, 2023
                    </Typography>
                  </Box>
                )}
                {tabIndex === 2 && (
                  <Box>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      Owner Details
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Name: Shubham Jain
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Business: Tech Innovations LLC
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AgreementPage;
