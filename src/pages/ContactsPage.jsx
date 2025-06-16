import { useState } from "react";
import ContactForm from "../components/ContactForm/ContactForm";
import SearchBox from "../components/SearchBox/SearchBox";
import ContactList from "../components/ContactList/ContactList";
import SidebarFilters from "../components/SidebarFilters/SidebarFilters";
import styles from "./ContactsPage.module.css";

export default function ContactsPage() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <div className={styles.container}>
      <div className={styles.scrollContainer}>
        <aside className={styles.sidebar}>
          <ContactForm />
          <SearchBox />
          <SidebarFilters
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />
        </aside>
      </div>
      <section className={styles.main}>
        <ContactList selectedCountry={selectedCountry} />
      </section>
    </div>
  );
}
