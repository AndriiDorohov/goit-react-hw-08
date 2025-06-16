import { createSelector } from "@reduxjs/toolkit";

export const selectContacts = (state) => state.contacts.items;
export const selectIsLoading = (state) => state.contacts.loading;
export const selectError = (state) => state.contacts.error;
export const selectFilter = (state) => state.filters.name;

export const selectFilteredContacts = createSelector(
  [selectContacts, selectFilter],
  (contacts, filter) => {
    const normalizedFilter = filter.toLowerCase();

    return contacts
      .filter(
        (contact) =>
          contact.name?.toLowerCase().includes(normalizedFilter) ||
          contact.number?.toLowerCase().includes(normalizedFilter),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  },
);
