type Nullable<T> = T | null;

export interface Company {
  id: number;
  title: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  homepage: string;
  vat: string;
  verified: boolean;
  shipping: boolean;
  seller: boolean;
  euDeliver: boolean;
  germanyPickUp: boolean;
  euPickUp: boolean;
  germanyDeliver: boolean;
}

export interface Employee {
  id: number;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  email: string;
  preferredLanguage: Nullable<string>;
  telephone: Nullable<string>;
  salutation: Nullable<string>;
  messages: unknown[];
  emailNotificationEnabled: boolean;
  username: Nullable<string>;
  company: Nullable<Company>;
  admin: boolean;
}

export interface PalletSort {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  owner: Nullable<Company>;
  private: boolean
}

export interface CreateEmployeeForm {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    preferredLanguage: string;
    telephone: string;
    salutation: string;
    companyId: number;
}

export interface UpdateEmployeeForm {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    telephone: string;
    preferredLanguage: string;
    companyId: number | null;
    salutation: string;
}

export interface CreateCompanyForm {
  title: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  homepage: string;
  vat: string;
  shipping: boolean;
  seller: boolean;
  euDeliver: boolean;
  germanyPickUp: boolean;
  euPickUp: boolean;
  germanyDeliver: boolean;
}

export interface UpdateCompanyForm {
  title: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  homepage: string;
  vat: string;
  shipping: boolean;
  seller: boolean;
  euDeliver: boolean;
  germanyPickUp: boolean;
  euPickUp: boolean;
  germanyDeliver: boolean;
}