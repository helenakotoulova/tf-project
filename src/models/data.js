export const columns = [
  { title: "First name", field: "firstName" },
  { title: "Last name", field: "lastName" },
  {
    title: "Day of birth",
    field: "birthday",
    type: "date",
    dateSetting: {
      locale: "en-GB",
      format: "dd/MM/yyyy",
    },
  },
  {
    title: "Superability",
    field: "superability",
  },
];

export const FIREBASE_DOMAIN =
  "https://techfides-project-default-rtdb.firebaseio.com";
