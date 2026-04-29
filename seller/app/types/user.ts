import type { Company } from "./company";

export interface User {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  preferredLanguage: string,
  verificationCode: string,
  telephone: string,
  formOfAddress: string,
  expireAt: string,
  company: Company
}