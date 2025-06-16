import { useSelector } from "react-redux";
import { selectFilteredContacts } from "../../redux/contacts/selectors";
import {
  groupContactsByCountry,
  countryToEmoji,
} from "../../utils/contactUtils";
import styles from "./SidebarFilters.module.css";

export default function SidebarFilters({ selectedCountry, onSelectCountry }) {
  const contacts = useSelector(selectFilteredContacts);
  const grouped = groupContactsByCountry(contacts);
  const countries = Object.keys(grouped).sort();
  const sortedCountries = Object.keys(grouped).sort((a, b) => {
    if (a === "Unknown") return 1;
    if (b === "Unknown") return -1;
    return a.localeCompare(b);
  });

  return (
    <div className={styles.filterBlock}>
      <h4 className={styles.heading}>Filter by country</h4>
      <ul className={styles.countryFilter}>
        <li>
          <button
            className={`${styles.button} ${!selectedCountry ? styles.active : ""}`}
            onClick={() => onSelectCountry(null)}
          >
            🌍 All ({contacts.length})
          </button>
        </li>

        {countries.map((country) => {
          const isUnknown = country === "Unknown";
          const emoji = isUnknown ? "❓" : countryToEmoji(country);

          return (
            <li key={country}>
              <button
                className={`${styles.button} ${selectedCountry === country ? styles.active : ""}`}
                onClick={() => onSelectCountry(country)}
              >
                {emoji} {isUnknown ? "Unknown" : country} (
                {grouped[country].length})
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
