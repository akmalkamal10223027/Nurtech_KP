export const rgxRequired = {
  regex: /.+/,
  msg: { required: "field-required" },
};
export const rgxNumbOnly = {
  regex: /^[0-9]+$/,
  msg: { invaid: "number-only" },
};
export const rgxEmail = {
  regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  msg: {
    required: "email-required",
    invalid: "email-invalid",
  },
};
