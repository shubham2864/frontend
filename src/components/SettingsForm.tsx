import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import {
  getProfile,
  getSingleProfile,
  getUsers,
  updateCompanyDetails,
  updateProfile,
} from "@/services/api";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import styles from "../styles/Settings.module.css";
import { useAuth } from "@/context/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  companyId: string;
}

const StyledCard = styled(Card)({
  margin: "20px 0",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
});

type FieldWithValueProps = {
  label: string;
  value: string;
};

const FieldWithValue: React.FC<FieldWithValueProps> = ({ label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", padding: "8px 0" }}>
    <Typography variant="body1" component="span" sx={{ minWidth: "150px" }}>
      {label}
    </Typography>
    <Typography
      variant="body1"
      component="span"
      sx={{ marginLeft: "auto", textAlign: "center", flexGrow: 1 }}
    >
      {label === "Website" ? (
        <Link href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </Link>
      ) : (
        value
      )}
    </Typography>
  </Box>
);

const SettingsForm = () => {
  const [activeTab, setActiveTab] = useState("userManagement");
  const { companyDetails } = useAuth();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "",
  });
  const [orgDetails, setOrgDetails] = useState({
    businessName: "",
    phone: "",
    website: "",
    address: "",
    taxId: "",
    type: "",
  });
  const [bankDetails, setBankDetails] = useState({
    accountTypeOperational: "",
    operationalAccountHolderName: "",
    operationalAccountNumber: "",
    operationalRoutingNumber: "",
    accountTypeTrust: "",
    trustAccountHolderName: "",
    trustAccountNumber: "",
    trustRoutingNumber: "",
    sameAsOperational: false,
    oneTimePaymentAccount: "",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editOrgDialogOpen, setEditOrgDialogOpen] = useState(false);
  const [editBankDialogOpen, setEditBankDialogOpen] = useState(false);
  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);
  const [verified, setVerified] = useState("Pending");
  const [profileToEdit, setProfileToEdit] = useState<Partial<User>>({});
  const [sameAsOperational, setSameAsOperational] = useState(false);
  const [accountTypeOperational, setAccountTypeOperational] =
    useState("Company");
  const [accountTypeTrust, setAccountTypeTrust] = useState("Company");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfileAndUsers = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const profileResponse = await getProfile(token as string);
          setProfile(profileResponse.data);
          setRole(profileResponse.data.role);

          if (profileResponse.data.role === "admin") {
            const usersResponse = await getUsers(token as string);
            setUsers(usersResponse);
          }
        } catch (error) {
          console.error("Error fetching profile or users:", error);
        }
      }
      if (companyDetails) {
        setOrgDetails((prevDetails) => ({
          ...prevDetails,
          businessName: companyDetails.companyName,
          phone: companyDetails.mobileNumber,
          website: companyDetails.website,
          address: `${companyDetails.streetAddress}, ${companyDetails.city}, ${companyDetails.state}, ${companyDetails.zipCode}`,
          taxId: `${companyDetails.taxId}`,
          type: `${companyDetails.type}`,
        }));
      }
    };

    fetchProfileAndUsers();
  }, [companyDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleBankDetailsInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setBankDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSameAsOperationalChange = (event: any) => {
    setSameAsOperational(event.target.checked);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleOpen = () => {
    router.push("/create-new");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.companyId === companyDetails?._id &&
      (user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phoneNumber.includes(searchQuery) ||
        user.role.includes(searchQuery))
  );

  const handleSaveOrgDetails = async () => {
    try {
      const updatedOrgDetails = {
        companyName: orgDetails.businessName,
        mobileNumber: orgDetails.phone,
        website: orgDetails.website,
        streetAddress: orgDetails.address,
        taxId: orgDetails.taxId,
        type: orgDetails.type,
      };

      await updateCompanyDetails(updatedOrgDetails, companyDetails!._id);
      handleCloseEditOrgDialog();
    } catch (error) {
      console.error("Failed to save company details:", error);
    }
  };

  const handleOpenEditOrgDialog = () => {
    setEditOrgDialogOpen(true);
  };

  const handleCloseEditOrgDialog = () => {
    setEditOrgDialogOpen(false);
  };

  const handleOpenEditBankDialog = () => {
    setEditBankDialogOpen(true);
  };

  const handleCloseEditBankDialog = () => {
    setEditBankDialogOpen(false);
  };

  const handleOpenEditProfileDialog = async (email: string) => {
    try {
      const Profile = await getSingleProfile(email);
      setProfileToEdit({
        firstName: Profile.firstName,
        lastName: Profile.lastName,
        phoneNumber: Profile.phoneNumber,
        email: Profile.email,
        role: Profile.role,
      });
      setEditProfileDialogOpen(true);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleCloseEditProfileDialog = async () => {
    setEditProfileDialogOpen(false);
  };

  const handleSaveProfile = async () => {
    const updatedProfileResponse = await updateProfile(profileToEdit); // Axios response
    const updatedProfileData = updatedProfileResponse.data; // Extract the data
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.email === updatedProfileData.email ? updatedProfileData : user
      )
    );
    alert("Profile updated successfully!");
    handleCloseEditProfileDialog();
  };

  const handleFileChange = (e: any) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFileName(uploadedFile.name);
      setFile(uploadedFile);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleFileDelete = () => {
    setFileName("");
    setFile(null);
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          <FontAwesomeIcon
            icon={faArrowAltCircleLeft}
            style={{ color: "black" }}
          />
        </Link>
        <h1>Settings</h1>
      </div>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${
            activeTab === "userManagement" ? styles.activeTab : ""
          }`}
          onClick={() => handleTabChange("userManagement")}
        >
          <span className={styles.icon}>👤</span> User Management
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "organizationDetails" ? styles.activeTab : ""
          }`}
          onClick={() => handleTabChange("organizationDetails")}
        >
          <span className={styles.icon}>🏢</span> Organization Details
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "wholesalersCarriers" ? styles.activeTab : ""
          }`}
          onClick={() => handleTabChange("wholesalersCarriers")}
        >
          <span className={styles.icon}>🛒</span> Wholesalers / Carriers
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "theme" ? styles.activeTab : ""
          }`}
          onClick={() => handleTabChange("theme")}
        >
          <span className={styles.icon}>🎨</span> Theme
        </div>
      </div>
      <div className={styles.content}>
        {activeTab === "userManagement" && (
          <div className={styles.userManagement}>
            <div className={styles.headerRow}>
              <h2>Users</h2>
              {profile.role == "admin" ? (
                <div className={styles.searchAdd}>
                  <div className={styles.headerRow}>
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className={styles.searchBar}
                    />
                    <button className={styles.addButton} onClick={handleOpen}>
                      Add New
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2>User</h2>
                </>
              )}
            </div>
            <p>Manage users across divisions you are an admin of.</p>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {role === "admin" &&
                  filteredUsers.map((user, index) => (
                    <tr key={index}>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          className={styles.editButton}
                          onClick={() =>
                            handleOpenEditProfileDialog(user.email)
                          }
                        >
                          ✏️
                        </button>
                        <button className={styles.deleteButton}>Delete</button>
                      </td>
                    </tr>
                  ))}
                {role !== "admin" && (
                  <tr>
                    <td>{profile.firstName}</td>
                    <td>{profile.lastName}</td>
                    <td>{profile.phoneNumber}</td>
                    <td>{profile.email}</td>
                    <td>{profile.role}</td>
                    <td>
                      <button
                        className={styles.editButton}
                        onClick={() =>
                          handleOpenEditProfileDialog(profile.email)
                        }
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Organization Details  */}
        {activeTab === "organizationDetails" && (
          <div style={{ width: "100%", maxWidth: "1500px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "0 auto",
                marginBottom: "-5px",
                paddingLeft: "2%",
              }}
            >
              <h2 style={{ margin: "8px 1%", marginLeft: "-15px" }}>
                Business and bank details
              </h2>
              <p
                style={{
                  margin: 0,
                  padding: "4px 8px",
                  backgroundColor: "#28a745", // Green background
                  color: "white", // White text
                  borderRadius: "12px", // Curved border
                  fontWeight: "bold",
                }}
              >
                {verified}
              </p>
            </div>
            <p
              style={{
                marginTop: "0px",
                paddingLeft: "3%",
                marginLeft: "-30px",
              }}
            >
              Business and bank details should go where you have Test Insurance
            </p>

            {/* Business Details Card */}
            <StyledCard
              sx={{
                margin: "0 auto",
                width: "100%", // Use percentage width
                maxWidth: "1500px", // Limit the maximum width
                height: "fit-content", // Adjust the height
                marginBottom: "10px",
                boxShadow: 3, // Optional: Add shadow
                borderRadius: "8px",
              }}
            >
              <CardHeader
                title={companyDetails?.companyName}
                action={
                  <IconButton onClick={handleOpenEditOrgDialog}>
                    <EditIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <div className={styles.fieldWithValueContainer}>
                  <span className={styles.fieldLabel}>Doing business as</span>
                  <span className={styles.separator}> - </span>
                  <span className={styles.fieldValue}>
                    {orgDetails.businessName}
                  </span>
                </div>
                <div className={styles.fieldWithValueContainer}>
                  <span className={styles.fieldLabel}>Phone</span>
                  <span className={styles.separator}> - </span>
                  <span className={styles.fieldValue}>{orgDetails.phone}</span>
                </div>
                <div className={styles.fieldWithValueContainer}>
                  <span className={styles.fieldLabel}>Website</span>
                  <span className={styles.separator}> - </span>
                  <span className={styles.fieldValue}>
                    {orgDetails.website}
                  </span>
                </div>
                <div className={styles.fieldWithValueContainer}>
                  <span className={styles.fieldLabel}>Address</span>
                  <span className={styles.separator}> - </span>
                  <span className={styles.fieldValue}>
                    {orgDetails.address}
                  </span>
                </div>
                <div className={styles.fieldWithValueContainer}>
                  <span className={styles.fieldLabel}>
                    Tax identification number
                  </span>
                  <span className={styles.separator}> - </span>
                  <span className={styles.fieldValue}>{orgDetails.taxId}</span>
                </div>
                <div className={styles.fieldWithValueContainer}>
                  <span className={styles.fieldLabel}>Type</span>
                  <span className={styles.separator}> - </span>
                  <span className={styles.fieldValue}>{orgDetails.type}</span>
                </div>
              </CardContent>
            </StyledCard>

            {/* Bank Details Card */}
            <StyledCard
              sx={{
                margin: "0 auto",
                marginTop: "30px",
                width: "100%", // Use percentage width
                maxWidth: "1500px", // Limit the maximum width
                height: "fit-content", // Adjust the height
                marginBottom: "10px",
                boxShadow: 3, // Optional: Add shadow
                borderRadius: "8px",
              }}
            >
              <Box display="flex" alignItems="right" justifyContent="end">
                <IconButton
                  onClick={handleOpenEditBankDialog}
                  style={{ marginLeft: "auto", justifyContent: "flex-end" }} // Push the button to the right end
                >
                  <EditIcon />
                </IconButton>
              </Box>
              <DialogContent>
                <FormControl component="fieldset" margin="normal" fullWidth>
                  <FormLabel
                    component="legend"
                    style={{
                      color: "black",
                      fontSize: "25px",
                      display: "flex", // Use flexbox to position items
                      alignItems: "center", // Center items vertically
                    }}
                  >
                    Bank Details
                  </FormLabel>
                </FormControl>

                <FormControl component="fieldset" margin="normal" fullWidth>
                  <FormLabel
                    component="legend"
                    style={{ color: "black", fontSize: "18px" }}
                  >
                    Operational account
                  </FormLabel>
                  <CardContent>
                    <div className={styles.fieldWithValueContainer}>
                      <span className={styles.fieldLabel}>
                        Account Holder Name
                      </span>
                      <span className={styles.separator}> - </span>
                      <span className={styles.fieldValue}>{bankDetails.operationalAccountHolderName}</span>
                    </div>
                    <div className={styles.fieldWithValueContainer}>
                      <span className={styles.fieldLabel}>Account Number</span>
                      <span className={styles.separator}> - </span>
                      <span className={styles.fieldValue}>{bankDetails.operationalAccountNumber}</span>
                    </div>
                    <div className={styles.fieldWithValueContainer}>
                      <span className={styles.fieldLabel}>Routing Number</span>
                      <span className={styles.separator}> - </span>
                      <span className={styles.fieldValue}>{bankDetails.operationalRoutingNumber}</span>
                    </div>
                  </CardContent>
                </FormControl>

                <Typography
                  variant="h6"
                  style={{ marginTop: "20px", fontSize: "18px" }}
                >
                  Trust account
                  <CardContent>
                    <div className={styles.fieldWithValueContainer}>
                      <span className={styles.fieldLabel}>
                        Account Holder Name
                      </span>
                      <span className={styles.separator}> - </span>
                      <span className={styles.fieldValue}>{bankDetails.trustAccountHolderName}</span>
                    </div>
                    <div className={styles.fieldWithValueContainer}>
                      <span className={styles.fieldLabel}>Account Number</span>
                      <span className={styles.separator}> - </span>
                      <span className={styles.fieldValue}>{bankDetails.trustAccountNumber}</span>
                    </div>
                    <div className={styles.fieldWithValueContainer}>
                      <span className={styles.fieldLabel}>Routing Number</span>
                      <span className={styles.separator}> - </span>
                      <span className={styles.fieldValue}>{bankDetails.trustRoutingNumber}</span>
                    </div>
                  </CardContent>
                </Typography>

                <FormControl component="fieldset" margin="normal" fullWidth>
                  <FormLabel
                    component="legend"
                    style={{ color: "black", fontSize: "18px" }}
                  >
                    One-time payment account
                  </FormLabel>
                  <Typography variant="body2" style={{ marginBottom: "10px" }}>
                    The account where Link finance will transfer all funds
                    received for one-time payments.
                  </Typography>
                  <CardContent>
                    <div className={styles.fieldWithValueContainer}>
                      <span className={styles.fieldLabel}>Account</span>
                      <span className={styles.separator}> - </span>
                      <span className={styles.fieldValue}></span>
                    </div>
                  </CardContent>
                </FormControl>

                <Typography
                  variant="h6"
                  style={{ marginTop: "20px", fontSize: "18px" }}
                >
                  Proof of bank account
                </Typography>
                <Typography variant="body2" style={{ marginBottom: "10px" }}>
                  Can you please provide a legal document (e.g., SS-4
                  confirmation letter, Letter 147C) that provides confirmation
                  of the entity's legal name and TIN? We will need this document
                  in order for you to transact with Link-Finance.
                </Typography>
                <Box
                  sx={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
                >
                  {fileName && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <Typography variant="body1">{fileName}</Typography>
                      <IconButton onClick={handleFileDelete} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}

                  <Box
                    component="label"
                    sx={{
                      width: "100%",
                      display: "block",
                      padding: "20px",
                      border: "2px dashed #ccc",
                      borderRadius: "4px",
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor: "#f7f7f7",
                      ":hover": {
                        borderColor: "#888",
                      },
                    }}
                  >
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <UploadFileIcon fontSize="large" color="action" />
                    <Typography variant="body1" color="textSecondary">
                      Drop or Select file
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Drop files here or click <strong>browse</strong> through
                      your machine
                    </Typography>
                  </Box>
                </Box>
              </DialogContent>
            </StyledCard>
          </div>
        )}
      </div>

      {/* Organization Details dialog Box */}
      <Dialog open={editOrgDialogOpen} onClose={handleCloseEditOrgDialog}>
        <DialogTitle>Edit Organization Details</DialogTitle>
        <DialogContent>
          <TextField
            type="text"
            label="Business Name"
            fullWidth
            margin="normal"
            name="businessName"
            value={orgDetails.businessName}
            onChange={handleInputChange}
          />
          <TextField
            type="text"
            label="Phone"
            fullWidth
            margin="normal"
            name="phone"
            value={orgDetails.phone}
            onChange={handleInputChange}
          />
          <TextField
            type="text"
            label="Website"
            fullWidth
            margin="normal"
            name="website"
            value={orgDetails.website}
            onChange={handleInputChange}
          />
          <TextField
            type="text"
            label="Address"
            fullWidth
            margin="normal"
            name="address"
            value={orgDetails.address}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Tax Identification Number"
            type="text"
            fullWidth
            name="taxId"
            value={orgDetails.taxId}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Type"
            type="text"
            fullWidth
            name="type"
            value={orgDetails.type}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditOrgDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveOrgDetails} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bank details Modal */}
      <Dialog
        open={editBankDialogOpen}
        onClose={handleCloseEditBankDialog}
        maxWidth="md"
        fullWidth
      >
        <Box display="flex" alignItems="right" justifyContent="end">
          <IconButton onClick={handleCloseEditBankDialog}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent>
          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel
              component="legend"
              style={{ color: "black", fontSize: "25px" }}
            >
              Bank Details
            </FormLabel>
            <Typography variant="body2" style={{ marginBottom: "10px" }}>
              In order for us to pay your agency, we’ll need to collect your
              bank details. Please fill in the form below.
            </Typography>
          </FormControl>

          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel
              component="legend"
              style={{ color: "black", fontSize: "18px" }}
            >
              Operational account
            </FormLabel>
            <Typography variant="body2" style={{ marginBottom: "10px" }}>
              The account you use to manage your agency's operational expenses.
              Link-finance will send you your commission to this account.
            </Typography>
            <RadioGroup
              value={bankDetails.accountTypeOperational}
              onChange={handleBankDetailsInputChange}
              name="accountTypeOperational"
              row={false}
            >
              <FormControlLabel
                value="Company"
                control={<Radio />}
                label="Company"
              />
              <FormControlLabel
                value="Individual"
                control={<Radio />}
                label="Individual"
              />
            </RadioGroup>
            <TextField
              label="Account holder name"
              fullWidth
              margin="normal"
              name="operationalAccountHolderName"
              value={bankDetails.operationalAccountHolderName}
              onChange={handleBankDetailsInputChange}
            />
            <TextField
              label="Account number"
              fullWidth
              margin="normal"
              name="operationalAccountNumber"
              value={bankDetails.operationalAccountNumber}
              onChange={handleBankDetailsInputChange}
            />
            <TextField
              label="Routing number"
              fullWidth
              margin="normal"
              name="operationalRoutingNumber"
              value={bankDetails.operationalRoutingNumber}
              onChange={handleBankDetailsInputChange}
            />
          </FormControl>

          <Typography
            variant="h6"
            style={{ marginTop: "20px", fontSize: "18px" }}
          >
            Trust account
          </Typography>
          <Typography variant="body2">
            The account you use to hold funds on behalf of other partners (e.g.,
            carriers, wholesalers, etc). For customers on the Starter plan,
            Link-finance will transfer all funds (premium and commission) for
            paid-in-full policies to this account.
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={sameAsOperational}
                onChange={handleSameAsOperationalChange}
              />
            }
            label="Same as operational account"
            style={{ marginTop: "10px" }}
          />

          {!sameAsOperational && (
            <FormControl component="fieldset" margin="normal" fullWidth>
              <RadioGroup
                value={bankDetails.accountTypeTrust}
                onChange={handleBankDetailsInputChange}
                name="accountTypeTrust"
                row={false}
              >
                <FormControlLabel
                  value="Company"
                  control={<Radio />}
                  label="Company"
                />
                <FormControlLabel
                  value="Individual"
                  control={<Radio />}
                  label="Individual"
                />
              </RadioGroup>
              <TextField
                label="Account holder name"
                fullWidth
                margin="normal"
                name="trustAccountHolderName"
                value={bankDetails.trustAccountHolderName}
                onChange={handleBankDetailsInputChange}
              />
              <TextField
                label="Account number"
                fullWidth
                margin="normal"
                name="trustAccountNumber"
                value={bankDetails.trustAccountNumber}
                onChange={handleBankDetailsInputChange}
              />
              <TextField
                label="Routing number"
                fullWidth
                margin="normal"
                name="trustRoutingNumber"
                value={bankDetails.trustRoutingNumber}
                onChange={handleBankDetailsInputChange}
              />
            </FormControl>
          )}

          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel
              component="legend"
              style={{ color: "black", fontSize: "18px" }}
            >
              One-time payment account
            </FormLabel>
            <Typography variant="body2" style={{ marginBottom: "10px" }}>
              The account where Link-finance will transfer all funds received
              for one-time payments.
            </Typography>
            <RadioGroup
              value={accountTypeOperational}
              onChange={(e) => setAccountTypeOperational(e.target.value)}
              row={false}
            >
              <FormControlLabel
                value="operationalAccount"
                control={<Radio />}
                label="Operational Account"
              />
              <FormControlLabel
                value="trustAccount"
                control={<Radio />}
                label="Trust Account"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseEditBankDialog}
            color="primary"
            sx={{
              marginRight: "20px",
              bgcolor: "primary.main", // Background color
              color: "#fff", // Text color
              borderRadius: "8px", // Border radius
              border: "1px solid", // Border
              borderColor: "primary.dark", // Border color
              padding: "8px 16px", // Padding
              "&:hover": {
                bgcolor: "primary.dark", // Hover effect for background color
              },
            }}
          >
            Save Bank Details
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile Dialog*/}
      <Dialog
        open={editProfileDialogOpen}
        onClose={handleCloseEditProfileDialog}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            value={profileToEdit.firstName || ""}
            onChange={(e) =>
              setProfileToEdit((prev) => ({
                ...prev,
                firstName: e.target.value,
              }))
            }
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            value={profileToEdit.lastName || ""}
            onChange={(e) =>
              setProfileToEdit((prev) => ({
                ...prev,
                lastName: e.target.value,
              }))
            }
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            value={profileToEdit.phoneNumber || ""}
            onChange={(e) =>
              setProfileToEdit((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }))
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={profileToEdit.email || ""}
            disabled
          />
          <TextField
            label="Role"
            fullWidth
            margin="normal"
            value={profileToEdit.role || ""}
            onChange={(e) =>
              setProfileToEdit((prev) => ({
                ...prev,
                role: e.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditProfileDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Handle save logic here
              handleSaveProfile();
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SettingsForm;
