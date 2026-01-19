export const isAdmin = () => {
  return localStorage.getItem("role") === "admin";
};

export const isStaff = () => {
  return localStorage.getItem("role") === "staff";
};

export const isCustomer = () => {
  return localStorage.getItem("role") === "customer";
};
