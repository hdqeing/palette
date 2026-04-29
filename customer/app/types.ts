// ─── Company & Employee ────────────────────────────────────────────────────

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
  germanyPickUp: boolean;
  euPickUp: boolean;
  germanyDeliver: boolean;
  euDeliver: boolean;
  seller: boolean;
  shipping: boolean;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  preferredLanguage: string;
  telephone: string | null;
  salutation: string | null;
  messages: any[];
  emailNotificationEnabled: boolean;
  username: string | null;
  company: Company | null;
  admin: boolean;
}

export interface CreateEmployeeForm {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  preferredLanguage: string;
  telephone: string;
  salutation: string;
  companyId: number | null;
}

// ─── Pallets ───────────────────────────────────────────────────────────────

/**
 * Rich pallet sort — includes dimensions, url, owner.
 * Used in catalogue/list contexts.
 */
export interface PaletteSort {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  url: string;
  owner: Company | null;
  private: boolean;
}

/**
 * Simplified pallet sort — just id and name.
 * Embedded inside detailed Pallet responses.
 */
export interface PalletSort {
  id: number;
  name: string;
}

/**
 * Lightweight pallet — used in cart and catalogue list views.
 */
export interface Palette {
  id: number;
  sort: PaletteSort;
  quality: string;
  url: string;
}

/**
 * Detailed pallet — used in query detail, stock, and pallet detail views.
 */
export interface Pallet {
  id: number;
  palletSort: PalletSort;
  boards: number;
  nails: number;
  blocks: number;
  length: number;
  width: number;
  height: number;
  name: string;
  safeWorkingLoad: number;
  weight: number;
  quality: string;
  url: string;
}

export interface QualitySubItem {
  id: number;
  quality: string;
  url: string;
}

export interface GroupedPallet {
  ids: number[];
  palletSort: PalletSort;
  boards: number;
  nails: number;
  blocks: number;
  length: number;
  width: number;
  height: number;
  name: string;
  safeWorkingLoad: number;
  weight: number;
  qualities: string[];
  qualityItems: QualitySubItem[];
}

// ─── Cart ──────────────────────────────────────────────────────────────────

export interface CartEntity {
  pallet: Pallet | null;
  quantity: number;
}

// ─── Queries ───────────────────────────────────────────────────────────────

export interface QueryCompany {
  id: number;
  title: string;
}

export interface QueryPalletItem {
  queryPalletId: number;
  pallet: Pallet;
  quantity: number;
}

export interface SellerQuote {
  queryPalletId: number;
  palletId: number;
  price: number;
  deadline: string | null;
  isLatest: boolean;
}

export interface QuerySeller {
  sellerId: number;
  sellerTitle: string;
  quotes: SellerQuote[];
  sum: number;
  accepted: boolean;
  rejected: boolean;
}

export interface QueryDetail {
  id: number;
  deadline: string | null;
  isClosed: boolean | null;
  buyer: QueryCompany;
  pallets: QueryPalletItem[];
  sellers: QuerySeller[];
}

// ─── Stocks ────────────────────────────────────────────────────────────────

export interface StockPhoto {
  id: number;
  blobName: string;
}

export interface PalletStock {
  id: number;
  quantity: number;
  price: number;
  company: Company;
  pallet: Pallet;
  photos: StockPhoto[];
}

export interface StockSummary {
  sellerCount: number;
  totalQuantity: number;
  minPrice: number | null;
}