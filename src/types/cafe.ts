export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'IN_KITCHEN'
  | 'SERVED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ORDER_PLACED'
  | 'PREPARING'
  | 'READY';

export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';

export type SessionStatus = 'OPEN' | 'BILL_GENERATED' | 'CLOSED';

export interface DiningSession {
  id: string; // e.g. 'DS-1001'
  tableId: string;
  tableNumber: number;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TableInfo {
  id: string; // e.g., 'T01'
  tableNumber: number; // e.g., 1
  name: string; // e.g., 'Table 01'
  token: string; // Secure random token
  qrCodeUrl: string; // Full URL or relative path to scan
  capacity: number;
  status: TableStatus;
  activeSession?: DiningSession;
}

export interface MenuItemOption {
  name: string; // e.g., 'Choice of Pasta', 'Flavors'
  choices: {
    name: string;
    extraPrice?: number;
  }[];
}

export interface MenuItemAddOn {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  isVeg: boolean;
  options?: MenuItemOption[];
  addOns?: MenuItemAddOn[];
  image?: string;
  popular?: boolean;
  isAvailable?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  page: number; // PDF page reference
}

export interface CartItem {
  id: string; // Unique cart item ID (composite with options)
  menuItemId: string;
  name: string;
  category: string;
  price: number;
  unitPrice?: number;
  itemTotal?: number;
  quantity: number;
  selectedOptions?: { [key: string]: string };
  selectedAddOns?: string[];
  specialInstructions?: string;
}

export interface CustomerDetails {
  name: string;
  mobile: string;
  specialInstructions?: string;
}

export interface Order {
  id: string; // e.g., 'VV-1001'
  cafeId: string;
  tableId: string;
  tableNumber: number;
  diningSessionId?: string;
  sessionToken: string;
  customerName: string;
  customerMobile: string;
  specialInstructions?: string;
  items: CartItem[];
  subtotal: number;
  tax: number; // 5% GST
  discountPercentage?: number;
  discountAmount?: number;
  extraCharge?: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  sessionStatus?: SessionStatus;
  billGenerated?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CafeDetails {
  id: string;
  name: string;
  hindiName: string;
  tagline: string;
  address: string;
  phone: string;
  gstin: string;
  currency: string;
  taxRate: number; // 0.05
}

export interface BillData {
  billNumber: string;
  orderId?: string;
  diningSessionId?: string;
  orderIds?: string[];
  billType?: string;
  sessionStatus?: SessionStatus;
  tableStatus?: TableStatus;
  cafe: CafeDetails;
  tableNumber: number;
  customerName: string;
  customerMobile: string;
  specialInstructions?: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
  }[];
  subtotal: number;
  cgst: number;
  sgst: number;
  taxAmount: number;
  discountPercentage?: number;
  discountAmount?: number;
  extraCharge?: number;
  total: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

