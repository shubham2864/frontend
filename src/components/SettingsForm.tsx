import Link from "next/link";
import { useEffect, useState } from "react";
import Modal from "../components/Modal"; 
import styles from "../styles/Settings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { getProfile, getUsers } from "@/services/api";
import { useRouter } from "next/router";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

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
  const router = useRouter();

  useEffect(() => {
    const fetchProfileAndUsers = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          console.log("Fetching profile...");
          const profileResponse = await getProfile(token as string);
          setProfile(profileResponse.data);
          setRole(profileResponse.data.role);

          if (profileResponse.data.role === "admin") {
            console.log("Fetching users...");
            const usersResponse = await getUsers(token as string);
            console.log("Users fetched: ", usersResponse);
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
    router.push('/create-new');
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSelect = (option: string) => {
    console.log("Selected option:", option);
    setIsModalOpen(false);
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
                {role === 'admin' && users && users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button className={styles.editButton} onClick={()=>router.push('/create-new')}>✏️</button>
                      <button className={styles.deleteButton}>Delete</button>
                    </td>
                  </tr>
                ))}
                {role !== 'admin' && (
                  <tr>
                    <td>{profile.firstName}</td>
                    <td>{profile.lastName}</td>
                    <td>{profile.phoneNumber}</td>
                    <td>{profile.email}</td>
                    <td>{profile.role}</td>
                    <td>
                      <button className={styles.editButton} onClick={()=>router.push('/create-new')}>✏️</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default SettingsForm;
