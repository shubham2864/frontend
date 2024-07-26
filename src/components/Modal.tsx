import React, { useState } from "react";
import styles from "../styles/Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

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
              <li>No automated commission and payouts to external suppliers</li>
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
              <li>No automated commission and payouts to external suppliers</li>
              <li>No financing</li>
            </ul>
          </div>
        </div>
        <button className={styles.createBtn} onClick={handleCreateClick}>
          Create
        </button>
      </div>
    </div>
  );
};

export default Modal;
