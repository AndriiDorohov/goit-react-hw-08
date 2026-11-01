import { object, string } from "yup";

// Shared by the create and inline-edit forms, so the same contact values
// are accepted in both places.
export const contactSchema = object({
  name: string()
    .matches(
      /^[a-zA-Zа-яА-ЯіІїЇєЄёЁ'’\- ]{2,}$/,
      "Name must contain only letters and be at least 2 characters",
    )
    .required("Name is required"),
  number: string()
    .matches(/^\+?[0-9\s-]{7,20}$/, "Invalid phone number format")
    .required("Phone number is required"),
});
