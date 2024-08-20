import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Dashboard.module.css";

const DashboardForm: React.FC = () => {
  const { isAuthenticated, authChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authChecked) {
      // Wait for the auth check to complete
      const token = localStorage.getItem("token");
      if (!token || !isAuthenticated) {
        router.push("/login");
      }
    }
  }, [authChecked, isAuthenticated, router]);

  const navigateToProfile = () => {
    router.push("/profile");
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.statsContainer}>
        <div className={styles.statBox}>
          <div className={styles.icon}>
            <img src="/notification-bell.png" alt="Bell Icon" />
          </div>
          <div className={styles.statInfo}>
            <p>Items need action</p>
            <p>0 Agreements</p>
          </div>
          <div className={styles.actions}>
            <button className={styles.overdueButton}>Overdue</button>
            <button className={styles.transferButton}>Transfer Funds</button>
          </div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.icon}>
            <img src="/quotes.png" alt="Quotes Icon" />
          </div>
          <div className={styles.statInfo}>
            <p>Incomplete Quotes</p>
            <p>0</p>
          </div>
          <button className={styles.missingButton}>
            Missing Policy Number
          </button>
        </div>
        <div className={styles.statBox}>
          <div className={styles.icon}>
            <img src="/premium.png" alt="Premium Icon" />
          </div>
          <div className={styles.statInfo}>
            <p>Unsold Premium</p>
            <p>$0.00</p>
          </div>
          <button className={styles.paymentButton}>Payment Due</button>
        </div>
        <div className={styles.statBox}>
          <div className={styles.icon}>
            <img src="/ticket.png" alt="Sold Icon" />
          </div>
          <div className={styles.statInfo}>
            <p>Total premium sold</p>
            <p>$0.00</p>
          </div>
          <button className={styles.reportButton}>View Report</button>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.tableTabs}>
          <button className={styles.activeTab}>Finance Agreements</button>
          <button className={styles.tab}>Invoices</button>
          <button className={styles.tab}>Subscriptions</button>
        </div>
        <div className={styles.tableFilters}>
          <button className={styles.filterButton}>Filters</button>
          <button className={styles.filterButton}>Producer</button>
          <button className={styles.filterButton}>Agreement Status</button>
          <button className={styles.filterButton}>Payment Option</button>
          <button className={styles.filterButton}>Created Date</button>
          <button className={styles.filterButton}>Purchased Date</button>
        </div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>INSURED</th>
              <th>PROVIDER</th>
              <th>EFFECTIVE DATE</th>
              <th>GROSS PREMIUM</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Elaine Thakur</td>
              <td>13643 St A 5Star CRC</td>
              <td>Jul 25, 2024</td>
              <td>$12,300.00</td>
              <td>
                <span className={styles.statusActive}>Active</span>
              </td>
              <td>
                <button className={styles.moreButton}>...</button>
              </td>
            </tr>
            <tr>
              <td>Elaine Thakur</td>
              <td>American Empire Insurance Company Amwins Brokerage...</td>
              <td>Jul 25, 2024</td>
              <td>$106,970.60</td>
              <td>
                <span className={styles.statusActive}>Active</span>
              </td>
              <td>
                <button className={styles.moreButton}>...</button>
              </td>
            </tr>
            <tr>
              <td>Elaine Thakur</td>
              <td>American Empire Insurance Company Amwins Brokerage...</td>
              <td>Jul 25, 2024</td>
              <td>$106,970.60</td>
              <td>
                <span className={styles.statusActive}>Active</span>
              </td>
              <td>
                <button className={styles.moreButton}>...</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div className={styles.pagination}>
          <span>Rows per page:</span>
          <select className={styles.pageSelect}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <span>1-3 of 3</span>
          <button className={styles.pageButton}>&lt;</button>
          <button className={styles.pageButton}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardForm;
