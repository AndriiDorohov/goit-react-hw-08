import { useDispatch, useSelector } from "react-redux";
import { selectFilter } from "../../redux/filters/selectors";
import { changeFilter } from "../../redux/filters/slice";
import { FiSearch } from "react-icons/fi";
import { BsMic } from "react-icons/bs";
import { useRef } from "react";
import styles from "./SearchBox.module.css";

export default function SearchBox() {
  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);
  const recognitionRef = useRef(null);

  const handleChange = (e) => {
    dispatch(changeFilter(e.target.value));
  };

  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        dispatch(changeFilter(transcript));
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event);
      };
    }

    recognitionRef.current.start();
  };

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="search">
        Find contacts by name
      </label>
      <div className={styles.searchBox}>
        <FiSearch className={styles.icon} />
        <input
          id="search"
          type="text"
          className={styles.input}
          value={filter}
          onChange={handleChange}
          placeholder="Type a name..."
        />
        <button
          type="button"
          className={styles.micButton}
          onClick={handleMicClick}
        >
          <BsMic />
        </button>
      </div>
    </div>
  );
}
