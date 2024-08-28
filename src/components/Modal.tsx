import React, { useState } from "react";
import styles from "../styles/Modal.module.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: string) => void;
  handleOrgClick: () => void; // Accept the prop from Navbar
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSelect, handleOrgClick }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { companyDetails } = useAuth();
  const router = useRouter();
  if (!isOpen) return null;

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleCreateClick = () => {
    if (selectedOption) {
      onSelect(selectedOption);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        {companyDetails?.isVerified === true ? (
          <>
            <div className={styles.optionContainer}>
              <div
                className={`${styles.option} ${
                  selectedOption === "agreement" ? styles.selected : ""
                }`}
                onClick={() => handleOptionClick("agreement")}
              >
                <h3>Agreement</h3>
                <p>Create a new premium finance agreement</p>
                <ul>
                  <li>Automated commission to your operational bank account</li>
                  <li>Automated payouts to your wholesalers and carriers</li>
                </ul>
              </div>
              <div
                className={`${styles.option} ${
                  selectedOption === "subscription" ? styles.selected : ""
                }`}
                onClick={() => handleOptionClick("subscription")}
              >
                <h3>Subscription</h3>
                <p>Create recurring invoices to collect periodic payments</p>
                <ul>
                  <li>
                    No automated commission and payouts to external suppliers
                  </li>
                  <li>No financing</li>
                </ul>
              </div>
              <div
                className={`${styles.option} ${
                  selectedOption === "invoice" ? styles.selected : ""
                }`}
                onClick={() => handleOptionClick("invoice")}
              >
                <h3>Invoice</h3>
                <p>Create a one-time invoice</p>
                <ul>
                  <li>
                    No automated commission and payouts to external suppliers
                  </li>
                  <li>No financing</li>
                </ul>
              </div>
            </div>
            <button className={styles.createBtn} onClick={handleCreateClick}>
              Create
            </button>
          </>
        ) : (
          <>
            <div className={styles.incompleteContainer}>
              <h3 className={styles.incompleteTitle}>Incomplete Detail</h3>
              <p>First Complete the Organization Details.</p>
              <hr
                style={{
                  borderTop: "1px #ccc",
                  marginTop: "0px",
                  marginBottom: "0px",
                }}
              />
              <ul>
                <li>
                  <strong>Business details:</strong> Please complete your
                  business and owner details like TIN (Tax identification
                  number), SSN (Social Security number), DOB (Date of birth),
                  etc.
                </li>
                <li>
                  <strong>Bank details:</strong> Please provide your operational
                  and trust account details.
                </li>
                <li>
                  <strong>Legal document:</strong> Can you please provide a
                  legal document (e.g., SS-4 confirmation letter, Letter 147C)
                  that provides confirmation of the entity's legal name and TIN?
                  We will need this document in order for you to transact with
                  Link-Finance.
                </li>
              </ul>
            </div>
            <button
              style={{marginTop: "25px",display: "flex", alignItems: "flex-end", justifyContent: "end"}}
              onClick={handleOrgClick}
            >
              Go To Organization
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
