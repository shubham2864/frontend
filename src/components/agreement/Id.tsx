import React, { useEffect, useState } from "react";
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
import LinkIcon from "@mui/icons-material/Link";
import styles from "../../styles/Agreement.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import { AgreementDetails } from "@/types/types";
import { fetchAgreementData, sendTemplateEmail } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { generatePDF } from "@/utils/pdfUtils";

const AgreementPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();
  const { id } = router.query; // Get the ID from the route
  const [agreementDetails, setAgreementDetails] =
    useState<AgreementDetails | null>(null);
  const [transactionTab, setTransactionTab] = useState(0);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event: any, newValue: any) => {
    setTabIndex(newValue);
  };

  const handleTransactionTab = (event: any, newValue: any) => {
    setTransactionTab(newValue);
  };

  const handleGenerateAgreementPDF = async () => {
    setLoading(true);
    try {
      const userId = '66db181ec843ede380c890e7'; // Example userId
      const userData = await fetchAgreementData(userId); // Fetch data from backend

      // Generate the PDF
      await generatePDF(userData);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      // Fetch the agreement details from the backend
      console.log(id);
      axios
        .get(`http://localhost:3001/agreement/id/${id}`)
        .then((response) => {
          setAgreementDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching agreement details", error);
        });
    }
    console.log(agreementDetails);
  }, [id]);

  if (!agreementDetails) return <div>Loading...</div>;

  return (
    <div
      style={{
        width: "80%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          width: "80%",
          margin: "auto",
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
              <ArrowBackIcon onClick={() => router.push("/dashboard")} />
            </IconButton>
            {agreementDetails?.Add1.firstName || "Loading..."}{" "}
            {agreementDetails?.Add1.lastName}
            <Chip
              label="Payment Due"
              color="primary"
              sx={{ bgcolor: "#cce7ff", marginLeft: "10px", color: "blue" }}
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
                Email payment link to{" "}
                {agreementDetails?.Add1.firstName || "Loading..."}{" "}
                {agreementDetails?.Add1.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {agreementDetails!.Add1.email}
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
            <Button
              variant="contained"
              color="success"
              onClick={() => sendTemplateEmail(id)}
            >
              Send Email
            </Button>
          </Box>
        </Box>

        <Box sx={{ marginBottom: 1, marginLeft: "35px" }}>
          <Typography variant="subtitle2" color="textSecondary">
            Gross premium
          </Typography>
          <Typography variant="h6" sx={{ marginTop: 0.5 }}>
            ${agreementDetails.quotes[0].totalCost}
          </Typography>
        </Box>
      </Box>

      {/* Cards Section */}
      <Grid container spacing={2} sx={{ mt: 0, width: "80%", margin: "auto" }}>
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
              <Typography
                variant="body1"
                color="textPrimary"
                sx={{ fontWeight: "bold", display: "flex" }}
              >
                Financed
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    bgcolor: "#ccfbf1",
                    borderRadius: 1,
                    cursor: "pointer",
                    marginLeft: "5px",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginTop: "2px" }}
                  >
                    Available Until Sep 05, 2024
                  </Typography>
                </Box>
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
                  onClick={handleGenerateAgreementPDF}
                >
                  {loading
                    ? "Generating Agreement PDF..."
                    : "Generate Agreement PDF"}
                </Typography>

                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  Generate Loan Agreement PDF
                </Typography>
              </Box>

              <hr style={{ borderTop: "1px #ccc", marginTop: "10px" }} />
              <Typography
                variant="body1"
                color="textPrimary"
                sx={{ fontWeight: "bold", display: "flex" }}
              >
                Pay In-Full
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Card transaction fees : $176.73
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ACH transaction fees : $0.00
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
              height: "370px",
            }}
          >
            <CardContent>
              <Typography
                variant="body1"
                color="textPrimary"
                sx={{ fontWeight: "bold" }}
              >
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
                      {agreementDetails?.Add1.firstName || "Loading..."}{" "}
                      {agreementDetails?.Add1.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {agreementDetails.Add1.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      {agreementDetails.Add1.contact}
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

      <Card
        sx={{
          width: "77%",
          margin: "auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "8px",
          mt: 1,
          marginTop: "30px",
        }}
      >
        <CardContent sx={{ padding: 0 }}>
          <Typography variant="h6" sx={{ padding: 2 }}>
            Transactions
          </Typography>
          <Tabs
            value={transactionTab}
            onChange={handleTransactionTab}
            indicatorColor="primary"
            textColor="primary"
            sx={{ padding: "0 16px" }}
          >
            <Tab label="Customer" />
            <Tab label="Insurance" />
            <Tab label="Carrier/ Wholesaler" />
          </Tabs>
          <Divider />
          <Box sx={{ overflowX: "auto", padding: 2 }}>
            <table className={styles.transactionTable}>
              {transactionTab === 0 && (
                <>
                  <thead>
                    <tr>
                      <th>TRANSACTION</th>
                      <th>PAYMENT</th>
                      <th>STATUS</th>
                      <th>DUE ON</th>
                      <th>PROCESSED ON</th>
                      <th>PAID ON</th>
                      <th>PAYMENT METHOD</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </>
              )}
              {transactionTab === 1 && (
                <>
                  <thead>
                    <tr>
                      <th>TRANSACTION</th>
                      <th>AMOUNT RECEIVED</th>
                      <th>STATUS</th>
                      <th>SENT ON</th>
                      <th>CLEARED ON</th>
                      <th>PAID ON</th>
                      <th>ACCOUNT</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </>
              )}
              {transactionTab === 2 && (
                <>
                  <thead>
                    <tr>
                      <th>TRANSACTION</th>
                      <th>AMOUNT RECEIVED</th>
                      <th>STATUS</th>
                      <th>SENT ON</th>
                      <th>CLEARED ON</th>
                      <th>ACCOUNT</th>
                    </tr>
                  </thead>
                  <tbody style={{ margin: "auto", padding: "20px" }}>
                    No Data Found
                  </tbody>
                </>
              )}
            </table>
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{
          width: "77%",
          margin: "auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "8px",
          mt: 0,
          marginTop: "30px",
        }}
      >
        <CardContent sx={{ padding: 0 }}>
          <Typography variant="h6" sx={{ padding: 2 }}>
            Policies
          </Typography>
          <Box sx={{ overflowX: "auto", padding: 2 }}>
            <table className={styles.policies}>
              <thead>
                <tr>
                  <th>TRANSACTION</th>
                  <th>AMOUNT RECEIVED</th>
                  <th>STATUS</th>
                  <th>SENT ON</th>
                  <th>CLEARED ON</th>
                  <th>ACCOUNT</th>
                </tr>
              </thead>
              <hr style={{ borderTop: "1px #ccc", marginTop: "0px" }} />
              <tbody style={{ margin: "auto", padding: "20px" }}>
                No Data Found
              </tbody>
              <hr style={{ borderTop: "1px #ccc", marginTop: "10px" }} />
            </table>
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{
          width: "77%",
          margin: "auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "8px",
          mt: 0,
          marginBottom: "30px",
          marginTop: "30px",
        }}
      >
        <CardContent sx={{ padding: 0 }}>
          <Typography variant="h6" sx={{ padding: 2 }}>
            Communication
          </Typography>
          <Typography
            variant="h6"
            sx={{ padding: 2, alignContent: "center", textAlign: "center" }}
          >
            No communication has been sent yet
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgreementPage;
