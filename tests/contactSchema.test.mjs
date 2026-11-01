import assert from "node:assert/strict";
import test from "node:test";
import { contactSchema } from "../src/utils/contactSchema.js";

test("accepts a valid contact with an international number", async () => {
  const values = { name: "Anna Petrova", number: "+46 70 123 45 67" };
  assert.deepEqual(await contactSchema.validate(values), values);
});

test("accepts Ukrainian names and hyphenated surnames", async () => {
  const values = { name: "Анна-Марія", number: "+380 67 123 4567" };
  assert.deepEqual(await contactSchema.validate(values), values);
});

test("requires a name", async () => {
  await assert.rejects(
    contactSchema.validate({ name: "", number: "+46 70 123 45 67" }),
    /Name is required/,
  );
});

test("rejects invalid characters in a name", async () => {
  await assert.rejects(
    contactSchema.validate({ name: "Anna123", number: "+46 70 123 45 67" }),
    /Name must contain only letters/,
  );
});

test("rejects a short phone number", async () => {
  await assert.rejects(
    contactSchema.validate({ name: "Anna", number: "123" }),
    /Invalid phone number format/,
  );
});

test("requires a phone number", async () => {
  await assert.rejects(
    contactSchema.validate({ name: "Anna", number: "" }),
    /Phone number is required/,
  );
});
