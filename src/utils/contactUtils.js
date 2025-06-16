import { parsePhoneNumberFromString } from "libphonenumber-js";

export function getCountryKey(number) {
  const parsed = parsePhoneNumberFromString(number);
  return parsed?.country || "Unknown";
}

export function groupContactsByCountry(contacts) {
  return contacts.reduce((acc, contact) => {
    const country = getCountryKey(contact.number);
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(contact);
    return acc;
  }, {});
}

export function countryToEmoji(countryCode) {
  return countryCode
    ?.toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function getCountryInfo(number) {
  try {
    const parsed = parsePhoneNumberFromString(number);
    if (parsed) {
      return {
        country: parsed.country,
        callingCode: parsed.countryCallingCode,
      };
    }
  } catch {
    return null;
  }
  return null;
}
