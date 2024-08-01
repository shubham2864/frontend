import React, { useState } from "react";
import {
  Container,
  Card,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Grid,
  Typography,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Box,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import styles from "../styles/CreatePage.module.css"; // Import the CSS module
import Link from "next/link";
import { fetchCustomerDetails } from "../services/api"; // Adjust import path as necessary

interface Quote {
  quoteNumber: string;
  policyNumber: string;
  carrierCompany: string;
  wholesaler: string;
  coverage: string;
  effectiveDate: string;
  expirationDate: string;
  minDaysToCancel: number;
  minEarnedRate: number;
  premium: number;
  taxes: number;
  otherFees: number;
  brokerFee: number;
  policyFee: number;
  commission: number;
  agencyFees: number;
  file: File | null;
}

const CreatePage = () => {
  const [Add1, setAdd1] = useState({
    email: "",
    firstname: "",
    lastname: "",
    contact: "",
    Address: "",
    city: "",
    state: "",
    Zip: "",
    file: null,
  });

  const [Add2, setAdd2] = useState([
    {
      Buisness: "",
      Address: "",
      Address2: "",
      city: "",
      state: "",
      Zip: "",
    },
  ]);

  const [isAutocompleteComplete, setIsAutocompleteComplete] = useState(false);
  const [customerType, setCustomerType] = useState<string | null>("personal");
  const [emailError, setEmailError] = useState<string>(""); // State to hold error message
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Select or create a customer", "Upload Quote", "Review Quote"];
  const showBusinessForm = customerType === "commercial";
  // const [quotes, setQuotes] = useState<Quote[]>([{ text: "", file: null }]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdd1({
      ...Add1,
      [e.target.name]: e.target.value,
    });
  };

  const addNewBusiness = () => {
    setAdd2([
      ...Add2,
      {
        Buisness: "",
        Address: "",
        Address2: "",
        city: "",
        state: "",
        Zip: "",
      },
    ]);
  };

  const removeBusiness = (index: number) => {
    if (Add2.length > 1) {
      setAdd2(Add2.filter((_, i) => i !== index));
    }
  };

  const handleEmailBlur = async () => {
    try {
      const response = await fetchCustomerDetails(Add1.email);
      if (response) {
        setIsAutocompleteComplete(true);
        setEmailError(""); // Clear error message if email is found
      }
    } catch (error) {
      setIsAutocompleteComplete(false);
      setEmailError("User not found"); // Set error message if email is not found
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !isAutocompleteComplete) {
      // Only move to the next step if the email is found
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [quotes, setQuotes] = useState<Quote[]>([
    {
      quoteNumber: "",
      policyNumber: "",
      carrierCompany: "",
      wholesaler: "",
      coverage: "",
      effectiveDate: "",
      expirationDate: "",
      minDaysToCancel: 0,
      minEarnedRate: 0,
      premium: 0,
      taxes: 0,
      otherFees: 0,
      brokerFee: 0,
      policyFee: 0,
      commission: 0,
      agencyFees: 0,
      file: null,
    },
  ]);

  const handleQuoteChange = (index: any, event: any) => {
    const { name, value } = event.target;
    setQuotes((prevQuotes) => {
      const updatedQuotes = [...prevQuotes];
      updatedQuotes[index] = { ...updatedQuotes[index], [name]: value };
      return updatedQuotes;
    });
  };

  const handleFileChange = (index: any, event: any) => {
    const file = event.target.files[0];
    setQuotes((prevQuotes) => {
      const updatedQuotes = [...prevQuotes];
      updatedQuotes[index] = { ...updatedQuotes[index], file };
      return updatedQuotes;
    });
  };

  const addNewQuote = () => {
    setQuotes([
      ...quotes,
      {
        quoteNumber: "",
        policyNumber: "",
        carrierCompany: "",
        wholesaler: "",
        coverage: "",
        effectiveDate: "",
        expirationDate: "",
        minDaysToCancel: 0,
        minEarnedRate: 0,
        premium: 0,
        taxes: 0,
        otherFees: 0,
        brokerFee: 0,
        policyFee: 0,
        commission: 0,
        agencyFees: 0,
        file: null,
      },
    ]);
  };

  const removeQuote = (index: any) => {
    if (quotes.length > 1) {
      setQuotes((prevQuotes) => prevQuotes.filter((_, i) => i !== index));
    }
  };

  const emptyQuoteTemplate: Quote = {
    quoteNumber: "",
    policyNumber: "",
    carrierCompany: "",
    wholesaler: "",
    coverage: "",
    effectiveDate: "",
    expirationDate: "",
    minDaysToCancel: 0,
    minEarnedRate: 0,
    premium: 0,
    taxes: 0,
    otherFees: 0,
    brokerFee: 0,
    policyFee: 0,
    commission: 0,
    agencyFees: 0,
    file: null,
  };

  const handleResetCustomer = () => {
    setAdd1({
      email: "",
      firstname: "",
      lastname: "",
      contact: "",
      Address: "",
      city: "",
      state: "",
      Zip: "",
      file: null,
    });
    setQuotes([emptyQuoteTemplate]);
    setIsAutocompleteComplete(false);
    setEmailError(""); // Clear error message on reset
  };

  return (
    <Container maxWidth="md" className={styles.container}>
      <Card className={styles.card}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && !isAutocompleteComplete && (
          <div>
            <TextField
              type="email"
              label="Email"
              value={Add1.email}
              onChange={(e) => setAdd1({ ...Add1, email: e.target.value })}
              onBlur={handleEmailBlur}
              placeholder="Enter your email"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            {emailError && (
              <Typography color="error" variant="caption">
                {emailError}
              </Typography>
            )}
          </div>
        )}
        {activeStep === 0 && isAutocompleteComplete && (
          <div className={styles.formSection}>
            <div className={styles.headerSection}>
              <Typography
                variant="h5"
                component="div"
                className={styles.heading2}
              >
                <br />
                <span>Customer</span>
              </Typography>
              <Link
                href="#"
                onClick={handleResetCustomer}
                className={styles.resetLink}
              >
                Reset Customer
              </Link>
            </div>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email"
                value={Add1.email}
                onChange={handleInputChange}
                placeholder="Email"
                fullWidth
                margin="normal"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="firstname"
                  label="First Name"
                  value={Add1.firstname}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="lastname"
                  label="Last Name"
                  value={Add1.lastname}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <TextField
              name="Address"
              label="Address"
              value={Add1.Address}
              onChange={handleInputChange}
              placeholder="Address"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  name="city"
                  label="City"
                  value={Add1.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="state"
                  label="State"
                  value={Add1.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="Zip"
                  label="Zip Code"
                  value={Add1.Zip}
                  onChange={handleInputChange}
                  placeholder="Zip Code"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <TextField
              name="contact"
              label="Contact"
              value={Add1.contact}
              onChange={handleInputChange}
              placeholder="Contact"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <FormControl component="fieldset" margin="normal">
              <RadioGroup
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                row
              >
                <FormControlLabel
                  value="personal"
                  control={<Radio />}
                  label="Personal Customer"
                />
                <FormControlLabel
                  value="commercial"
                  control={<Radio />}
                  label="Commercial Customer"
                />
              </RadioGroup>
            </FormControl>
            {showBusinessForm &&
              Add2.map((business, index) => (
                <div key={index} className={styles.businessForm}>
                  <Typography variant="h6" className={styles.heading3}>
                  <div className={styles.quoteHeader}>
                    Busuiness Form {index + 1}
                    <IconButton
                      onClick={() => removeBusiness(index)}
                      className={styles.deleteButton}
                    >
                      <Delete />
                    </IconButton>
                  </div>
                </Typography>
                  <TextField
                    name="Buisness"
                    label="Business Name"
                    value={business.Buisness}
                    onChange={(e) => {
                      const newBusiness = [...Add2];
                      newBusiness[index].Buisness = e.target.value;
                      setAdd2(newBusiness);
                    }}
                    placeholder="Business Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    name="Address"
                    label="Lane Address"
                    value={business.Address}
                    onChange={(e) => {
                      const newBusiness = [...Add2];
                      newBusiness[index].Address = e.target.value;
                      setAdd2(newBusiness);
                    }}
                    placeholder="Lane Address"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    name="Address2"
                    label="Lane Address2"
                    value={business.Address2}
                    onChange={(e) => {
                      const newBusiness = [...Add2];
                      newBusiness[index].Address2 = e.target.value;
                      setAdd2(newBusiness);
                    }}
                    placeholder="Lane Address2"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        name="city"
                        label="City"
                        value={business.city}
                        onChange={(e) => {
                          const newBusiness = [...Add2];
                          newBusiness[index].city = e.target.value;
                          setAdd2(newBusiness);
                        }}
                        placeholder="City"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        name="state"
                        label="State"
                        value={business.state}
                        onChange={(e) => {
                          const newBusiness = [...Add2];
                          newBusiness[index].state = e.target.value;
                          setAdd2(newBusiness);
                        }}
                        placeholder="State"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        name="Zip"
                        label="Zip Code"
                        value={business.Zip}
                        onChange={(e) => {
                          const newBusiness = [...Add2];
                          newBusiness[index].Zip = e.target.value;
                          setAdd2(newBusiness);
                        }}
                        placeholder="Zip Code"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </div>
              ))}
            {showBusinessForm && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={addNewBusiness}
              >
                Add More
              </Button>
            )}
            <Typography variant="h6" className={styles.heading3} style={{color: "black"}}>  
            <br />
            Would you like to add a contact/deligate?
            </Typography>
            <Typography >
              Person that will act on behalf of the customer or business and be listed as the signee
            </Typography>
            <FormControl component="fieldset" margin="normal">
              <RadioGroup
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                row
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  value="no"
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
          </div>
        )}
        {activeStep === 1 && (
          <div>
            {quotes.map((quote, index) => (
              <Container key={index} className={styles.quoteContainer}>
                <Typography variant="h5" className={styles.heading3}>
                  <div className={styles.quoteHeader}>
                    Quote {index + 1}
                    <IconButton
                      onClick={() => removeQuote(index)}
                      className={styles.deleteButton}
                    >
                      <Delete />
                    </IconButton>
                  </div>
                </Typography>
                <Typography className={styles.heading4}>Documents</Typography>
                <Typography
                  className={styles.heading4}
                  style={{ color: "black" }}
                >
                  Attach quote documents, evidence of insurance, and other
                  documents to your customer's agreement and manage which
                  documents your customer can view.
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                  fullWidth
                  className={styles.uploadButton}
                >
                  Upload File
                  <input
                    type="file"
                    name="file"
                    accept=".pdf"
                    hidden
                    onChange={(e) => handleFileChange(index, e)}
                  />
                  {quote.file && (
                    <Typography variant="body1">: {quote.file.name}</Typography>
                  )}
                </Button>
                {quote.file && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="quoteNumber"
                          label="Quote Number"
                          value={quote.quoteNumber}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="policyNumber"
                          label="Policy Number"
                          value={quote.policyNumber}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="carrierCompany"
                          label="Carrier Company"
                          value={quote.carrierCompany}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="wholesaler"
                          label="Wholesaler"
                          value={quote.wholesaler}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      name="coverage"
                      label="Coverage"
                      value={quote.coverage}
                      onChange={(e) => handleQuoteChange(index, e)}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="effectiveDate"
                          label="Effective Date"
                          type="date"
                          value={quote.effectiveDate}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="expirationDate"
                          label="Expiration Date"
                          type="date"
                          value={quote.expirationDate}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Typography className={styles.heading4}>
                      Provided by carrier
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="minDaysToCancel"
                          label="Minimum Days to Cancel"
                          type="number"
                          value={quote.minDaysToCancel}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="minEarnedRate"
                          label="Minimum Earned Rate"
                          type="number"
                          value={quote.minEarnedRate}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    <Typography className={styles.heading4}>
                      Financeable
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="premium"
                          label="Premium"
                          type="number"
                          value={quote.premium}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="taxes"
                          label="Taxes"
                          type="number"
                          value={quote.taxes}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    <Typography className={styles.heading4}>
                      Non Financeable
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          name="otherFees"
                          label="Other Fees"
                          type="number"
                          value={quote.otherFees}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          name="brokerFee"
                          label="Broker Fee"
                          type="number"
                          value={quote.brokerFee}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          name="policyFee"
                          label="Policy Fee"
                          type="number"
                          value={quote.policyFee}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    <Typography className={styles.heading4}>
                      Payment distribution
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="commission"
                          label="Commission"
                          type="number"
                          value={quote.commission}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="agencyFees"
                          label="Agency Fees"
                          type="number"
                          value={quote.agencyFees}
                          onChange={(e) => handleQuoteChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </Container>
            ))}
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={addNewQuote}
              startIcon={<Add />}
            >
              Add Quotes
            </Button>
          </div>
        )}
        {activeStep === 2 && (
          <div>
            {/* Step 3 content */}
            <Typography variant="h6">Step 3: Review and Submit</Typography>
            {/* Add your form fields for Step 3 here */}
          </div>
        )}
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button
            onClick={handleNext}
            // Disable if step is not complete
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default CreatePage;
