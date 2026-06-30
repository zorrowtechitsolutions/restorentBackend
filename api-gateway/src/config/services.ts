import { env } from "./env";

export const SERVICES = {
  USER_SERVICE: env.USER_SERVICE_URL,
  COMPANY_SERVICE: env.COMPANY_SERVICE_URL,
  ITEMS_SERVICE: env.ITEMS_SERVICE_URL,
  ROLE_SERVICE: env.ROLE_SERVICE_URL,
  HR_SERVICE: env.HR_SERVICE_URL,
};

if (!SERVICES.USER_SERVICE) {
  throw new Error("USER_SERVICE_URL not defined");
}

if (!SERVICES.COMPANY_SERVICE) {
  throw new Error("COMPANY_SERVICE_URL not defined");
}

if (!SERVICES.ITEMS_SERVICE) {
  throw new Error("ITEMS_SERVICE_URL not defined");
}

if (!SERVICES.ROLE_SERVICE) {
  throw new Error("ROLE_SERVICE_URL not defined");
}

if (!SERVICES.HR_SERVICE) {
  throw new Error("HR_SERVICE_URL not defined");
}
