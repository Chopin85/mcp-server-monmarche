// Shared primitive types
export interface Attribute {
  id: string;
  key: string;
  label: string;
  value: string;
  valueUnit: string;
}

export interface Format {
  id: string;
  ratio: number;
  transforms: Transform[];
}

export interface Transform {
  type: string;
  w: number;
  h: number;
  x: number;
  y: number;
}

export interface Image {
  id: string;
  name: string;
  alt: string;
  url: string;
  formats: Format[];
}

export interface Pricing {
  sellPrices: SellPrices;
}

export interface SellPrices {
  perGranularity: PerGranularity;
  perPiece: PerPiece;
  perWeightUnit: PerWeightUnit;
}

export interface PerGranularity {
  net: number;
  dutyFree: number;
  unit: string;
  pieces: number;
  currency: string;
  main: boolean;
  alternative: boolean;
}

export interface PerPiece {
  net: number;
  dutyFree: number;
  currency: string;
  main: boolean;
  alternative: boolean;
}

export interface PerWeightUnit {
  net: number;
  dutyFree: number;
  unit: string;
  value: number;
  currency: string;
  main: boolean;
  alternative: boolean;
}

export interface WeightPrice {
  weight: number;
  freeWeight: number;
  unitPrice: number;
  unit: string;
}

export interface ItemDefinition {
  type: string;
  terminology: Terminology;
  weight: Weight;
}

export interface Terminology {
  singular: string;
  plural: string;
}

export interface Weight {
  value: number;
  unit: string;
}

export interface Granularity {
  singular: string;
  plural: string;
}

// ProductSearchResponse
export interface ProductSearchResponse {
  count: number;
  items: Item[];
  algoVersion: string;
}

export interface Item {
  type: string;
  id: string;
  canonicalId: string;
  sku: string;
  availableQuantity: number;
  attributes: Attribute[];
  labels: Label[];
  shortDescription?: string;
  name: string;
  slug: string;
  pricing: Pricing;
  images: Image[];
  weightPrice?: WeightPrice;
  itemDefinition: ItemDefinition;
  itemPrice: number;
  pimCategoryName: string;
  packSize: number;
  indexes: Indexes;
  consumptionDate?: number;
  origin?: string;
  rating?: Rating;
}

export interface Label {
  id: string;
  label: string;
  images: Image[];
}

export interface Indexes {
  global: number;
  byType: number;
}

export interface Rating {
  average: number;
  nbRatings: number;
}

// Shared cart types
export interface Customer {
  email: string;
  id: string;
}

export interface Addresses {
  billing: Billing;
}

export interface Billing {
  usedForDelivery: boolean;
}

export interface Delivery {
  note: string;
  deliveryPrices: DeliveryPrice[];
  address: Address;
  shop: Shop;
  timeSlot: TimeSlot;
  timeSlotValidity: string;
  timeSlotStatus: string;
  mode: string;
  deliveryZone: DeliveryZone;
}

export interface DeliveryPrice {
  minCartNetPrice: number;
  shippingAmount: number;
}

export interface Address {
  addressComponents: AddressComponents;
  locationInfo: LocationInfo;
  formattedAddress: string;
  name: string;
  location: Location;
}

export interface AddressComponents {
  postalCode: string;
  countryCode: string;
  country: string;
  street: string;
  streetNumber: string;
  city: string;
}

export interface LocationInfo {
  formattedAddress: string;
  types: any[];
  locationType: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Shop {
  id: string;
  name: string;
  address: ShopAddress;
}

export interface ShopAddress {
  formattedAddress: string;
  location: ShopLocation;
}

export interface ShopLocation {
  lat: number;
  lng: number;
}

export interface TimeSlot {
  id: string;
  from: number;
  to: number;
  extraPrice: ExtraPrice;
  orderUntil: number;
  deliveryMode: string;
  deliveryPricesWithDeltas: DeliveryPricesWithDelta[];
  rate: Rate;
}

export interface ExtraPrice {
  dutyFree: number;
  currency: string;
}

export interface DeliveryPricesWithDelta {
  minCartNetPrice: number;
  shippingAmount: number;
}

export interface Rate {
  delta: number;
  deltaDay: number;
  deltaSlot: number;
  total: number;
}

export interface DeliveryZone {
  id: string;
  minOrderAmount: number;
  name: string;
  preferredTimeSlotSchedule: number;
  type: string;
}

export interface Quotation {
  editable: boolean;
  count: number;
  weight: number;
}

export interface Quotation2 {
  count: Count;
  weight: CartWeight;
  totals: Totals;
}

export interface Count {
  quantity: number;
  freeQuantity: number;
  itemDefinition: ItemDefinition;
  itemPrice: number;
}

export interface CartWeight {
  weight: number;
  freeWeight: number;
  unitPrice: number;
  unit: string;
}

export interface Totals {
  vatRate: number;
  netBeforeCoupons: number;
  dutyFree: number;
  vat: number;
  net: number;
  promoSavings: number;
  preauthorization: number;
  source: string;
}

export interface Quotation3 {
  dutyFree: number;
  shipping: number;
  preauthorization: number;
  vat: number;
  currency: string;
  preparationFee: number;
  deltaDay: number;
  deltaSlot: number;
  net: number;
  discount: number;
  promoSavings: number;
}

export interface Fee {
  code: string;
  vatRate: number;
  vat: number;
}

export interface Loyalty {
  points: number;
}

export interface CartPrice {
  quotation: Quotation3;
  fees: Fee[];
}

export interface CartProduct {
  type: string;
  articleParents: any[];
  canonicalId: string;
  id: string;
  sku: string;
  name: string;
  pimCategoryName: string;
  slug: string;
  attributes: Attribute[];
  availableQuantity: number;
  granularity: Granularity;
  images: Image[];
  shortDescription: string;
  pricing: Pricing;
  quotation: Quotation;
  packSize: number;
  quotation2: Quotation2;
  itemDefinition: ItemDefinition;
  itemPrice: number;
}

// AddToCartResponse / CartResponse
export interface AddToCartResponse {
  id: string;
  customer: Customer;
  addresses: Addresses;
  delivery: Delivery;
  coupons: any[];
  products: CartProduct[];
  price: CartPrice;
  minOrderAmountReached: boolean;
  replaceMissingProducts: boolean;
  loyalty: Loyalty;
}

export interface CartResponse {
  id: string;
  customer: Customer;
  addresses: Addresses;
  delivery: Delivery;
  coupons: any[];
  products: CartProduct[];
  price: CartPrice;
  minOrderAmountReached: boolean;
  replaceMissingProducts: boolean;
  loyalty: Loyalty;
}

// ArticleDetailBySlug
export interface ArticleDetailResponse {
  description: string;
  type: string;
  id: string;
  canonicalId: string;
  sku: string;
  availableQuantity: number;
  labels: any[];
  attributes: Attribute[];
  granularity: Granularity;
  name: string;
  slug: string;
  seo: Seo;
  shortDescription: string;
  articleParents: any[];
  pricing: Pricing;
  images: Image[];
  itemPrice: number;
  weightPrice: WeightPrice;
  itemDefinition: ItemDefinition;
  relatedArticles: any[];
  pimCategoryName: string;
  breadcrumbs: Breadcrumb[];
  packSize: number;
  enabled: boolean;
}

export interface Seo {
  mode: string;
}

export interface Breadcrumb {
  id: string;
  name: string;
  enabled: boolean;
  slug: string;
}

// LoginResponse
export interface LoginResponse {
  error?: string;
  message?: string;
  status?: string;
}
