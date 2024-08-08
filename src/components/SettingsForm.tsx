import Link from "next/link";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { getProfile, getUsers } from "@/services/api";
import { useRouter } from "next/router";
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
  Grid,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import styles from "../styles/Settings.module.css";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editOrgDialogOpen, setEditOrgDialogOpen] = useState(false);
  const [editBankDialogOpen, setEditBankDialogOpen] = useState(false);
  const [verified, setVerified] = useState("Pending");
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
    };

    fetchProfileAndUsers();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleModalOpen = () => {
    router.push("/create-new");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSelect = (option: string) => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber.includes(searchQuery)
  );

  const handleOpenEditOrgDialog = () => {
    setEditOrgDialogOpen(true);
  };

  const handleCloseEditOrgDialog = () => {
    setEditOrgDialogOpen(false);
    setVerified("Verified");
  };

  const handleOpenEditBankDialog = () => {
    setEditBankDialogOpen(true);
  };

  const handleCloseEditBankDialog = () => {
    setEditBankDialogOpen(false);
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
              <div className={styles.searchAdd}>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={styles.searchBar}
                />
                <button className={styles.addButton} onClick={handleModalOpen}>
                  Add New
                </button>
              </div>
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
                          onClick={() => router.push("/create-new")}
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
                        onClick={() => router.push("/create-new")}
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
        {activeTab === "organizationDetails" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", marginLeft: "200px" }}>
              <h2 style={{ margin: "10px" }}>Business and bank details</h2>
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
            <p style={{ marginTop: "0px", marginLeft: "210px", }}>
              Business and bank details shoudl go where you have Test Insurance
            </p>
            <StyledCard
              sx={{
                margin: "auto",
                width: "1500px", // Adjust the width
                height: "fit-content", // Adjust the height
                marginBottom: "10px",
                boxShadow: 3, // Optional: Add shadow
                borderRadius: "8px",
              }}
            >
              <CardHeader
                title="LIC Insurance"
                action={
                  <IconButton onClick={handleOpenEditOrgDialog}>
                    <EditIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <FieldWithValue
                  label="Doing business as"
                  value="ABC Insurance"
                />
                <div style={{ borderBottom: "1px dotted #000" }}></div>

                <FieldWithValue label="Phone Number" value="+91 123456789" />
                <div style={{ borderBottom: "1px dotted #000" }}></div>
                <FieldWithValue label="Website" value="www.google.com" />
                <div style={{ borderBottom: "1px dotted #000" }}></div>
                <FieldWithValue label="Address" value="Sainath colony" />
                <div style={{ borderBottom: "1px dotted #000" }}></div>
                <FieldWithValue
                  label="Tax identification number"
                  value="0000000000"
                />
                <div style={{ borderBottom: "1px dotted #000" }}></div>
                <FieldWithValue label="Type" value="llc" />
                <div style={{ borderBottom: "1px dotted #000" }}></div>
              </CardContent>
            </StyledCard>
            <StyledCard
              sx={{
                margin: "auto",
                width: "1500px", // Adjust the width
                height: "fit-content", // Adjust the height
                boxShadow: 3, // Optional: Add shadow
                borderRadius: "8px",
              }}
            >
              <CardHeader
                title="Bank Details"
                action={
                  <IconButton onClick={handleOpenEditBankDialog}>
                    <EditIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <FieldWithValue label="Account Holder Name" value="shubham" />
                <div style={{ borderBottom: "1px dotted #000" }}></div>
                <FieldWithValue label="Account Number" value="123456789" />
                <div style={{ borderBottom: "1px dotted #000" }}></div>
                <FieldWithValue label="Phone Number" value="+91 123456789" />
                <div style={{ borderBottom: "1px dotted #000" }}></div>
                <FieldWithValue label="Routing Number" value="+91 123456789" />
                <div style={{ borderBottom: "1px dotted #000" }}></div>
              </CardContent>
            </StyledCard>
          </div>
        )}
      </div>
      <Dialog open={editOrgDialogOpen} onClose={handleCloseEditOrgDialog}>
        <DialogTitle>Edit Organization Details</DialogTitle>
        <DialogContent>
          <TextField label="Business Name" fullWidth margin="normal" />
          <TextField label="Phone" fullWidth margin="normal" />
          <TextField label="Website" fullWidth margin="normal" />
          <TextField label="Address" fullWidth margin="normal" />
          <TextField label="Tax ID" fullWidth margin="normal" />
          <TextField label="Type" fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditOrgDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCloseEditOrgDialog} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editBankDialogOpen} onClose={handleCloseEditBankDialog}>
        <DialogTitle>Edit Bank Details</DialogTitle>
        <DialogContent>
          <TextField label="Bank Name" fullWidth margin="normal" />
          <TextField label="Account Number" fullWidth margin="normal" />
          <TextField label="Routing Number" fullWidth margin="normal" />
          <TextField label="Bank Address" fullWidth margin="normal" />
          <TextField label="SWIFT Code" fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditBankDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCloseEditBankDialog} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default SettingsForm;
