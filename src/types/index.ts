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
  images: Image2[];
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

export interface Attribute {
  id: string;
  key: string;
  label: string;
  value: string;
  valueUnit: string;
}

export interface Label {
  id: string;
  label: string;
  images: Image[];
}

export interface Image {
  name: string;
  url: string;
  id: string;
  alt: string;
  formats: Format[];
}

export interface Format {
  id: string;
  transforms: any[];
  ratio: number;
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

export interface Image2 {
  id: string;
  name: string;
  alt: string;
  url: string;
  formats: Format2[];
}

export interface Format2 {
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

export interface Indexes {
  global: number;
  byType: number;
}

export interface Rating {
  average: number;
  nbRatings: number;
}

// AddToCartResponse
export interface AddToCartResponse {
  id: string;
  customer: Customer;
  addresses: Addresses;
  delivery: Delivery;
  coupons: any[];
  products: Product[];
  price: Price;
  minOrderAmountReached: boolean;
  replaceMissingProducts: boolean;
  loyalty: Loyalty;
}

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
  address: Address2;
}

export interface Address2 {
  formattedAddress: string;
  location: Location2;
}

export interface Location2 {
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

export interface Product {
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
  itemDefinition: ItemDefinition2;
  itemPrice: number;
}

export interface Attribute {
  id: string;
  key: string;
  label: string;
  value: string;
  valueUnit: string;
}

export interface Granularity {
  singular: string;
  plural: string;
}

export interface Image {
  id: string;
  url: string;
  name: string;
  alt: string;
  formats: Format[];
}

export interface Format {
  id: string;
  ratio: number;
  transforms: any[];
}

export interface Transform {
  type: string;
  w: number;
  h: number;
  x: number;
  y: number;
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
  alternative: boolean;
  currency: string;
  dutyFree: number;
  main: boolean;
  net: number;
  pieces: number;
  unit: string;
}

export interface PerPiece {
  alternative: boolean;
  currency: string;
  dutyFree: number;
  main: boolean;
  net: number;
}

export interface PerWeightUnit {
  alternative: boolean;
  currency: string;
  dutyFree: number;
  main: boolean;
  net: number;
  unit: string;
  value: number;
}

export interface Quotation {
  editable: boolean;
  count: number;
  weight: number;
}

export interface Quotation2 {
  count: Count;
  weight: Weight2;
  totals: Totals;
}

export interface Count {
  quantity: number;
  freeQuantity: number;
  itemDefinition: ItemDefinition;
  itemPrice: number;
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

export interface Weight2 {
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

export interface ItemDefinition2 {
  type: string;
  terminology: Terminology2;
  weight: Weight3;
}

export interface Terminology2 {
  singular: string;
  plural: string;
}

export interface Weight3 {
  value: number;
  unit: string;
}

export interface Price {
  quotation: Quotation3;
  fees: Fee[];
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

export interface Attribute {
  id: string;
  key: string;
  label: string;
  valueUnit: string;
  value: string;
}

export interface Granularity {
  singular: string;
  plural: string;
}

export interface Seo {
  mode: string;
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

export interface Image {
  id: string;
  name: string;
  alt: string;
  url: string;
  formats: Format[];
}

export interface Format {
  id: string;
  ratio: number;
  transforms: any[];
}

export interface Transform {
  type: string;
  w: number;
  h: number;
  x: number;
  y: number;
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

export interface Breadcrumb {
  id: string;
  name: string;
  enabled: boolean;
  slug: string;
}

// CartResponse
export interface CartResponse {
  id: string;
  customer: Customer;
  addresses: Addresses;
  delivery: Delivery;
  coupons: any[];
  products: Product[];
  price: Price;
  minOrderAmountReached: boolean;
  replaceMissingProducts: boolean;
  loyalty: Loyalty;
}

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
  address: Address2;
}

export interface Address2 {
  formattedAddress: string;
  location: Location2;
}

export interface Location2 {
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

export interface Product {
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
  itemDefinition: ItemDefinition2;
  itemPrice: number;
}

export interface Attribute {
  id: string;
  key: string;
  label: string;
  value: string;
  valueUnit: string;
}

export interface Granularity {
  singular: string;
  plural: string;
}

export interface Image {
  id: string;
  url: string;
  name: string;
  alt: string;
  formats: Format[];
}

export interface Format {
  id: string;
  ratio: number;
  transforms: any[];
}

export interface Transform {
  type: string;
  w: number;
  h: number;
  x: number;
  y: number;
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
  alternative: boolean;
  currency: string;
  dutyFree: number;
  main: boolean;
  net: number;
  pieces: number;
  unit: string;
}

export interface PerPiece {
  alternative: boolean;
  currency: string;
  dutyFree: number;
  main: boolean;
  net: number;
}

export interface PerWeightUnit {
  alternative: boolean;
  currency: string;
  dutyFree: number;
  main: boolean;
  net: number;
  unit: string;
  value: number;
}

export interface Quotation {
  editable: boolean;
  count: number;
  weight: number;
}

export interface Quotation2 {
  count: Count;
  weight: Weight2;
  totals: Totals;
}

export interface Count {
  quantity: number;
  freeQuantity: number;
  itemDefinition: ItemDefinition;
  itemPrice: number;
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

export interface Weight2 {
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

export interface ItemDefinition2 {
  type: string;
  terminology: Terminology2;
  weight: Weight3;
}

export interface Terminology2 {
  singular: string;
  plural: string;
}

export interface Weight3 {
  value: number;
  unit: string;
}

export interface Price {
  quotation: Quotation3;
  fees: Fee[];
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

export interface LoginResponse {
  error?: string;
  message?: string;
  status?: string;
}
