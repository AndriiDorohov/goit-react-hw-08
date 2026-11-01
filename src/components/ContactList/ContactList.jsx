import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFilteredContacts,
  selectIsLoading,
  selectError,
} from "../../redux/contacts/selectors";
import { fetchContacts, deleteContact } from "../../redux/contacts/operations";
import {
  selectIsLoggedIn,
  selectIsRefreshing,
} from "../../redux/auth/selectors";
import Contact from "../Contact/Contact";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  groupContactsByCountry,
  countryToEmoji,
} from "../../utils/contactUtils";
import clsx from "clsx";
import styles from "./ContactList.module.css";

export default function ContactList({ selectedCountry }) {
  const dispatch = useDispatch();
  const contacts = useSelector(selectFilteredContacts);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (isLoggedIn && !hasLoadedOnce) {
      dispatch(fetchContacts()).finally(() => {
        setHasLoadedOnce(true);
      });
    }
  }, [dispatch, isLoggedIn, hasLoadedOnce]);

  if (isRefreshing) return null;
  if (isLoading && !hasLoadedOnce) return <p>Loading contacts...</p>;

  const groupedContacts = groupContactsByCountry(contacts);
  const sortedCountries = Object.keys(groupedContacts).sort();

  const hasVisibleContacts = sortedCountries.some(
    (country) =>
      (!selectedCountry || selectedCountry === country) &&
      groupedContacts[country].length > 0,
  );

  if (!hasVisibleContacts && hasLoadedOnce && !error) {
    return <p>No contacts found.</p>;
  }

  return (
    <div className={styles.scrollContainer}>
      {error && (
        <p className={styles.errorBanner} role="alert">
          Error: {error}
        </p>
      )}
      <ul className={styles.contactList}>
        {sortedCountries.map((country) => {
          if (selectedCountry && selectedCountry !== country) return null;

          const countryContacts = groupedContacts[country].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
          );

          return (
            <li key={country} className={styles.countryGroup}>
              <h3
                className={clsx(styles.countryHeading, {
                  [styles.unknownHeading]: country === "Unknown",
                })}
              >
                {country === "Unknown" ? "❓" : countryToEmoji(country)}
                <span className={styles.countryBadge}>
                  {country === "Unknown" ? "Unknown" : country}
                </span>
              </h3>

              <AnimatePresence>
                {countryContacts.map(({ id, name, number }) => (
                  <Motion.div
                    key={id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Contact
                      id={id}
                      name={name}
                      number={number}
                      onDeleteContact={() => dispatch(deleteContact(id))}
                    />
                  </Motion.div>
                ))}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
