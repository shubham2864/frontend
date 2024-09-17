import React, { useState } from "react";
import {
  Container,
  Card,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Grid,
  Typography,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Box,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
  Divider,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import styles from "../styles/CreatePage.module.css"; // Import the CSS module
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getAgreementByEmail } from "@/services/api";
import { Quote } from "@/types/types";

const CreatePage = () => {
  const [Add1, setAdd1] = useState({
    email: "",
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState<string>("");
  const currentDate = new Date();
  const effectiveDateDefault = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  const expirationDateDefault = new Date(
    currentDate.setFullYear(currentDate.getFullYear() + 1)
  )
    .toISOString()
    .split("T")[0]; // Format: YYYY-MM-DD
  const [Add2, setAdd2] = useState([
    {
      BuisnessName: "",
      Address: "",
      Address2: "",
      city: "",
      state: "",
      Zip: "",
    },
  ]);
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      quoteNumber: "",
      policyNumber: "",
      carrierCompany: "",
      wholesaler: "",
      coverage: "",
      effectiveDate: effectiveDateDefault,
      expirationDate: expirationDateDefault,
      minDaysToCancel: 10,
      minEarnedRate: 0,
      premium: 0,
      taxes: 0,
      otherFees: 0,
      brokerFee: 0,
      policyFee: 0,
      commission: 0,
      agencyFees: 0,
      file: null,
      totalCost: 0,
    },
  ]);

  const [isAutocompleteComplete, setIsAutocompleteComplete] = useState(false);
  const [customerType, setCustomerType] = useState<string | null>("personal");
  const [emailError, setEmailError] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Select or create a customer", "Upload Quote", "Review Quote"];
  const showBusinessForm = customerType === "commercial";
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState({
    Add1: {
      email: "",
      firstName: "",
      lastName: "",
      contact: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
    Add2:
      Add2.length > 0
        ? Add2.map(() => ({
            BuisnessName: "",
            Address: "",
            Address2: "",
            city: "",
            state: "",
            Zip: "",
          }))
        : [],
  });

  const [quotesErrors, setQuotesErrors] = useState<{ quotes: any[] }>({
    quotes: quotes.map(() => ({
      quoteNumber: "",
      policyNumber: "",
      carrierCompany: "",
      wholesaler: "",
      coverage: "",
      effectiveDate: "",
      expirationDate: "",
      minDaysToCancel: "",
      minEarnedRate: "",
      premium: "",
      taxes: "",
      otherFees: "",
      brokerFee: "",
      policyFee: "",
      commission: "",
      agencyFees: "",
      file: "",
      totalCost: "",
    })),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdd1({
      ...Add1,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactChange = (value: string) => {
    setAdd1({
      ...Add1,
      contact: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setAdd1({
      ...Add1,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const addNewBusiness = () => {
    setAdd2([
      ...Add2,
      {
        BuisnessName: "",
        Address: "",
        Address2: "",
        city: "",
        state: "",
        Zip: "",
      },
    ]);

    setErrors((prevErrors) => {
      const currentErrors = prevErrors || { Add1: {}, Add2: [] };

      return {
        ...currentErrors,
        Add2: [
          ...(currentErrors.Add2 || []),
          {
            BuisnessName: "",
            Address: "",
            Address2: "",
            city: "",
            state: "",
            Zip: "",
          },
        ],
      };
    });
  };

  const removeBusiness = (index: number) => {
    if (Add2.length > 1) {
      setAdd2(Add2.filter((_, i) => i !== index));
    }
  };

  const handleEmailBlur = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email field is empty
    if (!Add1.email) {
      setEmailError("Email is required");
      setIsAutocompleteComplete(false);
      return;
    }

    // Check if the email entered is valid
    if (!emailRegex.test(Add1.email)) {
      setEmailError("Please enter a valid email address");
      setIsAutocompleteComplete(false);
      return;
    }

    try {
      // If the email is valid, call the backend to check if email exists
      const response = await getAgreementByEmail(Add1.email);
      if (response) {
        // Set the data (response data) if the email exists
        console.log(response);
        setAdd1(response.Add1);
        if (response.Add2) {
          setCustomerType("commercial");
          setAdd2(response.Add2 || []);
        }
        setEmailError(""); // Clear error if found
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        console.log("no data found");
        setEmailError("No record found for this email");
      }
    } catch (error: any) {
      console.error("Error fetching email data", error);
      if (error.response?.status === 404) {
        setEmailError("No record found for this email");
      } else if (error.response?.status === 400) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("An error occurred while checking the email");
      }
    }

    // If the email is valid, clear the error and set autocomplete as complete
    setEmailError("");
    setIsAutocompleteComplete(true);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleQuoteChange = (index: any, event: any) => {
    const { name, value } = event.target;

    setQuotes((prevQuotes) => {
      const updatedQuotes = [...prevQuotes];
      let newValue;

      // Handle numeric fields
      switch (name) {
        case "minDaysToCancel":
        case "minEarnedRate":
        case "premium":
        case "taxes":
        case "otherFees":
        case "brokerFee":
        case "policyFee":
        case "commission":
        case "agencyFees":
          newValue = Number(value);
          break;
        default:
          newValue = value;
      }

      // If the effectiveDate is updated, calculate and set expirationDate
      if (name === "effectiveDate") {
        const effectiveDate = new Date(value); // Parse the effective date
        const expirationDate = new Date(effectiveDate); // Copy the effective date
        expirationDate.setFullYear(effectiveDate.getFullYear() + 1); // Set expiration date to 1 year later

        updatedQuotes[index] = {
          ...updatedQuotes[index],
          [name]: newValue, // Set the new effectiveDate
          expirationDate: expirationDate.toISOString().split("T")[0], // Set expirationDate to one year after
        };
      } else {
        updatedQuotes[index] = { ...updatedQuotes[index], [name]: newValue };
      }

      return updatedQuotes;
    });

    console.log(quotes);
  };

  // Handle quote field change
  // const handleQuoteChange = (index: any, e: any) => {
  //   const { name, value } = e.target;
  //   const updatedQuotes = [...quotes];
  //   updatedQuotes[index] = { ...updatedQuotes[index], [name]: value };

  //   // If effectiveDate changes, update expirationDate to one year after
  //   if (name === "effectiveDate") {
  //     const effectiveDate = new Date(value);
  //     const expirationDate = new Date(effectiveDate);
  //     expirationDate.setFullYear(effectiveDate.getFullYear() + 1);
  //     updatedQuotes[index].expirationDate = expirationDate
  //       .toISOString()
  //       .split("T")[0];
  //   }

  //   setQuotes(updatedQuotes);
  // };

  const handleFileChange = (
    index: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
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
        effectiveDate: effectiveDateDefault,
        expirationDate: expirationDateDefault,
        minDaysToCancel: 10,
        minEarnedRate: 0,
        premium: 0,
        taxes: 0,
        otherFees: 0,
        brokerFee: 0,
        policyFee: 0,
        commission: 0,
        agencyFees: 0,
        file: null,
        totalCost: 0,
      },
    ]);
    // Add corresponding errors for the new quote
    setQuotesErrors({
      quotes: [
        ...quotesErrors.quotes,
        {
          quoteNumber: "",
          policyNumber: "",
          carrierCompany: "",
          wholesaler: "",
          coverage: "",
          effectiveDate: "",
          expirationDate: "",
          minDaysToCancel: "",
          minEarnedRate: "",
          premium: "",
          taxes: "",
          otherFees: "",
          brokerFee: "",
          policyFee: "",
          commission: "",
          agencyFees: "",
          file: "",
          totalCost: "",
        },
      ],
    });
  };

  const isStepComplete = (step: number) => {
    let hasError = false;
    const newErrors = {
      Add1: { ...errors.Add1 },
      Add2:
        errors.Add2.length > 0
          ? errors.Add2.map((error) => ({ ...error }))
          : [],
      quotes: quotes.map(() => ({
        quoteNumber: "",
        policyNumber: "",
        carrierCompany: "",
        wholesaler: "",
        coverage: "",
        effectiveDate: "",
        expirationDate: "",
        minDaysToCancel: "",
        minEarnedRate: "",
        premium: "",
        taxes: "",
        otherFees: "",
        brokerFee: "",
        policyFee: "",
        commission: "",
        agencyFees: "",
        file: "",
        totalCost: "",
      })),
    };

    console.log(newErrors);
    // Validate Add1 including the "state" dropdown
    if (step === 0) {
      Object.keys(Add1).forEach((key) => {
        if (!Add1[key as keyof typeof Add1]) {
          newErrors.Add1[key as keyof typeof Add1] = `${key} is required`;
          hasError = true;
        } else {
          newErrors.Add1[key as keyof typeof Add1] = "";
        }
      });

      // Specific validation for the "state" field (dropdown)
      if (!Add1.state) {
        newErrors.Add1.state = "State is required";
        hasError = true;
      } else {
        newErrors.Add1.state = "";
      }

      if (!Add1.contact || Add1.contact.length < 10) {
        newErrors.Add1.contact = "Valid contact number is required";
        hasError = true;
      } else {
        newErrors.Add1.contact = "";
      }
    }

    // Validate Add2 for "commercial" customer type
    if (customerType === "commercial") {
      Add2.forEach((business, index) => {
        // Ensure Add2[index] exists in newErrors
        if (!newErrors.Add2[index]) {
          newErrors.Add2[index] = {
            BuisnessName: "",
            Address: "",
            Address2: "",
            city: "",
            state: "",
            Zip: "",
          };
        }

        Object.keys(business).forEach((key) => {
          if (!business[key as keyof typeof business]) {
            newErrors.Add2[index][
              key as keyof typeof business
            ] = `${key} is required`;
            hasError = true;
          } else {
            newErrors.Add2[index][key as keyof typeof business] = "";
          }
        });
      });
    }

    if (step === 1) {
      quotes.forEach((quote, index) => {
        // Validate all fields for each quote
        Object.keys(quote).forEach((key) => {
          if (key === "totalCost") {
            // Skip validation for totalCost
            return;
          }

          if (!quote[key as keyof typeof quote] && key !== "file") {
            newErrors.quotes[index][
              key as keyof typeof quote
            ] = `${key} is required`;
            hasError = true;
          }
        });

        // File validation
        if (!quote.file) {
          newErrors.quotes[index].file = "File is required";
          hasError = true;
        }

        if (quote.premium < 250) {
          newErrors.quotes[index].premium = "premium must be greater than 250";
          hasError = true;
        }

        if (quote.minEarnedRate >= 100) {
          newErrors.quotes[index].minEarnedRate =
            "Agreement is not financeable with a minimum earned rate of 100%";
          hasError = true;
        }
      });
    }

    setErrors(newErrors);
    setQuotesErrors(newErrors);
    return !hasError;
  };

  const removeQuote = (index: any) => {
    if (quotes.length > 1) {
      const updatedQuotes = quotes.filter((_, i) => i !== index);
      const updatedErrors = quotesErrors.quotes.filter((_, i) => i !== index);
      setQuotes(updatedQuotes);
      setQuotesErrors({ quotes: updatedErrors });
    }
  };

  // // Remove a quote
  // const removeQuote = (index: number) => {
  //   const updatedQuotes = quotes.filter((_, i) => i !== index);
  //   const updatedErrors = quotesErrors.quotes.filter((_, i) => i !== index);
  //   setQuotes(updatedQuotes);
  //   setQuotesErrors({ quotes: updatedErrors });
  // };

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
    totalCost: 0,
  };

  const handleResetCustomer = () => {
    setAdd1({
      email: "",
      firstName: "",
      lastName: "",
      contact: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    });
    setQuotes([emptyQuoteTemplate]);
    setIsAutocompleteComplete(false);
    setEmailError("");
  };

  const handleNext = async () => {
    if (!isStepComplete(activeStep)) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }

    if (activeStep === steps.length - 1) {
      try {
        console.log(quotes, "shubha, 456");
        const response = await axios.post(
          "http://localhost:3001/agreement",
          { Add1, Add2, quotes },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const { id } = response.data;
        alert("Form submitted successfully!");
        router.push(`/agreement/${id}`);
      } catch (error) {
        console.error("Error submitting form", error);
        alert("Error submitting form");
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const calculateTotalForQuote = (quote: any) => {
    const premium = Number(quote.premium) || 0;
    const taxes = Number(quote.taxes) || 0;
    const otherFees = Number(quote.otherFees) || 0;
    const brokerFee = Number(quote.brokerFee) || 0;
    const policyFee = Number(quote.policyFee) || 0;
    const commission = Number(quote.commission) || 0;
    const agencyFees = Number(quote.agencyFees) || 0;

    const totalForQuote =
      premium +
      taxes +
      otherFees +
      brokerFee +
      policyFee +
      commission +
      agencyFees;

    console.log(totalForQuote);
    return totalForQuote;
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
                error={!!errors.Add1.email}
                helperText={errors.Add1.email}
              />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={Add1.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.Add1.firstName}
                  helperText={errors.Add1.firstName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={Add1.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.Add1.lastName}
                  helperText={errors.Add1.lastName}
                />
              </Grid>
            </Grid>
            <TextField
              name="address"
              label="Address"
              value={Add1.address}
              onChange={handleInputChange}
              placeholder="Address"
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.Add1.address}
              helperText={errors.Add1.address}
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
                  error={!!errors.Add1.city}
                  helperText={errors.Add1.city}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.Add1?.state}
                >
                  <InputLabel id="state-label">State</InputLabel>
                  <Select
                    labelId="state-label"
                    name="state"
                    value={Add1.state}
                    onChange={handleSelectChange}
                    label="State"
                  >
                    <MenuItem value="MP">MP</MenuItem>
                    <MenuItem value="UP">UP</MenuItem>
                    <MenuItem value="Delhi">Delhi</MenuItem>
                    {/* Add more states as needed */}
                  </Select>
                  {errors.Add1?.state && (
                    <FormHelperText>{errors.Add1.state}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="zip"
                  label="Zip Code"
                  value={Add1.zip}
                  onChange={handleInputChange}
                  placeholder="Zip Code"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.Add1.zip}
                  helperText={errors.Add1.zip}
                />
              </Grid>
            </Grid>
            <PhoneInput
              country={"us"}
              value={Add1.contact}
              onChange={handleContactChange}
              inputProps={{
                name: "contact",
                required: true,
                autoFocus: true,
              }}
            />
            {errors.Add1?.contact && (
              <FormHelperText>{errors.Add1.contact}</FormHelperText>
            )}
            {/* {errors.contact && <p style={{ color: "red" }}>{errors.contact}</p>} */}
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
                      Business Form {index + 1}
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
                    value={business.BuisnessName}
                    onChange={(e) => {
                      const newBusiness = [...Add2];
                      newBusiness[index].BuisnessName = e.target.value;
                      setAdd2(newBusiness);
                    }}
                    placeholder="Business Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!!errors?.Add2?.[index]?.BuisnessName}
                    helperText={errors?.Add2?.[index]?.BuisnessName}
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
                    error={!!errors?.Add2?.[index]?.Address}
                    helperText={errors?.Add2?.[index]?.Address}
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
                        error={!!errors?.Add2?.[index]?.city}
                        helperText={errors?.Add2?.[index]?.city}
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
                        error={!!errors?.Add2?.[index]?.state}
                        helperText={errors?.Add2?.[index]?.state}
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
                        error={!!errors?.Add2?.[index]?.Zip}
                        helperText={errors?.Add2?.[index]?.Zip}
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
            <Typography
              variant="h6"
              className={styles.heading3}
              style={{ color: "black" }}
            >
              <br />
              Would you like to add a contact/deligate?
            </Typography>
            <Typography>
              Person that will act on behalf of the customer or business and be
              listed as the signee
            </Typography>
            <FormControl component="fieldset" margin="normal">
              <RadioGroup
                row
                value={selectedValue} // Controlled value
                onChange={handleChange} // Handle change
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </div>
        )}
        {activeStep === 1 && (
          <div>
            <Container>
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
                      <Typography variant="body1">
                        : {quote.file.name}
                      </Typography>
                    )}
                  </Button>
                  {quotesErrors.quotes[index]?.file && (
                    <Typography color="error">
                      {quotesErrors.quotes[index].file}
                    </Typography>
                  )}
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
                            error={!!quotesErrors.quotes[index]?.quoteNumber}
                            helperText={
                              quotesErrors.quotes[index]?.quoteNumber
                                ? "Quote Number is required"
                                : ""
                            }
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
                            error={!!quotesErrors.quotes[index]?.policyNumber}
                            helperText={
                              quotesErrors.quotes[index]?.policyNumber
                                ? "Policy Number is required"
                                : ""
                            }
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
                            error={!!quotesErrors.quotes[index]?.carrierCompany}
                            helperText={
                              quotesErrors.quotes[index]?.carrierCompany
                                ? "Carrier Company is required"
                                : ""
                            }
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
                            error={!!quotesErrors.quotes[index]?.wholesaler}
                            helperText={quotesErrors.quotes[index]?.wholesaler}
                          />
                        </Grid>
                      </Grid>
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
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="coverage"
                            label="Coverage"
                            value={quote.coverage}
                            onChange={(e) => handleQuoteChange(index, e)}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            error={!!quotesErrors.quotes[index]?.coverage}
                            helperText={quotesErrors.quotes[index]?.coverage}
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
                            error={
                              !!quotesErrors.quotes[index]?.minDaysToCancel
                            }
                            helperText={
                              quotesErrors.quotes[index]?.minDaysToCancel
                                ? "Minimum Days to Cancel is required"
                                : ""
                            }
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
                            error={!!quotesErrors.quotes[index]?.minEarnedRate}
                            helperText={
                              quotesErrors.quotes[index]?.minEarnedRate
                            }
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
                            error={!!quotesErrors.quotes[index]?.premium}
                            helperText={quotesErrors.quotes[index]?.premium}
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
                            error={!!quotesErrors.quotes[index]?.commission}
                            helperText={quotesErrors.quotes[index]?.commission}
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
            </Container>
          </div>
        )}
        {activeStep === 2 && (
          <div>
            {quotes.map((quote, index) => (
              <Box
                key={index}
                p={4}
                sx={{
                  maxWidth: "800px",
                  marginTop: "10px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  mb: 4,
                }}
              >
                {/* Quote Information */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ marginBottom: "30px" }}
                >
                  Quote {index + 1}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Quote number
                    </Typography>
                    <Typography>{quote.quoteNumber}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Policy number
                    </Typography>
                    <Typography>{quote.policyNumber}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Carrier / Writing company
                    </Typography>
                    <Typography>{quote.carrierCompany}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Coverage
                    </Typography>
                    <Typography>{quote.coverage}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Effective Date
                    </Typography>
                    <Typography>{quote.effectiveDate}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Expiration Date
                    </Typography>
                    <Typography>{quote.expirationDate}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Provided by Carrier */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h6" gutterBottom>
                      Provided by carrier
                    </Typography>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Minimum days to cancel
                      </Typography>
                      <Typography>{quote.minDaysToCancel}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Minimum earned rate
                      </Typography>
                      <Typography>{quote.minEarnedRate}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" gutterBottom>
                      Financeable
                    </Typography>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Premium
                      </Typography>
                      <Typography>{quote.premium}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Taxes
                      </Typography>
                      <Typography>{quote.taxes}</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Not Financeable */}
                <Typography variant="h6" gutterBottom>
                  Not financeable
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Other fees
                    </Typography>
                    <Typography>{quote.otherFees}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Broker / Wholesaler fee
                    </Typography>
                    <Typography>{quote.brokerFee}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Policy fee
                    </Typography>
                    <Typography>{quote.policyFee}</Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6">
                  Total Cost: $
                  {(quote.totalCost = calculateTotalForQuote(quote))}
                </Typography>
              </Box>
            ))}
          </div>
        )}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default CreatePage;
