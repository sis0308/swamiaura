import { CustomerOrder } from '../types';

export const INITIAL_ORDERS: CustomerOrder[] = [
  {
    id: 'ord-1001',
    orderNumber: 'TZ-849201',
    createdAt: '2026-09-02T18:30:00.000Z',
    status: 'pending',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98450 12345',
    customerEmail: 'aarav.sharma@gmail.com',
    shippingAddress: {
      address: 'Flat 402, Green Glen Layout, Bellandur',
      landmark: 'Near EcoSpace Tech Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103'
    },
    paymentMethod: 'cod',
    items: [
      {
        productId: 'prod-1',
        productName: 'Midnight Black Heavyweight Oversized T-Shirt',
        productImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
        size: 'L',
        color: 'Midnight Black',
        quantity: 2,
        unitPrice: 699,
        totalPrice: 1398,
        gsm: 240
      },
      {
        productId: 'prod-3',
        productName: 'Minimalist Minimal Typography Graphic Tee',
        productImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
        size: 'XL',
        color: 'Cream Vintage',
        quantity: 1,
        unitPrice: 599,
        totalPrice: 599,
        gsm: 220
      }
    ],
    subtotal: 1997,
    discountAmount: 599,
    shippingFee: 0,
    grandTotal: 1398,
    couponCode: 'TEEZOON30',
    orderNotes: 'Please ring the doorbell and leave with security if unavailable.'
  },
  {
    id: 'ord-1002',
    orderNumber: 'TZ-673192',
    createdAt: '2026-09-01T14:15:00.000Z',
    status: 'processing',
    customerName: 'Priya Sundaram',
    customerPhone: '+91 97890 54321',
    customerEmail: 'priya.sundaram@outlook.com',
    shippingAddress: {
      address: 'House No. 18, 4th Cross, 2nd Main, Indiranagar',
      landmark: 'Behind Metro Station',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    paymentMethod: 'upi',
    items: [
      {
        productId: 'prod-2',
        productName: 'Classic Piqué Collared Polo T-Shirt',
        productImage: 'https://images.unsplash.com/photo-1625910513413-56254c46fdf7?auto=format&fit=crop&w=1000&q=80',
        size: 'M',
        color: 'Navy Blue',
        quantity: 1,
        unitPrice: 899,
        totalPrice: 899,
        gsm: 230
      }
    ],
    subtotal: 899,
    discountAmount: 270,
    shippingFee: 79,
    grandTotal: 708,
    couponCode: 'SWAMI30',
    orderNotes: 'UPI Payment verified on 01-Sep'
  },
  {
    id: 'ord-1003',
    orderNumber: 'SWAMI-512847',
    createdAt: '2026-08-30T10:45:00.000Z',
    status: 'shipped',
    customerName: 'Rohan Mehra',
    customerPhone: '+91 99100 87654',
    customerEmail: 'rohan.mehra@techcorp.in',
    shippingAddress: {
      address: 'B-1204, Lodha Bellissimo, NM Joshi Marg, Lower Parel',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400013'
    },
    paymentMethod: 'upi',
    items: [
      {
        productId: 'prod-5',
        productName: 'Luxury Pima Combed Crew Neck Regular T-Shirt',
        productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
        size: 'L',
        color: 'Pure White',
        quantity: 2,
        unitPrice: 599,
        totalPrice: 1198,
        gsm: 200
      },
      {
        productId: 'prod-1',
        productName: 'Midnight Black Heavyweight Oversized T-Shirt',
        productImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
        size: 'L',
        color: 'Charcoal Grey',
        quantity: 1,
        unitPrice: 699,
        totalPrice: 699,
        gsm: 240
      }
    ],
    subtotal: 1897,
    discountAmount: 569,
    shippingFee: 0,
    grandTotal: 1328,
    couponCode: 'TEEZOON30',
    trackingNumber: 'BLRD-EXP-8839210',
    orderNotes: 'BlueDart Express shipment dispatched.'
  },
  {
    id: 'ord-1004',
    orderNumber: 'TZ-449102',
    createdAt: '2026-08-28T09:20:00.000Z',
    status: 'delivered',
    customerName: 'Ananya Verma',
    customerPhone: '+91 98112 34567',
    customerEmail: 'ananya.verma94@gmail.com',
    shippingAddress: {
      address: 'Tower 3, Apt 801, Jaypee Greens Wishtown',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201304'
    },
    paymentMethod: 'cod',
    items: [
      {
        productId: 'prod-6',
        productName: 'Vintage Washed Acid Drop Shoulder Tee',
        productImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
        size: 'S',
        color: 'Acid Washed Grey',
        quantity: 1,
        unitPrice: 799,
        totalPrice: 799,
        gsm: 260
      }
    ],
    subtotal: 799,
    discountAmount: 240,
    shippingFee: 79,
    grandTotal: 638,
    couponCode: 'TEEZOON30',
    trackingNumber: 'DELV-IND-40912',
    orderNotes: 'Delivered and cash collected successfully.'
  }
];
