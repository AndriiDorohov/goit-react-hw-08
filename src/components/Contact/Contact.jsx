import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  IoPerson,
  IoSaveOutline,
  IoCloseOutline,
  IoPencil,
  IoTrash,
  IoCopyOutline,
  IoCall,
} from "react-icons/io5";
import { BsFillTelephoneFill } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { ValidationError } from "yup";
import { updateContact } from "../../redux/contacts/operations";
import IconButton from "../IconButton/IconButton";
import Card from "../Card/Card";
import { getCountryInfo, countryToEmoji } from "../../utils/contactUtils";
import { contactSchema } from "../../utils/contactSchema";
import styles from "./Contact.module.css";

export default function Contact({ id, name, number, onDeleteContact }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newNumber, setNewNumber] = useState(number);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState(null);
  const [showCallOptions, setShowCallOptions] = useState(false);

  const menuRef = useRef(null);
  const savingRef = useRef(false);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowCallOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const startEditing = () => {
    setNewName(name);
    setNewNumber(number);
    setEditError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (savingRef.current) return;
    setNewName(name);
    setNewNumber(number);
    setEditError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    // A synchronous ref prevents repeated clicks from creating concurrent PATCHes.
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);
    setEditError(null);

    try {
      const updatedData = await contactSchema.validate({
        name: newName.trim(),
        number: newNumber.trim(),
      });

      await dispatch(updateContact({ id, updatedData })).unwrap();
      toast.success("Contact updated.");
      setIsEditing(false);
    } catch (error) {
      if (error instanceof ValidationError) {
        setEditError(error.errors[0] || "Please check the contact details.");
      } else {
        setEditError("Unable to save. Please try again.");
        toast.error("Failed to update contact.");
      }
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDeleteContact(id);
      toast.success("Contact deleted.");
    } catch {
      toast.error("Failed to delete contact.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(number);
    toast.success("Number copied to clipboard.");
  };

  const openMessagingApp = (app) => {
    const sanitizedNumber = number.replace(/\D/g, "");
    let url = "";

    switch (app) {
      case "viber":
        url = `viber://chat?number=%2B${sanitizedNumber}`;
        break;
      case "telegram":
        url = `https://t.me/+${sanitizedNumber}`;
        break;
      case "whatsapp":
        url = `https://wa.me/${sanitizedNumber}`;
        break;
      default:
        return;
    }

    window.open(url, "_blank");
    setShowCallOptions(false);
  };

  const { country } = getCountryInfo(number) || {};

  return (
    <Card className={styles.contactItem}>
      {isEditing ? (
        <div className={styles.row}>
          <input
            className={styles.input}
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setEditError(null);
            }}
            placeholder="Name"
            disabled={isSaving}
            aria-label="Name"
          />
          <input
            className={styles.input}
            value={newNumber}
            onChange={(e) => {
              setNewNumber(e.target.value);
              setEditError(null);
            }}
            placeholder="Number"
            disabled={isSaving}
            aria-label="Number"
          />
        </div>
      ) : (
        <div className={styles.row}>
          <div className={styles.cellName}>
            <IoPerson className={`${styles.icon} ${styles.userIcon}`} />
            {name}
          </div>
          <div className={styles.cellPhone}>
            <BsFillTelephoneFill
              className={`${styles.icon} ${styles.phoneIcon}`}
            />
            {country && (
              <>
                {countryToEmoji(country)}
                <span className={styles.countryCode}>{country}</span>
              </>
            )}
            {number}
          </div>
          <div className={styles.buttons}>
            {isMobile ? (
              <IconButton
                onClick={() => (window.location.href = `tel:${number}`)}
                variant="call"
                ariaLabel="Call number"
                title="Call"
              >
                <IoCall />
              </IconButton>
            ) : (
              <div className={styles.callMenuWrapper} ref={menuRef}>
                <IconButton
                  onClick={() => setShowCallOptions((prev) => !prev)}
                  variant="call"
                  ariaLabel="Open call options"
                  title="Call options"
                >
                  <IoCall />
                </IconButton>
                {showCallOptions && (
                  <div className={styles.callOptions}>
                    <button onClick={() => openMessagingApp("viber")}>
                      Viber
                    </button>
                    <button onClick={() => openMessagingApp("telegram")}>
                      Telegram
                    </button>
                    <button onClick={() => openMessagingApp("whatsapp")}>
                      WhatsApp
                    </button>
                  </div>
                )}
              </div>
            )}

            <IconButton
              onClick={handleCopy}
              variant="iconCopy"
              ariaLabel="Copy number"
              title="Copy"
            >
              <IoCopyOutline />
            </IconButton>
            <IconButton
              onClick={startEditing}
              variant="edit"
              ariaLabel="Edit"
              title="Edit"
            >
              <IoPencil />
            </IconButton>
            <IconButton
              onClick={handleDelete}
              variant="delete"
              ariaLabel="Delete"
              title="Delete"
            >
              <IoTrash />
            </IconButton>
          </div>
        </div>
      )}

      {isEditing && (
        <>
          {editError && (
            <p className={styles.editError} role="alert">
              {editError}
            </p>
          )}
          <div className={styles.buttons}>
            {isSaving && <span role="status">Saving...</span>}
            <IconButton
              onClick={handleSave}
              variant="save"
              ariaLabel="Save"
              title="Save"
              disabled={isSaving}
            >
              <IoSaveOutline />
            </IconButton>
            <IconButton
              onClick={cancelEditing}
              variant="cancel"
              ariaLabel="Cancel"
              title="Cancel"
              disabled={isSaving}
            >
              <IoCloseOutline />
            </IconButton>
          </div>
        </>
      )}
    </Card>
  );
}
