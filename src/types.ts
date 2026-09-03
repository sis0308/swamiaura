export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  discount: number; // percentage, e.g. 30
  images: string[];
  colors: {
    name: string;
    hex: string;
    imageIndex?: number;
  }[];
  sizes: string[];
  rating: number;
  reviewsCount: number;
  description: string;
  fabric: string;
  fit: string;
  sleeve: 'Half Sleeve' | 'Full Sleeve' | 'Sleeveless';
  neckType: 'Round Neck' | 'Polo Neck' | 'V Neck' | 'Oversized Ribbed';
  gsm: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isOffer?: boolean;
  stock: number;
  tags: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  image: string;
  productCount: number;
  badge?: string;
}

export interface CartItem {
  cartItemId: string; // generated unique id: `${product.id}-${size}-${color}`
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  rating: number | null;
  onlyNew: boolean;
  onlyBestSeller: boolean;
  onlyOffers: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'best-selling';
  searchQuery: string;
}

export interface OrderDetails {
  customerName: string;
  mobileNumber: string;
  email: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'cod' | 'upi' | 'whatsapp';
  orderNotes?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  highlight?: string;
}

export interface CustomerOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  gsm?: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: {
    address: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'cod' | 'upi' | 'whatsapp';
  items: CustomerOrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  grandTotal: number;
  couponCode?: string;
  orderNotes?: string;
  trackingNumber?: string;
  notesFromAdmin?: string;
  cancellationReason?: string;
  cancelledAt?: string;
}

export interface AdminSession {
  email: string;
  isAuthenticated: boolean;
  loginTimestamp?: number;
}
