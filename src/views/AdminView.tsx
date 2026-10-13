import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { Product, CustomerOrder, OrderStatus, CustomerReview, DeliveryDetails, Category } from '../types';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  LogOut,
  ShoppingBag,
  Package,
  Plus,
  FolderPlus,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  X,
  Phone,
  MessageCircle,
  ExternalLink,
  Edit2,
  Trash2,
  Tag,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  DollarSign,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  Key,
  SlidersHorizontal,
  ChevronDown,
  Palette,
  Layers,
  Copy,
  Sparkles,
  Ban,
  RotateCcw,
  AlertTriangle,
  Info,
  Video,
  Play,
  Pause,
  RotateCw,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { compressImageFile } from '../utils/imageCompressor';

const DEFAULT_FABRIC_SPECS = [
  '240 GSM heavy combed single jersey / French Terry knit structure.',
  'Bio-washed with natural organic enzymes to eliminate fuzz and pilling.',
  'Silicone softened for extra handfeel smoothness.',
  'Color-fast reactive dyeing resistant to bleeding or sun fading.',
  'Pre-shrunk treatment ensuring minimal dimensional change after wash.'
];

const DEFAULT_SAMPLE_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Vikram S.',
    rating: 5,
    date: '2 days ago',
    comment: 'The 240 GSM weight is incredible. The drop shoulder fits properly boxy without looking bulky. Will buy other colors!',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Aarav M.',
    rating: 5,
    date: '1 week ago',
    comment: 'Pure luxury. Better than foreign fast-fashion brands that charge ₹3,000 for standard cotton. Highly recommended.',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Rohan K.',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Collar retains its shape even after multiple machine washes. Best cotton t-shirt in this price bracket.',
    verified: true
  }
];

// Preset Editorial T-Shirt Images for quick selection when adding/updating photos
const PRESET_TSHIRT_PHOTOS = [
  {
    name: 'Oversized Washed Charcoal',
    url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Clean Pure White Crew',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Vintage Graphic Print',
    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Classic Piqué Polo Navy',
    url: 'https://images.unsplash.com/photo-1625910513413-56254c46fdf7?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Pitch Black Heavy Cotton',
    url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Earth Olive Drop-Shoulder',
    url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Vintage Maroon Relaxed',
    url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Minimal Heather Grey',
    url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80'
  }
];

// Popular T-shirt sizes for quick selection and adding available sizes
const POPULAR_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', 'Free Size'];

// Preset popular T-shirt garment colors
const PRESET_COLORS = [
  { name: 'Midnight Black', hex: '#111111' },
  { name: 'Pure Off White', hex: '#F3F4F6' },
  { name: 'Charcoal Slate', hex: '#374151' },
  { name: 'Vintage Navy', hex: '#1E3A8A' },
  { name: 'Sage Olive', hex: '#556B2F' },
  { name: 'Crimson Maroon', hex: '#881337' },
  { name: 'Earth Sand', hex: '#D2B48C' },
  { name: 'Lavender Mist', hex: '#E9D5FF' },
  { name: 'Dusty Rose', hex: '#BE185D' },
  { name: 'Forest Green', hex: '#14532D' },
  { name: 'Mocha Brown', hex: '#582F0E' },
  { name: 'Heather Grey', hex: '#9CA3AF' }
];

// Cancellation reason presets for Admin Order Cancel Option
const CANCELLATION_REASONS = [
  'Customer requested cancellation via Call/WhatsApp',
  'Out of stock / Production fabric delay',
  'Customer unreachable / Unconfirmed phone number',
  'Incorrect or undeliverable shipping address',
  'Duplicate or fake order detected',
  'Payment verification failed / Order rejected',
  'Other (Custom reason)'
];

// Preset category cover photos for quick selection
const PRESET_CATEGORY_IMAGES = [
  { name: 'Oversized Streetwear', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80' },
  { name: 'Classic Crew Neck', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pique Polo', url: 'https://images.unsplash.com/photo-1625910513413-56254c46fdf7?auto=format&fit=crop&w=800&q=80' },
  { name: 'Graphic Art Tee', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Minimalist Plain', url: 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=800&q=80' },
  { name: 'Athletic Sports', url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80' },
  { name: 'Heavyweight Drop', url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80' },
  { name: 'Acid Washed Vintage', url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80' }
];

export const AdminView: React.FC = () => {
  const {
    isFirebaseConnected,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategories,
    orders,
    updateOrderStatus,
    cancelOrder,
    deleteOrder,
    adminSession,
    adminLoginStep,
    pendingAdminEmail,
    activeOtp,
    otpCooldown,
    submitAdminCredentials,
    verifyAdminOtp,
    resendAdminOtp,
    cancelAdminLogin,
    adminLogout
  } = useStore();

  const { navigateTo, showToast } = useCart();

  // Auth Form State
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'stats'>('orders');

  // Categories Filter & Modal State
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    image: PRESET_CATEGORY_IMAGES[0].url,
    badge: 'New Drop'
  });

  // Orders Filter & Search
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<CustomerOrder | null>(null);

  // Products Filter & Search
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Product Modal (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productModalTab, setProductModalTab] = useState<'photos' | 'details' | 'fabric' | 'delivery' | 'reviews'>('photos');
  const [adminRollIndex, setAdminRollIndex] = useState(0);
  const [isAdminAutoRolling, setIsAdminAutoRolling] = useState(false);

  // Quick Price Edit Modal
  const [quickPriceProduct, setQuickPriceProduct] = useState<Product | null>(null);
  const [quickNewPrice, setQuickNewPrice] = useState<number>(0);
  const [quickNewOriginalPrice, setQuickNewOriginalPrice] = useState<number>(0);

  // Quick Rename Modal
  const [quickRenameProduct, setQuickRenameProduct] = useState<Product | null>(null);
  const [quickNewName, setQuickNewName] = useState<string>('');

  // Quick Photo Modal
  const [quickPhotoProduct, setQuickPhotoProduct] = useState<Product | null>(null);
  const [quickNewPhotoUrl, setQuickNewPhotoUrl] = useState<string>('');

  // Quick Sizes Modal
  const [quickSizesProduct, setQuickSizesProduct] = useState<Product | null>(null);
  const [quickSizesList, setQuickSizesList] = useState<string[]>([]);
  const [quickSizesCustomInput, setQuickSizesCustomInput] = useState<string>('');

  // Order Cancellation Modal State
  const [cancelModalOrder, setCancelModalOrder] = useState<CustomerOrder | null>(null);
  const [cancelReasonPreset, setCancelReasonPreset] = useState<string>(
    'Customer requested cancellation via Call/WhatsApp'
  );
  const [cancelReasonCustom, setCancelReasonCustom] = useState<string>('');
  const [cancelNotifyWhatsApp, setCancelNotifyWhatsApp] = useState<boolean>(true);

  // Product Deletion Confirmation Modal State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Category Deletion Confirmation Modal State
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Oversized T-Shirts',
    categorySlug: 'oversized',
    price: 699,
    originalPrice: 999,
    images: [
      PRESET_TSHIRT_PHOTOS[0].url,
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
    ] as string[],
    imageUrl: '', // For input field to add new image
    video: '',
    videoThumbnail: '',
    gsm: 240,
    fabric: '100% Super Combed French Terry Cotton (240 GSM)',
    fit: 'Relaxed Drop-Shoulder Oversized Fit',
    sleeve: 'Half Sleeve' as const,
    neckType: 'Oversized Ribbed' as const,
    description: 'Ultra-heavy bio-washed combed cotton with dense drape, reinforced flatlock seams, and non-sagging ribbed collar.',
    stock: 50,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'] as string[],
    newCustomSize: '',
    colors: [] as { name: string; hex: string; imageIndex?: number; image?: string }[],
    newColorName: '',
    newColorHex: '#374151',
    newColorImageIndex: 0,
    isNew: true,
    isBestSeller: false,
    isOffer: true,
    fabricSpecs: [...DEFAULT_FABRIC_SPECS] as string[],
    newFabricSpec: '',
    deliveryDetails: {
      standardDelivery: '2 to 4 business days across India.',
      shippingPolicy: 'Free Shipping on all prepaid & COD orders over ₹999.',
      returnPolicy: '7-Day Returns & Exchanges: Instant door-step exchange if you need a different size or fit.',
      codAvailable: true
    },
    rating: 4.8,
    reviewsCount: 240,
    customerReviews: [...DEFAULT_SAMPLE_REVIEWS] as CustomerReview[],
    newReviewAuthor: '',
    newReviewRating: 5,
    newReviewDate: '2 days ago',
    newReviewComment: '',
    newReviewVerified: true
  });

  // Handle Credentials Submit (Direct Login, No OTP Required)
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const result = submitAdminCredentials(adminId, adminPass);
    if (result.success) {
      showToast('Admin Access Granted', 'Welcome to the TEEZOON Executive Portal', 'success');
    } else {
      setAuthError(result.message);
    }
  };

  // Handle OTP Submit
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const result = verifyAdminOtp(otpInput);
    if (result.success) {
      showToast('Admin Access Granted', 'Welcome to the TEEZOON Executive Portal', 'success');
    } else {
      setAuthError(result.message);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = () => {
    const result = resendAdminOtp();
    if (result.success) {
      showToast('New Security Code', `OTP: ${result.otp}`, 'info');
      setOtpInput(result.otp || '');
    } else {
      showToast('Cooldown Active', result.message, 'error');
    }
  };

  // Open Add Product Modal
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductModalTab('details');
    setProductForm({
      name: '',
      category: 'Oversized T-Shirts',
      categorySlug: 'oversized',
      price: 699,
      originalPrice: 999,
      images: [
        PRESET_TSHIRT_PHOTOS[0].url,
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
      ],
      imageUrl: '',
      video: '',
      videoThumbnail: '',
      gsm: 240,
      fabric: '100% Super Combed French Terry Cotton (240 GSM)',
      fit: 'Relaxed Drop-Shoulder Oversized Fit',
      sleeve: 'Half Sleeve',
      neckType: 'Oversized Ribbed',
      description: 'Ultra-heavy bio-washed combed cotton with dense drape, reinforced flatlock seams, and non-sagging ribbed collar.',
      stock: 50,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      newCustomSize: '',
      colors: [],
      newColorName: '',
      newColorHex: '#374151',
      newColorImageIndex: 0,
      isNew: true,
      isBestSeller: false,
      isOffer: true,
      fabricSpecs: [...DEFAULT_FABRIC_SPECS],
      newFabricSpec: '',
      deliveryDetails: {
        standardDelivery: '2 to 4 business days across India.',
        shippingPolicy: 'Free Shipping on all prepaid & COD orders over ₹999.',
        returnPolicy: '7-Day Returns & Exchanges: Instant door-step exchange if you need a different size or fit.',
        codAvailable: true
      },
      rating: 4.8,
      reviewsCount: 240,
      customerReviews: [...DEFAULT_SAMPLE_REVIEWS],
      newReviewAuthor: '',
      newReviewRating: 5,
      newReviewDate: '2 days ago',
      newReviewComment: '',
      newReviewVerified: true
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const openEditProductModal = (
    product: Product,
    initialTab: 'photos' | 'details' | 'fabric' | 'delivery' | 'reviews' = 'details'
  ) => {
    setEditingProduct(product);
    setProductModalTab(initialTab);
    setAdminRollIndex(0);
    setIsAdminAutoRolling(false);
    setProductForm({
      name: product.name,
      category: product.category,
      categorySlug: product.categorySlug,
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images && product.images.length > 0 ? [...product.images] : [PRESET_TSHIRT_PHOTOS[0].url],
      imageUrl: '',
      video: product.video || '',
      videoThumbnail: product.videoThumbnail || '',
      gsm: product.gsm,
      fabric: product.fabric,
      fit: product.fit,
      sleeve: product.sleeve,
      neckType: product.neckType,
      description: product.description,
      stock: product.stock,
      sizes: [...product.sizes],
      newCustomSize: '',
      colors: product.colors && product.colors.length > 0
        ? product.colors.map((c, idx) => ({
            name: c.name,
            hex: c.hex,
            imageIndex: c.imageIndex !== undefined ? c.imageIndex : idx < product.images.length ? idx : 0,
            image: c.image
          }))
        : [],
      newColorName: '',
      newColorHex: '#374151',
      newColorImageIndex: 0,
      isNew: !!product.isNew,
      isBestSeller: !!product.isBestSeller,
      isOffer: !!product.isOffer,
      fabricSpecs: product.fabricSpecs && product.fabricSpecs.length > 0
        ? [...product.fabricSpecs]
        : [...DEFAULT_FABRIC_SPECS],
      newFabricSpec: '',
      deliveryDetails: {
        standardDelivery: product.deliveryDetails?.standardDelivery || '2 to 4 business days across India.',
        shippingPolicy: product.deliveryDetails?.shippingPolicy || 'Free Shipping on all prepaid & COD orders over ₹999.',
        returnPolicy: product.deliveryDetails?.returnPolicy || '7-Day Returns & Exchanges: Instant door-step exchange if you need a different size or fit.',
        codAvailable: product.deliveryDetails?.codAvailable !== false
      },
      rating: product.rating || 4.8,
      reviewsCount: product.reviewsCount || 240,
      customerReviews: product.customerReviews && product.customerReviews.length > 0
        ? [...product.customerReviews]
        : [...DEFAULT_SAMPLE_REVIEWS],
      newReviewAuthor: '',
      newReviewRating: 5,
      newReviewDate: '2 days ago',
      newReviewComment: '',
      newReviewVerified: true
    });
    setIsProductModalOpen(true);
  };

  // Image Management Handlers
  const handleAddImageUrl = (urlCandidate?: string) => {
    const url = (urlCandidate || productForm.imageUrl).trim();
    if (!url) {
      showToast('Image URL Required', 'Please enter a valid image web URL.', 'error');
      return;
    }
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.includes(url) ? prev.images : [...prev.images, url],
      imageUrl: ''
    }));
    showToast('Photo Added', 'Image added to T-Shirt gallery.', 'success');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (productForm.images.length <= 1) {
      showToast('Required Photo', 'At least one photo must be present for each T-Shirt.', 'error');
      return;
    }
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
    showToast('Photo Removed', 'Image removed from gallery.', 'info');
  };

  const handleSetMainCoverImage = (indexToMain: number) => {
    setProductForm((prev) => {
      const target = prev.images[indexToMain];
      const rest = prev.images.filter((_, idx) => idx !== indexToMain);
      return {
        ...prev,
        images: [target, ...rest]
      };
    });
    showToast('Cover Updated', 'Selected photo is now the primary store cover photo.', 'success');
  };

  const handleMoveImage = (fromIdx: number, direction: 'left' | 'right') => {
    setProductForm((prev) => {
      const toIdx = direction === 'left' ? fromIdx - 1 : fromIdx + 1;
      if (toIdx < 0 || toIdx >= prev.images.length) return prev;
      const newImgs = [...prev.images];
      const temp = newImgs[fromIdx];
      newImgs[fromIdx] = newImgs[toIdx];
      newImgs[toIdx] = temp;
      return { ...prev, images: newImgs };
    });
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await compressImageFile(file);
        setProductForm((prev) => ({
          ...prev,
          images: [optimized, ...prev.images.filter((img) => img !== optimized)]
        }));
        showToast('Image Uploaded', 'Custom photo optimized & set as primary cover!', 'success');
      } catch (err) {
        console.error('Failed to process image file:', err);
        showToast('Image Error', 'Could not process uploaded image file', 'error');
      }
    }
  };

  // Fabric Specs Handlers
  const handleAddFabricSpec = () => {
    if (!productForm.newFabricSpec.trim()) return;
    setProductForm((prev) => ({
      ...prev,
      fabricSpecs: [...prev.fabricSpecs, prev.newFabricSpec.trim()],
      newFabricSpec: ''
    }));
    showToast('Specification Added', 'New fabric bullet point added.', 'success');
  };

  const handleRemoveFabricSpec = (idxToRemove: number) => {
    setProductForm((prev) => ({
      ...prev,
      fabricSpecs: prev.fabricSpecs.filter((_, i) => i !== idxToRemove)
    }));
  };

  const handleResetFabricSpecs = () => {
    setProductForm((prev) => ({
      ...prev,
      fabricSpecs: [...DEFAULT_FABRIC_SPECS]
    }));
    showToast('Fabric Specs Reset', 'Reset to 5 combed cotton standard points.', 'info');
  };

  // Delivery Details Handlers
  const handleResetDeliveryPolicy = () => {
    setProductForm((prev) => ({
      ...prev,
      deliveryDetails: {
        standardDelivery: '2 to 4 business days across India.',
        shippingPolicy: 'Free Shipping on all prepaid & COD orders over ₹999.',
        returnPolicy: '7-Day Returns & Exchanges: Instant door-step exchange if you need a different size or fit.',
        codAvailable: true
      }
    }));
    showToast('Delivery Policy Reset', 'Reset to default pan-India shipping policy.', 'info');
  };

  // Customer Reviews Handlers
  const handleAddProductReview = () => {
    if (!productForm.newReviewAuthor.trim()) {
      showToast('Reviewer Name Required', 'Please enter customer name', 'error');
      return;
    }
    if (!productForm.newReviewComment.trim()) {
      showToast('Comment Required', 'Please enter customer review feedback', 'error');
      return;
    }
    const rev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: productForm.newReviewAuthor.trim(),
      rating: Number(productForm.newReviewRating) || 5,
      date: productForm.newReviewDate.trim() || 'Just now',
      comment: productForm.newReviewComment.trim(),
      verified: productForm.newReviewVerified
    };
    setProductForm((prev) => ({
      ...prev,
      customerReviews: [rev, ...prev.customerReviews],
      reviewsCount: prev.reviewsCount + 1,
      newReviewAuthor: '',
      newReviewComment: ''
    }));
    showToast('Review Added', `Verified review by ${rev.author} added to product.`, 'success');
  };

  const handleRemoveProductReview = (revId: string) => {
    setProductForm((prev) => ({
      ...prev,
      customerReviews: prev.customerReviews.filter((r) => r.id !== revId),
      reviewsCount: Math.max(1, prev.reviewsCount - 1)
    }));
    showToast('Review Removed', 'Review deleted from product.', 'info');
  };

  const handleSet240ReviewsPreset = () => {
    setProductForm((prev) => ({
      ...prev,
      reviewsCount: 240,
      rating: 4.8,
      customerReviews: [
        {
          id: `rev-${Date.now()}-1`,
          author: 'Vikram Sharma',
          rating: 5,
          date: '2 days ago',
          comment: 'The 240 GSM weight is incredible. The drop shoulder fits properly boxy without looking bulky. Will buy other colors!',
          verified: true
        },
        {
          id: `rev-${Date.now()}-2`,
          author: 'Aarav Mehta',
          rating: 5,
          date: '1 week ago',
          comment: 'Pure luxury. Better than foreign fast-fashion brands that charge ₹3,000 for standard cotton. Highly recommended.',
          verified: true
        },
        {
          id: `rev-${Date.now()}-3`,
          author: 'Rohan Kulkarni',
          rating: 5,
          date: '2 weeks ago',
          comment: 'Collar retains its shape even after multiple machine washes. Best cotton t-shirt in this price bracket.',
          verified: true
        },
        {
          id: `rev-${Date.now()}-4`,
          author: 'Sameer Sen',
          rating: 5,
          date: '3 weeks ago',
          comment: 'Dense French Terry knit drape is top tier. Zero color fade on 1st wash.',
          verified: true
        }
      ]
    }));
    showToast('240 Reviews Configured', 'Reviews count set to 240 with 4.8 rating & verified customer comments.', 'success');
  };

  // Size Management Handlers
  const handleToggleSize = (size: string) => {
    setProductForm((prev) => {
      const exists = prev.sizes.includes(size);
      if (exists && prev.sizes.length <= 1) {
        showToast('Size Required', 'At least 1 size must remain available.', 'error');
        return prev;
      }
      const updated = exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size];
      return { ...prev, sizes: updated };
    });
  };

  const handleAddCustomSize = (sizeCandidate?: string) => {
    const raw = (sizeCandidate || productForm.newCustomSize).trim().toUpperCase();
    if (!raw) return;
    setProductForm((prev) => {
      if (prev.sizes.includes(raw)) {
        showToast('Already Available', `Size ${raw} is already active for this product.`, 'info');
        return prev;
      }
      return {
        ...prev,
        sizes: [...prev.sizes, raw],
        newCustomSize: ''
      };
    });
    showToast('Size Added', `Size ${raw} is now available in store.`, 'success');
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    if (productForm.sizes.length <= 1) {
      showToast('Size Required', 'At least 1 size must remain available.', 'error');
      return;
    }
    setProductForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== sizeToRemove)
    }));
  };

  // Color Management Handlers
  const handleAddPresetColor = (preset: { name: string; hex: string }) => {
    setProductForm((prev) => {
      if (prev.colors.some((c) => c.name.toLowerCase() === preset.name.toLowerCase())) {
        showToast('Color Exists', `${preset.name} is already in your color options.`, 'info');
        return prev;
      }
      const chosenImgIndex =
        prev.newColorImageIndex !== undefined && prev.newColorImageIndex < prev.images.length
          ? prev.newColorImageIndex
          : prev.colors.length < prev.images.length
          ? prev.colors.length
          : 0;
      return {
        ...prev,
        colors: [...prev.colors, { ...preset, imageIndex: chosenImgIndex }]
      };
    });
    showToast('Color Added', `${preset.name} added and linked to Photo #${(productForm.newColorImageIndex ?? 0) + 1}.`, 'success');
  };

  const handleAddCustomColor = () => {
    const name = productForm.newColorName.trim();
    if (!name) {
      showToast('Color Name Required', 'Please enter a name for the new color option.', 'error');
      return;
    }
    const hex = productForm.newColorHex || '#111111';
    const chosenImgIndex =
      productForm.newColorImageIndex !== undefined && productForm.newColorImageIndex < productForm.images.length
        ? productForm.newColorImageIndex
        : productForm.colors.length < productForm.images.length
        ? productForm.colors.length
        : 0;

    setProductForm((prev) => {
      if (prev.colors.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
        showToast('Color Exists', `Color "${name}" is already in your color options.`, 'info');
        return prev;
      }
      return {
        ...prev,
        colors: [...prev.colors, { name, hex, imageIndex: chosenImgIndex }],
        newColorName: ''
      };
    });
    showToast('Color Added', `Color "${name}" added and linked to Photo #${chosenImgIndex + 1}.`, 'success');
  };

  const handleAssignColorImage = (colorIdx: number, imageIndex: number) => {
    setProductForm((prev) => ({
      ...prev,
      colors: prev.colors.map((c, idx) => (idx === colorIdx ? { ...c, imageIndex } : c))
    }));
    showToast('Photo Linked', `Color "${productForm.colors[colorIdx]?.name}" linked to Photo #${imageIndex + 1}.`, 'info');
  };

  const handleRemoveColor = (indexToRemove: number) => {
    setProductForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleClearAllColors = () => {
    setProductForm((prev) => ({
      ...prev,
      colors: []
    }));
    showToast('Colors Cleared', 'All color variants removed (single tone product).', 'info');
  };

  // Save Product (Add or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showToast('Product Name Required', 'Please provide a title for the T-Shirt.', 'error');
      return;
    }
    if (productForm.price <= 0) {
      showToast('Invalid Price', 'Price must be greater than ₹0.', 'error');
      return;
    }
    if (productForm.images.length === 0) {
      showToast('Photo Required', 'Please add at least one photo for this T-Shirt.', 'error');
      return;
    }
    if (productForm.sizes.length === 0) {
      showToast('Sizes Required', 'Please select at least one available size.', 'error');
      return;
    }

    const discount =
      productForm.originalPrice > productForm.price
        ? Math.round(((productForm.originalPrice - productForm.price) / productForm.originalPrice) * 100)
        : 0;

    const matchedCat = categories.find((c) => c.name === productForm.category);
    const categorySlug = matchedCat ? matchedCat.slug : productForm.categorySlug || 'cotton';

    if (editingProduct) {
      // Update
      const updated: Product = {
        ...editingProduct,
        name: productForm.name.trim(),
        category: productForm.category,
        categorySlug,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        discount,
        images: [...productForm.images],
        gsm: Number(productForm.gsm),
        fabric: productForm.fabric,
        fit: productForm.fit,
        sleeve: productForm.sleeve,
        neckType: productForm.neckType,
        description: productForm.description,
        stock: Number(productForm.stock),
        sizes: productForm.sizes,
        colors: productForm.colors,
        isNew: productForm.isNew,
        isBestSeller: productForm.isBestSeller,
        isOffer: productForm.isOffer,
        video: productForm.video?.trim() || undefined,
        videoThumbnail: productForm.videoThumbnail?.trim() || undefined,
        fabricSpecs: productForm.fabricSpecs,
        deliveryDetails: productForm.deliveryDetails,
        customerReviews: productForm.customerReviews,
        rating: Number(productForm.rating) || 4.8,
        reviewsCount: Number(productForm.reviewsCount) || 240
      };
      updateProduct(updated);
      showToast('Product Updated', `${updated.name} has been updated in live shop.`, 'success');
    } else {
      // Create new
      const created = addProduct({
        name: productForm.name.trim(),
        category: productForm.category,
        categorySlug,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        discount,
        images: [...productForm.images],
        gsm: Number(productForm.gsm),
        fabric: productForm.fabric,
        fit: productForm.fit,
        sleeve: productForm.sleeve,
        neckType: productForm.neckType,
        description: productForm.description,
        stock: Number(productForm.stock),
        sizes: productForm.sizes,
        colors: productForm.colors,
        rating: Number(productForm.rating) || 4.8,
        reviewsCount: Number(productForm.reviewsCount) || 240,
        isNew: productForm.isNew,
        isBestSeller: productForm.isBestSeller,
        isOffer: productForm.isOffer,
        tags: [categorySlug, 'new-drop', 'tshirt'],
        video: productForm.video?.trim() || undefined,
        videoThumbnail: productForm.videoThumbnail?.trim() || undefined,
        fabricSpecs: productForm.fabricSpecs,
        deliveryDetails: productForm.deliveryDetails,
        customerReviews: productForm.customerReviews
      });
      showToast('T-Shirt Added!', `${created.name} is now live on the customer website!`, 'success');
    }

    setIsProductModalOpen(false);
  };

  // Quick Price Update
  const handleQuickPriceSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPriceProduct) return;

    const discount =
      quickNewOriginalPrice > quickNewPrice
        ? Math.round(((quickNewOriginalPrice - quickNewPrice) / quickNewOriginalPrice) * 100)
        : 0;

    const updated: Product = {
      ...quickPriceProduct,
      price: Number(quickNewPrice),
      originalPrice: Number(quickNewOriginalPrice),
      discount
    };

    updateProduct(updated);
    showToast('Price Updated', `${updated.name} price changed to ₹${updated.price}`, 'success');
    setQuickPriceProduct(null);
  };

  // Quick Rename Update
  const handleQuickRenameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRenameProduct || !quickNewName.trim()) return;

    const updated: Product = {
      ...quickRenameProduct,
      name: quickNewName.trim()
    };

    updateProduct(updated);
    showToast('Name Updated', `Renamed to "${updated.name}"`, 'success');
    setQuickRenameProduct(null);
  };

  // Quick Photo Update
  const handleQuickPhotoSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPhotoProduct || !quickNewPhotoUrl.trim()) return;

    const restImages = quickPhotoProduct.images.filter((img) => img !== quickNewPhotoUrl.trim());
    const updated: Product = {
      ...quickPhotoProduct,
      images: [quickNewPhotoUrl.trim(), ...restImages]
    };

    updateProduct(updated);
    showToast('Cover Photo Updated', `Primary photo updated for ${updated.name}`, 'success');
    setQuickPhotoProduct(null);
  };

  // Quick Sizes Update
  const handleQuickSizesSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSizesProduct || quickSizesList.length === 0) {
      showToast('Sizes Required', 'Please choose at least 1 size.', 'error');
      return;
    }

    const updated: Product = {
      ...quickSizesProduct,
      sizes: [...quickSizesList]
    };

    updateProduct(updated);
    showToast('Sizes Updated', `Available sizes updated for ${updated.name}`, 'success');
    setQuickSizesProduct(null);
  };

  // Order Cancellation Handler
  const handleConfirmCancelOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cancelModalOrder) return;

    const finalReason =
      cancelReasonPreset === 'Other (Custom reason)'
        ? (cancelReasonCustom.trim() || 'Cancelled by Store Admin')
        : cancelReasonPreset;

    cancelOrder(cancelModalOrder.id, finalReason);

    // If detail modal is currently open for this order, update local state too
    if (selectedOrderForDetail && selectedOrderForDetail.id === cancelModalOrder.id) {
      setSelectedOrderForDetail({
        ...selectedOrderForDetail,
        status: 'cancelled',
        cancellationReason: finalReason,
        cancelledAt: new Date().toISOString()
      });
    }

    showToast(
      'Order Cancelled',
      `Order #${cancelModalOrder.orderNumber} has been marked as cancelled`,
      'info'
    );

    // Notify buyer via WhatsApp if option checked
    if (cancelNotifyWhatsApp) {
      const rawPhone = cancelModalOrder.customerPhone.replace(/\D/g, '');
      const waMsg = `Hello ${cancelModalOrder.customerName},\nThis is TEEZOON regarding your Order #${cancelModalOrder.orderNumber}.\n\nYour order has been CANCELLED.\nReason: ${finalReason}\nOrder Total: ₹${cancelModalOrder.grandTotal.toLocaleString('en-IN')}\n\nIf you have questions, require a refund or want to place a new order, feel free to reply directly to this message.\n\nTeam TEEZOON`;
      window.open(`https://wa.me/${rawPhone}?text=${encodeURIComponent(waMsg)}`, '_blank');
    }

    setCancelModalOrder(null);
    setCancelReasonCustom('');
  };

  // Reopen Cancelled Order to Pending
  const handleReopenOrder = (order: CustomerOrder) => {
    updateOrderStatus(order.id, 'pending');
    if (selectedOrderForDetail && selectedOrderForDetail.id === order.id) {
      setSelectedOrderForDetail({
        ...selectedOrderForDetail,
        status: 'pending'
      });
    }
    showToast('Order Reopened', `Order #${order.orderNumber} moved back to Pending`, 'success');
  };

  // Category Collection Handlers
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      slug: '',
      shortDescription: '',
      image: PRESET_CATEGORY_IMAGES[0].url,
      badge: 'New Drop'
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      shortDescription: cat.shortDescription || '',
      image: cat.image,
      badge: cat.badge || ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('Name Required', 'Please enter a category collection name.', 'error');
      return;
    }
    const autoSlug =
      categoryForm.slug.trim() ||
      categoryForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: categoryForm.name.trim(),
        slug: autoSlug,
        shortDescription: categoryForm.shortDescription.trim(),
        image: categoryForm.image.trim() || PRESET_CATEGORY_IMAGES[0].url,
        badge: categoryForm.badge.trim() || undefined
      });
      showToast('Category Updated', `Updated "${categoryForm.name}" collection`, 'success');
    } else {
      const created = addCategory({
        name: categoryForm.name.trim(),
        slug: autoSlug,
        shortDescription: categoryForm.shortDescription.trim(),
        image: categoryForm.image.trim() || PRESET_CATEGORY_IMAGES[0].url,
        badge: categoryForm.badge.trim() || undefined,
        productCount: 0
      });
      showToast('Category Created', `Added "${created.name}" collection`, 'success');
      // If currently editing product, also auto-assign it
      if (isProductModalOpen) {
        setProductForm((prev) => ({
          ...prev,
          category: created.name,
          categorySlug: created.slug
        }));
      }
    }
    setIsCategoryModalOpen(false);
  };

  const handleConfirmDeleteProduct = () => {
    if (!productToDelete) return;
    const { id, name } = productToDelete;
    deleteProduct(id);
    if (isProductModalOpen && editingProduct?.id === id) {
      setIsProductModalOpen(false);
      setEditingProduct(null);
    }
    setProductToDelete(null);
    showToast('T-Shirt Removed', `"${name}" deleted from catalog`, 'success');
  };

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    const { id, name } = categoryToDelete;
    deleteCategory(id);
    setCategoryToDelete(null);
    showToast('Category Removed', `"${name}" collection deleted`, 'info');
  };

  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await compressImageFile(file);
        setCategoryForm((prev) => ({ ...prev, image: optimized }));
        showToast('Image Loaded', 'Category cover photo optimized & ready to save!', 'success');
      } catch (err) {
        console.error('Failed to process category image:', err);
        showToast('Image Error', 'Could not process uploaded image', 'error');
      }
    }
  };

  // Filtered Categories
  const filteredCategories = categories.filter((c) => {
    const q = categorySearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.shortDescription && c.shortDescription.toLowerCase().includes(q)) ||
      (c.badge && c.badge.toLowerCase().includes(q))
    );
  });

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const query = orderSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      ord.orderNumber.toLowerCase().includes(query) ||
      ord.customerName.toLowerCase().includes(query) ||
      ord.customerPhone.toLowerCase().includes(query) ||
      ord.customerEmail.toLowerCase().includes(query) ||
      ord.shippingAddress.city.toLowerCase().includes(query) ||
      ord.shippingAddress.pincode.toLowerCase().includes(query);

    const matchesStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;

    return matchesQuery && matchesStatus;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const query = productSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.fabric.toLowerCase().includes(query);

    const matchesCategory =
      productCategoryFilter === 'all' ||
      p.categorySlug === productCategoryFilter ||
      p.category === productCategoryFilter;

    return matchesQuery && matchesCategory;
  });

  // Quick Analytics Calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.grandTotal, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const shippedOrdersCount = orders.filter((o) => o.status === 'shipped').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'delivered').length;

  // -------------------------------------------------------------
  // RENDER 1: AUTHENTICATION GATEWAY (DIRECT ID + PASSWORD, NO OTP)
  // -------------------------------------------------------------
  if (!adminSession?.isAuthenticated) {
    return (
      <div className="min-h-[85vh] bg-[#FAFAFA] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white border border-gray-200 shadow-xl p-6 sm:p-8 rounded-2xl">
          {/* Header */}
          <div className="text-center space-y-3 pb-5 border-b border-gray-100 flex flex-col items-center">
            <img
              src="/teezoon-logo-black-transparent.png"
              alt="Teezoon - m group of company"
              className="h-14 w-auto object-contain mx-auto"
              referrerPolicy="no-referrer"
            />
            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-bold font-mono">
              Executive Portal
            </p>
            <h1 className="text-2xl font-serif font-bold text-neutral-950 uppercase tracking-tight">
              TEEZOON Admin Portal
            </h1>
            <p className="text-xs text-neutral-500">
              Sign in with your Admin credentials to access the Executive Portal
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* ID & PASSWORD LOGIN FORM */}
          <form onSubmit={handleCredentialsSubmit} className="mt-5 space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-600 font-bold mb-1.5">
                Admin Email / ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="Enter Admin Email or ID"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-gray-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-black font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-600 font-bold">
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-neutral-500 hover:text-black flex items-center gap-1 font-mono"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full pl-9 pr-10 py-2.5 bg-neutral-50 border border-gray-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-black font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-950 hover:bg-black text-white py-3.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 rounded-xl shadow-md hover:scale-[1.01]"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sign In to Admin Portal</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/')}
              className="w-full text-center text-xs text-neutral-500 hover:text-black py-2 font-mono"
            >
              ← Return to Customer Storefront
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER 2: AUTHENTICATED EXECUTIVE ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 pb-20">
      {/* Top Admin Header Bar */}
      <div className="bg-[#111111] text-white border-b border-neutral-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/teezoon-logo-white-transparent.png"
              alt="Teezoon Logo"
              className="h-7 sm:h-8 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold tracking-wide uppercase text-sm">
                  TEEZOON Admin
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-mono px-1.5 py-0.2 border border-emerald-500/40 uppercase">
                  Protected Session
                </span>
                {isFirebaseConnected && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Firebase Firestore Live</span>
                  </span>
                )}
              </div>
              <p className="text-[10px] text-neutral-400 font-mono">
                Logged In: {adminSession.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('/')}
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 border border-neutral-700"
            >
              <Eye className="w-3 h-3" />
              <span>Customer Storefront</span>
            </button>

            <button
              onClick={adminLogout}
              className="bg-transparent hover:bg-rose-900/30 text-rose-300 hover:text-rose-200 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 border border-rose-800/60"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border ${
                activeTab === 'orders'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-neutral-600 border-gray-200 hover:border-black'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Customer Orders</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 ${
                  activeTab === 'orders' ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-black'
                }`}
              >
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border ${
                activeTab === 'products'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-neutral-600 border-gray-200 hover:border-black'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>T-Shirt Catalog</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 ${
                  activeTab === 'products' ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-black'
                }`}
              >
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border ${
                activeTab === 'categories'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-neutral-600 border-gray-200 hover:border-black'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Category Collection</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 ${
                  activeTab === 'categories' ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-black'
                }`}
              >
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border ${
                activeTab === 'stats'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-neutral-600 border-gray-200 hover:border-black'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Overview & Stats</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'categories' && (
              <button
                onClick={openAddCategoryModal}
                className="bg-black hover:bg-neutral-800 text-white px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add New Category</span>
              </button>
            )}

            {activeTab === 'products' && (
              <button
                onClick={openAddProductModal}
                className="bg-black hover:bg-neutral-800 text-white px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New T-Shirt</span>
              </button>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: CUSTOMER ORDERS MANAGEMENT                             */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search and Filters Bar */}
            <div className="bg-white border border-gray-200 p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="relative w-full lg:w-96">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Find customer by name, phone, email, order #..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-neutral-50 border border-gray-200 focus:outline-none focus:border-black font-mono"
                />
                {orderSearchQuery && (
                  <button
                    onClick={() => setOrderSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
                {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 text-[10px] uppercase font-mono font-bold border transition-colors whitespace-nowrap ${
                        orderStatusFilter === st
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-neutral-600 border-gray-200 hover:border-black'
                      }`}
                    >
                      {st} {st !== 'all' && `(${orders.filter((o) => o.status === st).length})`}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Orders List Table / Cards */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white border border-gray-200 p-12 text-center space-y-3">
                <Package className="w-10 h-10 text-neutral-300 mx-auto" />
                <h3 className="text-base font-bold text-neutral-900">No Orders Found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  No orders match your search criteria. Try adjusting the customer search query or status filter.
                </p>
                {orderSearchQuery && (
                  <button
                    onClick={() => setOrderSearchQuery('')}
                    className="text-xs font-bold text-black underline uppercase"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 hover:border-gray-400 transition-colors p-4 sm:p-5"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-neutral-950">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 border ${
                              order.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : order.status === 'processing'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : order.status === 'shipped'
                                ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                                : order.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        {/* Customer Information Preview */}
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 font-mono">
                          <span className="font-bold text-neutral-900">
                            Customer: {order.customerName}
                          </span>
                          <span>Phone: {order.customerPhone}</span>
                          <span>Email: {order.customerEmail}</span>
                          <span className="text-neutral-400">
                            Destination: {order.shippingAddress.city}, {order.shippingAddress.state} (
                            {order.shippingAddress.pincode})
                          </span>
                        </div>

                        {order.status === 'cancelled' && (
                          <div className="mt-2 inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2.5 py-1 text-[11px] font-mono text-rose-800">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>
                              <strong>Cancellation Reason:</strong>{' '}
                              {order.cancellationReason || 'Cancelled by Admin'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right side: Amount & Status Changer */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="text-right mr-1 sm:mr-2">
                          <p className="text-[10px] uppercase font-mono text-neutral-400">Grand Total</p>
                          <p className="font-mono font-bold text-base text-neutral-950">
                            ₹{order.grandTotal.toLocaleString('en-IN')}
                          </p>
                        </div>

                        {/* Quick Status Dropdown */}
                        <select
                          value={order.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as OrderStatus;
                            if (newStatus === 'cancelled') {
                              setCancelModalOrder(order);
                              setCancelReasonPreset('Customer requested cancellation via Call/WhatsApp');
                              setCancelReasonCustom('');
                            } else {
                              updateOrderStatus(order.id, newStatus);
                              showToast('Order Status Updated', `Marked as ${newStatus}`, 'success');
                            }
                          }}
                          className={`text-xs font-mono font-bold px-2 py-1.5 focus:outline-none border ${
                            order.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-neutral-50 text-neutral-900 border-gray-300 focus:border-black'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        {/* Order Cancel Option / Action Button */}
                        {order.status !== 'cancelled' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setCancelModalOrder(order);
                              setCancelReasonPreset('Customer requested cancellation via Call/WhatsApp');
                              setCancelReasonCustom('');
                            }}
                            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-300 hover:border-rose-400 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider font-mono transition-colors"
                            title="Cancel this order"
                          >
                            <Ban className="w-3.5 h-3.5 text-rose-600" />
                            <span>Cancel Order</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 px-2 py-1 text-[10px] font-bold font-mono uppercase">
                              <Ban className="w-3 h-3 text-rose-600" />
                              <span>Cancelled</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleReopenOrder(order)}
                              className="flex items-center gap-1 text-[10px] font-mono font-bold text-neutral-500 hover:text-black hover:underline px-1 py-0.5"
                              title="Reactivate / Reopen order to pending"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reopen</span>
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => setSelectedOrderForDetail(order)}
                          className="bg-black hover:bg-neutral-800 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider font-mono transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* Ordered Items Preview */}
                    <div className="pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-x-auto py-1">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-neutral-50 border border-gray-200 p-1.5 pr-3 shrink-0"
                          >
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-8 h-10 object-cover bg-neutral-200"
                            />
                            <div className="text-[11px] font-mono leading-tight">
                              <p className="font-bold text-neutral-900 max-w-[160px] truncate">
                                {item.productName}
                              </p>
                              <p className="text-neutral-500 text-[10px]">
                                Size: {item.size}{item.color ? ` · Color: ${item.color}` : ''} · Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick Contact & WhatsApp Buyer Auto */}
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hello ${order.customerName},\nThis is TEEZOON regarding your Order #${order.orderNumber}.\nStatus: ${order.status.toUpperCase()}\nTotal: ₹${order.grandTotal}\nItems: ${order.items.map(i => `${i.productName} (${i.size}, ${i.color}) x${i.quantity}`).join(', ')}.\nTracking: Your order has been registered in our system and is being processed!`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 text-[11px] font-mono font-bold tracking-tight transition-colors"
                          title="Direct WhatsApp Auto-Send to Buyer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                          <span>WhatsApp Buyer</span>
                        </a>

                        <a
                          href={`tel:${order.customerPhone}`}
                          className="p-1.5 border border-gray-200 hover:border-black text-neutral-700 hover:bg-neutral-50 transition-colors"
                          title={`Call Buyer: ${order.customerPhone}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: PRODUCTS & T-SHIRT CATALOG (ADD/EDIT/PRICES)           */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white border border-gray-200 p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="relative w-full lg:w-96">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="Search T-Shirt by name, fabric, style..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-neutral-50 border border-gray-200 focus:outline-none focus:border-black font-mono"
                />
                {productSearchQuery && (
                  <button
                    onClick={() => setProductSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 shrink-0">
                  Category:
                </span>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-neutral-50 border border-gray-200 px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-black"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid Table */}
            <div className="bg-white border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-gray-200 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                      <th className="py-3 px-4">T-Shirt Photo & Name</th>
                      <th className="py-3 px-4">Price Option Show</th>
                      <th className="py-3 px-4">Sizes Available</th>
                      <th className="py-3 px-4">Color Options</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-mono">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-neutral-50/70 transition-colors">
                        {/* Photo & Name with 1-click Quick Edit Options */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative group shrink-0">
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className="w-12 h-14 object-cover bg-neutral-200 border border-gray-200 shadow-xs"
                              />
                              <button
                                onClick={() => {
                                  setQuickPhotoProduct(prod);
                                  setQuickNewPhotoUrl(prod.images[0] || '');
                                }}
                                className="absolute inset-0 bg-black/70 text-white text-[9px] font-bold uppercase flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Change Main Photo"
                              >
                                <ImageIcon className="w-3.5 h-3.5 mb-0.5" />
                                <span>Change</span>
                              </button>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-neutral-900 line-clamp-1 max-w-xs font-sans text-sm">
                                  {prod.name}
                                </p>
                                <button
                                  onClick={() => {
                                    setQuickRenameProduct(prod);
                                    setQuickNewName(prod.name);
                                  }}
                                  className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-none transition-colors"
                                  title="Quick Rename T-Shirt"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-400">
                                <span>{prod.gsm} GSM</span>
                                <span>•</span>
                                <span>{prod.images.length} Photos</span>
                                {prod.isNew && (
                                  <span className="bg-black text-white px-1 py-0.2 text-[8px] font-bold">
                                    NEW
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Price Option Show */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-bold text-neutral-950 text-sm">
                                  ₹{prod.price}
                                </span>
                                {prod.originalPrice > prod.price && (
                                  <span className="text-[10px] text-neutral-400 line-through">
                                    ₹{prod.originalPrice}
                                  </span>
                                )}
                              </div>
                              {prod.discount > 0 && (
                                <span className="inline-block mt-0.5 text-[9px] font-bold text-rose-700 bg-rose-50 px-1 py-0.2 border border-rose-200">
                                  {prod.discount}% OFF
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setQuickPriceProduct(prod);
                                setQuickNewPrice(prod.price);
                                setQuickNewOriginalPrice(prod.originalPrice);
                              }}
                              className="p-1 text-neutral-400 hover:text-black border border-transparent hover:border-gray-300"
                              title="Quick Change Price"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Size Changes Option / Add this size available */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap max-w-[180px]">
                            {prod.sizes.map((s, idx) => (
                              <span
                                key={idx}
                                className="bg-neutral-100 text-neutral-800 border border-gray-200 text-[10px] font-bold px-1.5 py-0.5"
                              >
                                {s}
                              </span>
                            ))}
                            <button
                              onClick={() => {
                                setQuickSizesProduct(prod);
                                setQuickSizesList([...prod.sizes]);
                                setQuickSizesCustomInput('');
                              }}
                              className="text-[10px] text-neutral-500 hover:text-black underline font-bold"
                              title="Add or Change Available Sizes"
                            >
                              + Edit
                            </button>
                          </div>
                        </td>

                        {/* Color Option Show T-Shirts */}
                        <td className="py-3 px-4">
                          {prod.colors && prod.colors.length > 0 ? (
                            <div className="flex items-center gap-1.5 flex-wrap max-w-[160px]">
                              {prod.colors.map((c, idx) => (
                                <div
                                  key={idx}
                                  className="w-4 h-4 rounded-full border border-gray-300 shadow-xs cursor-help"
                                  style={{ backgroundColor: c.hex }}
                                  title={`${c.name} (${c.hex})`}
                                />
                              ))}
                              <span className="text-[10px] text-neutral-400 ml-1">
                                ({prod.colors.length})
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-neutral-400 font-mono italic">
                              None (Single Tone)
                            </span>
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-neutral-600">
                          <span className="bg-neutral-100 px-2 py-0.5 border border-gray-200 text-[11px]">
                            {prod.category}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4">
                          <span
                            className={`font-bold ${
                              prod.stock < 10 ? 'text-rose-600' : 'text-emerald-700'
                            }`}
                          >
                            {prod.stock} pcs
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex flex-col items-end gap-1.5">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditProductModal(prod, 'details')}
                                className="px-2.5 py-1.5 bg-neutral-900 hover:bg-black text-white text-[11px] font-bold uppercase transition-colors flex items-center gap-1 shadow-xs"
                                title="Edit All T-Shirt Options"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit All</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setProductToDelete(prod)}
                                className="p-1.5 border border-gray-200 hover:border-rose-600 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title={`Delete "${prod.name}"`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Options below per request: Photos, Details, Fabric & Specs, Delivery & Returns, Customer Reviews (240) */}
                            <div className="flex items-center gap-1 flex-wrap justify-end pt-0.5">
                              <button
                                type="button"
                                onClick={() => openEditProductModal(prod, 'photos')}
                                className="px-1.5 py-0.5 bg-neutral-100 hover:bg-black hover:text-white border border-gray-200 text-neutral-800 text-[9px] font-mono font-bold transition-colors flex items-center gap-1"
                                title="Edit Photos & 360° Roll"
                              >
                                <ImageIcon className="w-2.5 h-2.5" />
                                <span>Photos ({prod.images.length})</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => openEditProductModal(prod, 'details')}
                                className="px-1.5 py-0.5 bg-neutral-100 hover:bg-black hover:text-white border border-gray-200 text-neutral-800 text-[9px] font-mono font-bold transition-colors flex items-center gap-1"
                                title="Edit Product Details"
                              >
                                <span>Details</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => openEditProductModal(prod, 'fabric')}
                                className="px-1.5 py-0.5 bg-neutral-100 hover:bg-black hover:text-white border border-gray-200 text-neutral-800 text-[9px] font-mono font-bold transition-colors flex items-center gap-1"
                                title="Edit Fabric & Specifications"
                              >
                                <span>Fabric & Specs</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => openEditProductModal(prod, 'delivery')}
                                className="px-1.5 py-0.5 bg-neutral-100 hover:bg-black hover:text-white border border-gray-200 text-neutral-800 text-[9px] font-mono font-bold transition-colors flex items-center gap-1"
                                title="Edit Delivery & Returns Policy"
                              >
                                <span>Delivery</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => openEditProductModal(prod, 'reviews')}
                                className="px-1.5 py-0.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[9px] font-mono font-bold transition-colors flex items-center gap-1"
                                title="Edit Customer Reviews & Count"
                              >
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                <span>Reviews ({prod.reviewsCount || 240})</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: CATEGORY COLLECTION MANAGEMENT                         */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Header and Search Bar */}
            <div className="bg-white border border-gray-200 p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="relative w-full lg:w-96">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  placeholder="Search collections by name, badge, description..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-neutral-50 border border-gray-200 focus:outline-none focus:border-black font-mono"
                />
                {categorySearchQuery && (
                  <button
                    onClick={() => setCategorySearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                <span className="text-[11px] font-mono text-neutral-500">
                  {categories.length} Collections Active · {products.length} T-Shirts Mapped
                </span>
                <button
                  type="button"
                  onClick={openAddCategoryModal}
                  className="bg-black hover:bg-neutral-800 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Category</span>
                </button>
              </div>
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredCategories.map((cat) => {
                const mappedProductsCount = products.filter(
                  (p) => p.categorySlug === cat.slug || p.category === cat.name
                ).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Category Cover Image */}
                      <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100 group">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = PRESET_CATEGORY_IMAGES[0].url;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                        {/* Badge Tag */}
                        {cat.badge && (
                          <div className="absolute top-2.5 left-2.5">
                            <span className="bg-amber-400 text-black text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
                              {cat.badge}
                            </span>
                          </div>
                        )}

                        {/* Mapped T-Shirts Counter */}
                        <div className="absolute top-2.5 right-2.5">
                          <span className="bg-black/75 backdrop-blur-xs text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-md">
                            {mappedProductsCount} T-Shirts
                          </span>
                        </div>

                        {/* Category Name on Image */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                          <h3 className="font-serif font-bold text-base tracking-tight drop-shadow-sm">
                            {cat.name}
                          </h3>
                          <span className="text-[10px] font-mono text-neutral-300">
                            /{cat.slug}
                          </span>
                        </div>
                      </div>

                      {/* Description & Details */}
                      <div className="p-4 space-y-2 text-left">
                        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                          {cat.shortDescription || 'Exclusive collection crafted from premium bio-washed cotton.'}
                        </p>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="px-4 py-3 bg-neutral-50 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => openEditCategoryModal(cat)}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-[11px] font-bold uppercase transition-colors flex items-center gap-1 rounded"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => navigateTo(`/shop?category=${cat.slug}`)}
                          className="px-2.5 py-1.5 border border-gray-300 hover:border-black text-neutral-700 hover:text-black text-[11px] font-mono transition-colors flex items-center gap-1 rounded"
                          title="View Live in Store"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Shop</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(cat)}
                          className="p-1.5 border border-gray-200 hover:border-rose-600 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors rounded"
                          title="Delete Collection"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredCategories.length === 0 && (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-xl space-y-3">
                <Layers className="w-10 h-10 text-neutral-300 mx-auto" />
                <h3 className="font-bold text-neutral-800 text-sm">No Category Collections Found</h3>
                <p className="text-xs text-neutral-500">
                  {categorySearchQuery ? `No collections match "${categorySearchQuery}"` : 'Create your first category collection.'}
                </p>
                <button
                  type="button"
                  onClick={openAddCategoryModal}
                  className="bg-black text-white text-xs font-bold px-4 py-2 uppercase tracking-wider rounded"
                >
                  + Add New Category Collection
                </button>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: BUSINESS OVERVIEW & STATS                              */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 p-5 space-y-1">
                <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                  Gross Sales Revenue
                </p>
                <p className="text-2xl font-mono font-bold text-neutral-950">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-emerald-600 font-mono">From {orders.length} total customer orders</p>
              </div>

              <div className="bg-white border border-gray-200 p-5 space-y-1">
                <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                  Total Orders Placed
                </p>
                <p className="text-2xl font-mono font-bold text-neutral-950">{orders.length}</p>
                <p className="text-[11px] text-neutral-500 font-mono">
                  {pendingOrdersCount} awaiting confirmation
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-5 space-y-1">
                <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                  Active T-Shirt Designs
                </p>
                <p className="text-2xl font-mono font-bold text-neutral-950">{products.length}</p>
                <p className="text-[11px] text-neutral-500 font-mono">Across {categories.length} categories</p>
              </div>

              <div className="bg-white border border-gray-200 p-5 space-y-1">
                <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                  Dispatched / Delivered
                </p>
                <p className="text-2xl font-mono font-bold text-neutral-950">
                  {shippedOrdersCount + deliveredOrdersCount}
                </p>
                <p className="text-[11px] text-indigo-600 font-mono">Pan-India fulfillment active</p>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 p-6 space-y-4">
                <h3 className="font-serif font-bold text-lg">Product Catalog Actions</h3>
                <p className="text-xs text-neutral-500">
                  Directly inject new designs with custom photos, set retail pricing, or update existing collections.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={openAddProductModal}
                    className="bg-black text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New T-Shirt</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="bg-neutral-100 hover:bg-neutral-200 text-black px-4 py-2.5 text-xs font-bold uppercase tracking-wider font-mono"
                  >
                    Manage Inventory
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 space-y-4">
                <h3 className="font-serif font-bold text-lg">Order Processing Workflow</h3>
                <p className="text-xs text-neutral-500">
                  Quickly locate customers, verify shipping addresses, and dispatch orders via COD or UPI.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('orders');
                      setOrderStatusFilter('pending');
                    }}
                    className="bg-black text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider font-mono"
                  >
                    View Pending Orders ({pendingOrdersCount})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================= */}
      {/* MODAL 1: ADD / EDIT T-SHIRT FULL MANAGEMENT MODAL             */}
      {/* ============================================================= */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col text-left"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-neutral-50">
                <div>
                  <h3 className="font-serif font-bold text-lg uppercase tracking-tight flex items-center gap-2">
                    <span>{editingProduct ? 'Edit T-Shirt Product' : 'Add New T-Shirt Design'}</span>
                    <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 font-normal">
                      Admin Catalog
                    </span>
                  </h3>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    Live updates to Photo-Wise 360°, Details, Fabric Specs, Delivery Policy, and Customer Reviews
                  </p>
                </div>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Top 5 Section Tabs */}
              <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 border-b border-gray-200 bg-neutral-100 overflow-x-auto no-scrollbar">
                {[
                  { id: 'photos', label: `1. Photos & 360° Roll (${productForm.images.length})`, icon: ImageIcon },
                  { id: 'details', label: '2. Product Details', icon: Edit2 },
                  { id: 'fabric', label: `3. Fabric & Specs (${productForm.fabricSpecs.length})`, icon: Layers },
                  { id: 'delivery', label: '4. Delivery & Returns', icon: Truck },
                  { id: 'reviews', label: `5. Customer Reviews (${productForm.reviewsCount})`, icon: Star }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = productModalTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setProductModalTab(tab.id as any)}
                      className={`px-3 py-1.5 text-xs font-mono font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border ${
                        isActive
                          ? 'bg-black text-white border-black shadow-xs'
                          : 'bg-white text-neutral-700 hover:text-black hover:bg-neutral-50 border-gray-300'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Modal Scrollable Body */}
              <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* ============================================================= */}
                {/* TAB 1: PHOTOS & 360° ALL-SIDES ROLL (AMAZON / FLIPKART STYLE) */}
                {/* ============================================================= */}
                {productModalTab === 'photos' && (
                  <div className="space-y-5">
                    {/* Primary & Gallery Photos Grid */}
                    <div className="p-4 bg-neutral-50 border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-bold flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Photo-Wise Angle Management ({productForm.images.length} Photos Attached) *</span>
                        </label>
                        <span className="text-[10px] font-mono text-neutral-500">
                          Reorder or set cover to adjust customer 360° roll sequence
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
                        {productForm.images.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className={`relative aspect-3/4 border overflow-hidden bg-neutral-200 group flex flex-col justify-between ${
                              idx === 0 ? 'ring-2 ring-black border-black' : 'border-gray-200'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Product ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = PRESET_TSHIRT_PHOTOS[0].url;
                              }}
                            />

                            {/* Badge for Angle & Position */}
                            <div className="absolute top-1 left-1 flex flex-col gap-0.5 z-10">
                              {idx === 0 ? (
                                <span className="bg-black text-white text-[8px] font-mono uppercase font-bold px-1 py-0.2 shadow-xs">
                                  Cover (Front)
                                </span>
                              ) : (
                                <span className="bg-black/75 text-white text-[8px] font-mono px-1 py-0.2">
                                  {idx === 1 ? 'Left Side' : idx === 2 ? 'Back View' : idx === 3 ? 'Right Side' : `Angle #${idx + 1}`}
                                </span>
                              )}

                              {idx !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSetMainCoverImage(idx)}
                                  className="bg-white/95 hover:bg-black hover:text-white text-black text-[8px] font-mono uppercase font-bold px-1 py-0.2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Set as Main Store Cover"
                                >
                                  Set Cover
                                </button>
                              )}
                            </div>

                            {/* Linked Colors for this photo */}
                            {(() => {
                              const linked = productForm.colors.filter((c, cIdx) =>
                                c.imageIndex !== undefined ? c.imageIndex === idx : cIdx === idx
                              );
                              if (linked.length === 0) return null;
                              return (
                                <div className="absolute top-1 right-1 flex flex-col items-end gap-0.5 z-10 pointer-events-none">
                                  {linked.map((lc, lIdx) => (
                                    <span
                                      key={lIdx}
                                      className="bg-neutral-900/90 text-white text-[8px] font-mono px-1 py-0.2 rounded-2xs flex items-center gap-1 shadow-xs border border-white/20"
                                      title={`Linked Color: ${lc.name}`}
                                    >
                                      <span
                                        className="w-1.5 h-1.5 rounded-full shrink-0"
                                        style={{ backgroundColor: lc.hex }}
                                      />
                                      <span className="truncate max-w-[55px]">{lc.name}</span>
                                    </span>
                                  ))}
                                </div>
                              );
                            })()}

                            {/* Move Order Buttons (Left / Right) */}
                            <div className="absolute bottom-1 right-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(idx, 'left')}
                                  className="bg-white/90 hover:bg-black hover:text-white text-black text-[9px] px-1 py-0.5 font-bold shadow-xs"
                                  title="Move Left in Roll Sequence"
                                >
                                  ◀
                                </button>
                              )}
                              {idx < productForm.images.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(idx, 'right')}
                                  className="bg-white/90 hover:bg-black hover:text-white text-black text-[9px] px-1 py-0.5 font-bold shadow-xs"
                                  title="Move Right in Roll Sequence"
                                >
                                  ▶
                                </button>
                              )}
                              {productForm.images.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="bg-rose-600 hover:bg-rose-700 text-white p-1"
                                  title="Remove this photo"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Image Options: Web URL or File Upload */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-neutral-600 font-bold block">
                            Add Photo via Web URL:
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="url"
                              value={productForm.imageUrl}
                              onChange={(e) =>
                                setProductForm({ ...productForm, imageUrl: e.target.value })
                              }
                              placeholder="Paste image URL (https://...)"
                              className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-black font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddImageUrl()}
                              className="bg-neutral-900 hover:bg-black text-white px-3 py-1.5 text-[11px] font-mono font-bold uppercase transition-colors shrink-0"
                            >
                              + Add Photo
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-neutral-600 font-bold block">
                            Upload Photo from Device:
                          </label>
                          <label className="flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-neutral-800 px-3 py-1.5 border border-dashed border-gray-400 cursor-pointer font-mono font-bold text-xs transition-colors h-[32px]">
                            <Upload className="w-3.5 h-3.5 text-neutral-600" />
                            <span>Choose T-Shirt Image File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Preset Studio Photos */}
                      <div className="pt-2 border-t border-gray-200">
                        <span className="text-[10px] font-mono text-neutral-500 block mb-1.5">
                          Quick Add from Curated Editorial Cotton Looks:
                        </span>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                          {PRESET_TSHIRT_PHOTOS.map((p, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleAddImageUrl(p.url)}
                              className="aspect-3/4 border border-gray-200 hover:border-black overflow-hidden relative group transition-all"
                              title={`Click to add "${p.name}"`}
                            >
                              <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 text-white text-[8px] font-mono font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                + Add
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* LIVE 360° ALL-SIDES ROLL SIMULATOR (ADMIN TEST AREA) */}
                    <div className="p-4 bg-neutral-900 text-white rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RotateCw className="w-4 h-4 text-amber-400" />
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                            Amazon & Flipkart 360° All-Sides Roll Simulator
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                          Angle {adminRollIndex + 1} of {productForm.images.length}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-36 h-48 bg-neutral-950 border border-neutral-700 rounded-lg overflow-hidden relative shrink-0">
                          <img
                            src={productForm.images[adminRollIndex] || productForm.images[0]}
                            alt="360 Roll Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 left-1 bg-black/80 text-white text-[8px] font-mono px-1 py-0.5 rounded">
                            {adminRollIndex === 0
                              ? 'Front View'
                              : adminRollIndex === 1
                              ? 'Left Side'
                              : adminRollIndex === 2
                              ? 'Back View'
                              : adminRollIndex === 3
                              ? 'Right Side'
                              : `Angle #${adminRollIndex + 1}`}
                          </div>
                        </div>

                        <div className="space-y-2 flex-1">
                          <p className="text-xs text-neutral-300 leading-relaxed">
                            This simulator previews the exact experience customers see on your storefront when clicking the photo or roll arrows. Clicking photo rolls left, right, and down across all angles.
                          </p>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() =>
                                setAdminRollIndex((prev) =>
                                  prev === 0 ? productForm.images.length - 1 : prev - 1
                                )
                              }
                              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono font-bold rounded flex items-center gap-1 border border-neutral-700"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                              <span>Roll Left</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setAdminRollIndex((prev) => (prev + 1) % productForm.images.length)
                              }
                              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono font-bold rounded flex items-center gap-1 border border-neutral-700"
                            >
                              <span>Roll Right</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setIsAdminAutoRolling(!isAdminAutoRolling)}
                              className={`px-3 py-1.5 text-xs font-mono font-bold rounded border ${
                                isAdminAutoRolling
                                  ? 'bg-amber-400 text-black border-amber-400'
                                  : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                              }`}
                            >
                              {isAdminAutoRolling ? 'Stop Auto-Roll' : 'Auto-Roll 360°'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AMAZON & FLIPKART VIDEO ADD SHOW OPTION */}
                    <div className="p-4 bg-neutral-50 border border-gray-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-900 font-bold flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-rose-600" />
                          <span>Product Showcase Video (Show Customer Video on Storefront)</span>
                        </label>
                        <span className="text-[9px] font-mono bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">
                          MP4 or YouTube
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="url"
                          value={productForm.video || ''}
                          onChange={(e) =>
                            setProductForm({ ...productForm, video: e.target.value })
                          }
                          placeholder="Paste Product Showcase Video URL (e.g. MP4 or YouTube embed)"
                          className="flex-1 px-3 py-2 text-xs bg-white border border-gray-300 focus:outline-none focus:border-black font-mono rounded"
                        />
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setProductForm({
                                ...productForm,
                                video:
                                  'https://assets.mixkit.co/videos/preview/mixkit-man-posing-in-a-black-t-shirt-41315-large.mp4'
                              })
                            }
                            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-2 py-1.5 text-[10px] font-mono font-bold rounded border border-neutral-300"
                          >
                            + Sample 1
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setProductForm({
                                ...productForm,
                                video:
                                  'https://assets.mixkit.co/videos/preview/mixkit-man-in-white-t-shirt-posing-41316-large.mp4'
                              })
                            }
                            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-2 py-1.5 text-[10px] font-mono font-bold rounded border border-neutral-300"
                          >
                            + Sample 2
                          </button>
                          {productForm.video && (
                            <button
                              type="button"
                              onClick={() => setProductForm({ ...productForm, video: '' })}
                              className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-2 py-1.5 text-[10px] font-mono font-bold rounded border border-rose-300"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      {productForm.video && (
                        <div className="p-2.5 bg-neutral-900 rounded-xl flex items-center gap-3 text-white">
                          <div className="w-16 h-12 bg-black rounded overflow-hidden shrink-0 flex items-center justify-center">
                            <Video className="w-6 h-6 text-rose-400" />
                          </div>
                          <div className="flex-1 truncate">
                            <p className="text-[11px] font-bold text-white flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Showcase Video Configured for Live Storefront</span>
                            </p>
                            <p className="text-[9px] font-mono text-neutral-400 truncate">
                              {productForm.video}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ============================================================= */}
                {/* TAB 2: PRODUCT DETAILS                                        */}
                {/* ============================================================= */}
                {productModalTab === 'details' && (
                  <div className="space-y-5">
                    {/* Title */}
                    <div className="p-4 bg-neutral-50 border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-bold">
                          1. T-Shirt Name / Title (Displays on Live Store) *
                        </label>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {productForm.name.length} chars
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="e.g. Acid Washed Vintage Heavyweight Tee"
                        className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 focus:outline-none focus:border-black font-sans font-bold text-neutral-950"
                      />
                    </div>

                    {/* Price & Category */}
                    <div className="p-4 bg-neutral-50 border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-bold flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Pricing & Category *</span>
                        </label>
                        {productForm.originalPrice > productForm.price && (
                          <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 border border-rose-200">
                            🔥{' '}
                            {Math.round(
                              ((productForm.originalPrice - productForm.price) /
                                productForm.originalPrice) *
                                100
                            )}
                            % OFF · Save ₹{productForm.originalPrice - productForm.price}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold mb-1">
                            Selling Price (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={productForm.price}
                            onChange={(e) =>
                              setProductForm({ ...productForm, price: Number(e.target.value) })
                            }
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:border-black font-mono font-bold text-neutral-950"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold mb-1">
                            Original MRP (₹)
                          </label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={productForm.originalPrice}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                originalPrice: Number(e.target.value)
                              })
                            }
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:border-black font-mono text-neutral-600"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold">
                              Category Collection
                            </label>
                            <button
                              type="button"
                              onClick={openAddCategoryModal}
                              className="text-[10px] font-mono text-black hover:text-amber-600 font-bold underline flex items-center gap-0.5"
                              title="Add new category right now"
                            >
                              <Plus className="w-2.5 h-2.5" />
                              <span>+ Add New</span>
                            </button>
                          </div>
                          <select
                            value={productForm.category}
                            onChange={(e) => {
                              const sel = categories.find((c) => c.name === e.target.value);
                              setProductForm({
                                ...productForm,
                                category: e.target.value,
                                categorySlug: sel ? sel.slug : 'cotton'
                              });
                            }}
                            className="w-full px-3 py-2 text-xs bg-white border border-gray-300 focus:outline-none focus:border-black font-mono"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Fit, Neck, Sleeve, Stock */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-neutral-50 border border-gray-200">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-600 font-bold mb-1">
                          Fit Profile
                        </label>
                        <input
                          type="text"
                          value={productForm.fit}
                          onChange={(e) => setProductForm({ ...productForm, fit: e.target.value })}
                          placeholder="Relaxed Drop-Shoulder"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-black font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-600 font-bold mb-1">
                          Neck Style
                        </label>
                        <select
                          value={productForm.neckType}
                          onChange={(e) =>
                            setProductForm({ ...productForm, neckType: e.target.value as any })
                          }
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-black font-mono"
                        >
                          <option value="Round Neck">Round Neck</option>
                          <option value="Polo Neck">Polo Neck</option>
                          <option value="V Neck">V Neck</option>
                          <option value="Oversized Ribbed">Oversized Ribbed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-600 font-bold mb-1">
                          Sleeve Style
                        </label>
                        <select
                          value={productForm.sleeve}
                          onChange={(e) =>
                            setProductForm({ ...productForm, sleeve: e.target.value as any })
                          }
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-black font-mono"
                        >
                          <option value="Half Sleeve">Half Sleeve</option>
                          <option value="Full Sleeve">Full Sleeve</option>
                          <option value="Sleeveless">Sleeveless</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-600 font-bold mb-1">
                          Stock Inventory
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={productForm.stock}
                          onChange={(e) =>
                            setProductForm({ ...productForm, stock: Number(e.target.value) })
                          }
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-black font-mono"
                        />
                      </div>
                    </div>

                    {/* Sizes Available */}
                    <div className="p-4 bg-neutral-50 border border-gray-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-bold">
                          Sizes Available
                        </label>
                        <span className="text-[10px] font-mono text-neutral-500">
                          {productForm.sizes.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {POPULAR_SIZES.map((sz) => {
                          const isActive = productForm.sizes.includes(sz);
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => handleToggleSize(sz)}
                              className={`px-3 py-1.5 text-xs font-mono font-bold border transition-colors ${
                                isActive
                                  ? 'bg-black text-white border-black'
                                  : 'bg-white text-neutral-700 border-gray-300 hover:border-black'
                              }`}
                            >
                              {isActive ? `✓ ${sz}` : sz}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                        <input
                          type="text"
                          value={productForm.newCustomSize}
                          onChange={(e) =>
                            setProductForm({ ...productForm, newCustomSize: e.target.value })
                          }
                          placeholder="Add custom size (e.g. 3XL, 4XL)"
                          className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-black font-mono max-w-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCustomSize()}
                          className="bg-neutral-900 hover:bg-black text-white px-3 py-1.5 text-xs font-mono font-bold uppercase"
                        >
                          + Add Size
                        </button>
                      </div>
                    </div>

                    {/* Colors & Photo Linking (Optional - Not Required) */}
                    <div className="p-4 bg-neutral-50 border border-gray-200 space-y-4 rounded-xs">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-bold flex items-center gap-1.5 flex-wrap">
                            <span>Color Options & Linked Photo Angle</span>
                            <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded">
                              Optional (Not Required)
                            </span>
                          </label>
                          <p className="text-[11px] text-neutral-600 font-mono mt-1">
                            {productForm.colors.length > 0 ? (
                              <span className="text-emerald-700 font-bold">
                                ✓ {productForm.colors.length} color variant(s) configured. Customers will see these colors on the storefront and clicking each color switches the view to its linked photo.
                              </span>
                            ) : (
                              <span className="text-neutral-500">
                                ⚪ No colors added. This product will be sold in single standard style without asking customer for a color. Customer storefront will NOT show color options.
                              </span>
                            )}
                          </p>
                        </div>
                        {productForm.colors.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearAllColors}
                            className="text-[10px] font-mono text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
                          >
                            Remove All Colors (Sell as Single Tone)
                          </button>
                        )}
                      </div>

                      {/* Configured Colors List with Linked Photo Angle Selectors */}
                      {productForm.colors.length > 0 ? (
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase text-neutral-500 font-bold block">
                            Active Color Options ({productForm.colors.length}) · Linked Photo Angle:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                            {productForm.colors.map((c, idx) => {
                              const linkedImgIdx =
                                c.imageIndex !== undefined && c.imageIndex < productForm.images.length
                                  ? c.imageIndex
                                  : idx < productForm.images.length
                                  ? idx
                                  : 0;
                              const linkedPhotoUrl = productForm.images[linkedImgIdx] || productForm.images[0];
                              return (
                                <div key={idx} className="bg-white border border-gray-300 p-2.5 rounded shadow-2xs space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span
                                        className="w-5 h-5 rounded-full border border-gray-400 shrink-0 shadow-2xs"
                                        style={{ backgroundColor: c.hex }}
                                        title={c.hex}
                                      />
                                      <div className="truncate">
                                        <p className="font-bold text-xs truncate text-neutral-900">{c.name}</p>
                                        <p className="text-[9px] font-mono text-neutral-400">{c.hex}</p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveColor(idx)}
                                      className="text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded p-1 text-xs font-bold transition-colors"
                                      title="Remove this color variant"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {/* Linked Photo Angle Dropdown & Thumbnail Preview */}
                                  <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                                    <img
                                      src={linkedPhotoUrl}
                                      alt={c.name}
                                      className="w-8 h-10 object-cover border border-gray-300 rounded shrink-0 bg-neutral-100"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = PRESET_TSHIRT_PHOTOS[0].url;
                                      }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <label className="text-[9px] font-mono text-neutral-500 font-bold block truncate">
                                        Linked Photo Angle:
                                      </label>
                                      <select
                                        value={linkedImgIdx}
                                        onChange={(e) => handleAssignColorImage(idx, Number(e.target.value))}
                                        className="w-full text-[10px] font-mono bg-neutral-50 border border-gray-300 py-1 px-1 focus:outline-none focus:border-black rounded cursor-pointer"
                                      >
                                        {productForm.images.map((_, imgI) => (
                                          <option key={imgI} value={imgI}>
                                            Photo #{imgI + 1} {imgI === 0 ? '(Cover / Front)' : imgI === 1 ? '(Side Angle)' : imgI === 2 ? '(Back View)' : `(Angle ${imgI + 1})`}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-white border border-dashed border-gray-300 text-center rounded">
                          <p className="text-[11px] text-neutral-700 font-mono font-medium">
                            No colors configured for this T-Shirt.
                          </p>
                          <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                            Customer will see this product in standard single-tone without color selectors. If you have multiple colors, add them below.
                          </p>
                        </div>
                      )}

                      {/* Quick 1-Click Popular Preset Colors */}
                      <div className="pt-2 border-t border-gray-200">
                        <label className="text-[10px] font-mono text-neutral-500 font-bold uppercase block mb-1.5">
                          Quick Add Popular Colors (1-Click):
                        </label>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {PRESET_COLORS.map((preset) => {
                            const isAdded = productForm.colors.some(
                              (c) => c.name.toLowerCase() === preset.name.toLowerCase()
                            );
                            return (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => handleAddPresetColor(preset)}
                                disabled={isAdded}
                                className={`px-2 py-1 text-[10px] font-mono font-bold border rounded flex items-center gap-1.5 transition-all ${
                                  isAdded
                                    ? 'bg-neutral-200 text-neutral-400 border-neutral-300 cursor-not-allowed opacity-60'
                                    : 'bg-white hover:bg-neutral-100 text-neutral-800 border-gray-300 hover:border-black cursor-pointer shadow-2xs'
                                }`}
                              >
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-gray-400"
                                  style={{ backgroundColor: preset.hex }}
                                />
                                <span>{preset.name}</span>
                                {isAdded && <span className="text-[8px] text-neutral-500">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Add Custom Color & Choose Linked Photo Angle */}
                      <div className="pt-2 border-t border-gray-200 space-y-2">
                        <label className="text-[10px] font-mono text-neutral-600 font-bold block">
                          Add Custom Color & Choose Linked Photo Angle:
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center border border-gray-300 bg-white p-0.5 rounded">
                            <input
                              type="color"
                              value={productForm.newColorHex}
                              onChange={(e) =>
                                setProductForm({ ...productForm, newColorHex: e.target.value })
                              }
                              className="w-6 h-6 border-0 cursor-pointer bg-transparent"
                              title="Pick Color"
                            />
                            <span className="text-[10px] font-mono px-1.5 text-neutral-600 uppercase">
                              {productForm.newColorHex}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={productForm.newColorName}
                            onChange={(e) =>
                              setProductForm({ ...productForm, newColorName: e.target.value })
                            }
                            placeholder="Color name (e.g. Royal Blue, Crimson)"
                            className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 font-mono flex-1 min-w-[150px] rounded focus:outline-none focus:border-black"
                          />
                          <div className="flex items-center gap-1 bg-white border border-gray-300 px-2 py-1 rounded">
                            <span className="text-[10px] font-mono text-neutral-500 font-bold">Link Photo:</span>
                            <select
                              value={productForm.newColorImageIndex ?? 0}
                              onChange={(e) =>
                                setProductForm({ ...productForm, newColorImageIndex: Number(e.target.value) })
                              }
                              className="text-[10px] font-mono bg-transparent focus:outline-none cursor-pointer"
                            >
                              {productForm.images.map((_, pIdx) => (
                                <option key={pIdx} value={pIdx}>
                                  Photo #{pIdx + 1} {pIdx === 0 ? '(Cover)' : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddCustomColor}
                            className="bg-black hover:bg-neutral-800 text-white px-3.5 py-1.5 text-xs font-mono font-bold uppercase rounded shadow-2xs shrink-0 cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Color</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Description Textarea */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-600 font-bold mb-1">
                        Product Description
                      </label>
                      <textarea
                        rows={3}
                        value={productForm.description}
                        onChange={(e) =>
                          setProductForm({ ...productForm, description: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 focus:outline-none focus:border-black font-sans leading-relaxed"
                      />
                    </div>

                    {/* Badges Checklist */}
                    <div className="flex items-center gap-6 pt-2 border-t border-gray-200">
                      <label className="flex items-center gap-2 text-xs font-mono cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={productForm.isNew}
                          onChange={(e) =>
                            setProductForm({ ...productForm, isNew: e.target.checked })
                          }
                          className="accent-black"
                        />
                        <span>Mark as New Arrival</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-mono cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={productForm.isBestSeller}
                          onChange={(e) =>
                            setProductForm({ ...productForm, isBestSeller: e.target.checked })
                          }
                          className="accent-black"
                        />
                        <span>Mark as Best Seller</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-mono cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={productForm.isOffer}
                          onChange={(e) =>
                            setProductForm({ ...productForm, isOffer: e.target.checked })
                          }
                          className="accent-black"
                        />
                        <span>Mark as Special Offer</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ============================================================= */}
                {/* TAB 3: FABRIC & SPECIFICATIONS                                */}
                {/* ============================================================= */}
                {productModalTab === 'fabric' && (
                  <div className="space-y-5">
                    <div className="p-4 bg-neutral-50 border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-bold">
                          Fabric Grade & GSM Density
                        </label>
                        <span className="text-[10px] font-mono text-neutral-500">
                          Displays on customer Fabric & Specifications tab
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold mb-1">
                            Fabric Grade / Composition *
                          </label>
                          <input
                            type="text"
                            value={productForm.fabric}
                            onChange={(e) =>
                              setProductForm({ ...productForm, fabric: e.target.value })
                            }
                            placeholder="100% Super Combed Cotton French Terry (240 GSM)"
                            className="w-full px-3 py-2 text-xs bg-white border border-gray-300 font-mono font-bold text-neutral-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold mb-1">
                            Fabric GSM Weight *
                          </label>
                          <input
                            type="number"
                            value={productForm.gsm}
                            onChange={(e) =>
                              setProductForm({ ...productForm, gsm: Number(e.target.value) })
                            }
                            placeholder="240"
                            className="w-full px-3 py-2 text-xs bg-white border border-gray-300 font-mono font-bold text-neutral-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bullet Points Specification List */}
                    <div className="p-4 bg-neutral-50 border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-bold">
                          Fabric Specifications & Performance Highlights ({productForm.fabricSpecs.length} Points)
                        </label>
                        <button
                          type="button"
                          onClick={handleResetFabricSpecs}
                          className="text-[10px] font-mono text-neutral-600 hover:text-black underline font-bold"
                        >
                          Reset to Recommended 5 Points
                        </button>
                      </div>

                      <div className="space-y-2">
                        {productForm.fabricSpecs.map((spec, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2 bg-white border p-2">
                            <span className="font-mono text-[10px] text-neutral-400 font-bold w-5">
                              #{sIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={spec}
                              onChange={(e) => {
                                const newSpecs = [...productForm.fabricSpecs];
                                newSpecs[sIdx] = e.target.value;
                                setProductForm({ ...productForm, fabricSpecs: newSpecs });
                              }}
                              className="flex-1 text-xs px-2 py-1 bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-black"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFabricSpec(sIdx)}
                              className="text-neutral-400 hover:text-rose-600 p-1"
                              title="Delete specification point"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add New Specification Input */}
                      <div className="pt-2 border-t border-gray-200 flex items-center gap-2">
                        <input
                          type="text"
                          value={productForm.newFabricSpec}
                          onChange={(e) =>
                            setProductForm({ ...productForm, newFabricSpec: e.target.value })
                          }
                          placeholder="Add new fabric bullet point (e.g. Bio-washed natural enzymes...)"
                          className="flex-1 px-3 py-2 text-xs bg-white border border-gray-300 font-mono"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddFabricSpec();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddFabricSpec}
                          className="bg-neutral-900 hover:bg-black text-white px-4 py-2 text-xs font-mono font-bold uppercase shrink-0"
                        >
                          + Add Point
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ============================================================= */}
                {/* TAB 4: DELIVERY & RETURNS                                     */}
                {/* ============================================================= */}
                {productModalTab === 'delivery' && (
                  <div className="space-y-5">
                    <div className="p-4 bg-neutral-50 border border-gray-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-bold">
                          Delivery & Returns Storefront Policy
                        </label>
                        <button
                          type="button"
                          onClick={handleResetDeliveryPolicy}
                          className="text-[10px] font-mono text-neutral-600 hover:text-black underline font-bold"
                        >
                          Load Standard Pan-India Policy
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold mb-1">
                            Standard Delivery Timeline *
                          </label>
                          <input
                            type="text"
                            value={productForm.deliveryDetails.standardDelivery}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                deliveryDetails: {
                                  ...productForm.deliveryDetails,
                                  standardDelivery: e.target.value
                                }
                              })
                            }
                            placeholder="2 to 4 business days across India."
                            className="w-full px-3 py-2 text-xs bg-white border border-gray-300 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold mb-1">
                            Shipping Fee & Free Delivery Threshold *
                          </label>
                          <input
                            type="text"
                            value={productForm.deliveryDetails.shippingPolicy}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                deliveryDetails: {
                                  ...productForm.deliveryDetails,
                                  shippingPolicy: e.target.value
                                }
                              })
                            }
                            placeholder="Free Shipping on all prepaid & COD orders over ₹999."
                            className="w-full px-3 py-2 text-xs bg-white border border-gray-300 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold mb-1">
                            Returns & Exchange Policy *
                          </label>
                          <input
                            type="text"
                            value={productForm.deliveryDetails.returnPolicy}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                deliveryDetails: {
                                  ...productForm.deliveryDetails,
                                  returnPolicy: e.target.value
                                }
                              })
                            }
                            placeholder="7-Day Returns & Exchanges: Instant door-step exchange if you need a different size or fit."
                            className="w-full px-3 py-2 text-xs bg-white border border-gray-300 font-mono"
                          />
                        </div>

                        <div className="pt-2 border-t border-gray-200">
                          <label className="flex items-center gap-2 text-xs font-mono cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={productForm.deliveryDetails.codAvailable}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  deliveryDetails: {
                                    ...productForm.deliveryDetails,
                                    codAvailable: e.target.checked
                                  }
                                })
                              }
                              className="accent-black"
                            />
                            <span className="font-bold text-neutral-900">
                              Cash on Delivery (COD) Available for this T-Shirt (25,000+ PIN Codes)
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ============================================================= */}
                {/* TAB 5: CUSTOMER REVIEWS (240)                                 */}
                {/* ============================================================= */}
                {productModalTab === 'reviews' && (
                  <div className="space-y-5">
                    {/* Header Controls: Count & Rating */}
                    <div className="p-4 bg-neutral-50 border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-bold flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>Customer Reviews Settings & Display Count</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleSet240ReviewsPreset}
                          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-black text-[10px] font-mono font-bold shadow-xs transition-colors"
                        >
                          ★ Set "Customer Reviews (240)" Preset
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold mb-1">
                            Total Reviews Count (e.g. 240) *
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={productForm.reviewsCount}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                reviewsCount: Number(e.target.value)
                              })
                            }
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 font-mono font-bold text-neutral-900"
                          />
                          <span className="text-[9px] font-mono text-neutral-500">
                            Appears in title tab: "Customer Reviews ({productForm.reviewsCount})"
                          </span>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold mb-1">
                            Average Star Rating Score (out of 5.0) *
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min={1}
                            max={5}
                            value={productForm.rating}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                rating: Number(e.target.value)
                              })
                            }
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 font-mono font-bold text-neutral-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Add New Customer Review Form */}
                    <div className="p-4 bg-white border border-gray-200 space-y-3">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-bold block">
                        Add Verified Customer Review:
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <input
                            type="text"
                            placeholder="Customer Name (e.g. Vikram S.)"
                            value={productForm.newReviewAuthor}
                            onChange={(e) =>
                              setProductForm({ ...productForm, newReviewAuthor: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 font-mono"
                          />
                        </div>

                        <div>
                          <select
                            value={productForm.newReviewRating}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                newReviewRating: Number(e.target.value)
                              })
                            }
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 font-mono"
                          >
                            <option value={5}>★★★★★ 5.0 Stars</option>
                            <option value={4}>★★★★☆ 4.0 Stars</option>
                            <option value={3}>★★★☆☆ 3.0 Stars</option>
                          </select>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Date text (e.g. 2 days ago)"
                            value={productForm.newReviewDate}
                            onChange={(e) =>
                              setProductForm({ ...productForm, newReviewDate: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <textarea
                          rows={2}
                          placeholder="Review Comment text (e.g. The 240 GSM weight is incredible. The drop shoulder fits properly boxy...)"
                          value={productForm.newReviewComment}
                          onChange={(e) =>
                            setProductForm({ ...productForm, newReviewComment: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 text-xs border border-gray-300 font-sans"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-1.5 text-[11px] font-mono cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productForm.newReviewVerified}
                            onChange={(e) =>
                              setProductForm({ ...productForm, newReviewVerified: e.target.checked })
                            }
                            className="accent-black"
                          />
                          <span>Mark as Verified Buyer</span>
                        </label>

                        <button
                          type="button"
                          onClick={handleAddProductReview}
                          className="bg-neutral-900 hover:bg-black text-white px-4 py-1.5 text-xs font-mono font-bold uppercase"
                        >
                          + Add Review
                        </button>
                      </div>
                    </div>

                    {/* Current Reviews List */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                        Active Reviews Showing on Product Page ({productForm.customerReviews.length}):
                      </span>

                      {productForm.customerReviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-3 bg-neutral-50 border border-gray-200 flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-neutral-900">{rev.author}</span>
                              {rev.verified && (
                                <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200 font-semibold">
                                  ✓ Verified Buyer
                                </span>
                              )}
                              <span className="text-[10px] text-neutral-400 font-mono">
                                {rev.date}
                              </span>
                            </div>
                            <div className="flex text-amber-500">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                            <p className="text-xs text-neutral-700 leading-relaxed">
                              {rev.comment}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveProductReview(rev.id)}
                            className="text-neutral-400 hover:text-rose-600 p-1"
                            title="Remove review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sticky Action Footer */}
                <div className="pt-4 border-t border-gray-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {productModalTab !== 'photos' && (
                      <button
                        type="button"
                        onClick={() => {
                          const tabs: Array<'photos' | 'details' | 'fabric' | 'delivery' | 'reviews'> = [
                            'photos',
                            'details',
                            'fabric',
                            'delivery',
                            'reviews'
                          ];
                          const curr = tabs.indexOf(productModalTab);
                          if (curr > 0) setProductModalTab(tabs[curr - 1]);
                        }}
                        className="px-3 py-2 text-xs font-mono font-bold border border-gray-300 hover:bg-neutral-100"
                      >
                        ◀ Previous Tab
                      </button>
                    )}

                    {productModalTab !== 'reviews' && (
                      <button
                        type="button"
                        onClick={() => {
                          const tabs: Array<'photos' | 'details' | 'fabric' | 'delivery' | 'reviews'> = [
                            'photos',
                            'details',
                            'fabric',
                            'delivery',
                            'reviews'
                          ];
                          const curr = tabs.indexOf(productModalTab);
                          if (curr < tabs.length - 1) setProductModalTab(tabs[curr + 1]);
                        }}
                        className="px-3 py-2 text-xs font-mono font-bold border border-gray-300 hover:bg-neutral-100"
                      >
                        Next Tab ▶
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {editingProduct && (
                      <button
                        type="button"
                        onClick={() => setProductToDelete(editingProduct)}
                        className="px-3.5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 transition-colors flex items-center gap-1.5"
                        title="Delete this T-Shirt from catalog"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delete T-Shirt</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="px-4 py-2.5 text-xs font-mono font-bold uppercase text-neutral-600 hover:text-black"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="bg-black hover:bg-neutral-800 text-white px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>{editingProduct ? 'Save All Product Changes' : 'Publish T-Shirt to Store'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================= */}
      {/* MODAL 2: QUICK PRICE EDIT MODAL                               */}
      {/* ============================================================= */}
      <AnimatePresence>
        {quickPriceProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black shadow-2xl max-w-sm w-full p-6 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h4 className="font-serif font-bold text-base uppercase">Update Price</h4>
                <button
                  onClick={() => setQuickPriceProduct(null)}
                  className="text-neutral-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleQuickPriceSave} className="mt-4 space-y-4">
                <p className="text-xs font-bold text-neutral-900 line-clamp-1">
                  {quickPriceProduct.name}
                </p>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold mb-1">
                    New Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quickNewPrice}
                    onChange={(e) => setQuickNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-gray-300 font-mono font-bold text-neutral-950 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold mb-1">
                    Original MRP (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quickNewOriginalPrice}
                    onChange={(e) => setQuickNewOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-gray-300 font-mono text-neutral-600 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickPriceProduct(null)}
                    className="px-3 py-2 text-xs font-mono font-bold text-neutral-600 hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black hover:bg-neutral-800 text-white px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider"
                  >
                    Save Price
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================= */}
      {/* MODAL: QUICK RENAME T-SHIRT MODAL                             */}
      {/* ============================================================= */}
      <AnimatePresence>
        {quickRenameProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black shadow-2xl max-w-sm w-full p-6 text-left font-mono"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h4 className="font-serif font-bold text-base uppercase">Rename T-Shirt</h4>
                <button
                  onClick={() => setQuickRenameProduct(null)}
                  className="text-neutral-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleQuickRenameSave} className="mt-4 space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">
                    Current Name
                  </label>
                  <p className="text-xs text-neutral-600 font-sans italic">
                    "{quickRenameProduct.name}"
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">
                    New T-Shirt Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={quickNewName}
                    onChange={(e) => setQuickNewName(e.target.value)}
                    placeholder="Enter new T-shirt name"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-gray-300 font-sans font-bold text-neutral-950 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickRenameProduct(null)}
                    className="px-3 py-2 text-xs font-bold text-neutral-600 hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black hover:bg-neutral-800 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
                  >
                    Update Name
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================= */}
      {/* MODAL: QUICK PHOTO CHANGE MODAL                               */}
      {/* ============================================================= */}
      <AnimatePresence>
        {quickPhotoProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black shadow-2xl max-w-md w-full p-6 text-left font-mono"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h4 className="font-serif font-bold text-base uppercase">Change T-Shirt Photo</h4>
                <button
                  onClick={() => setQuickPhotoProduct(null)}
                  className="text-neutral-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleQuickPhotoSave} className="mt-4 space-y-4">
                <p className="text-xs font-bold text-neutral-900 line-clamp-1 font-sans">
                  {quickPhotoProduct.name}
                </p>

                <div className="flex items-start gap-4">
                  <div className="w-20 h-24 bg-neutral-100 border border-gray-300 overflow-hidden shrink-0">
                    <img
                      src={quickNewPhotoUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PRESET_TSHIRT_PHOTOS[0].url;
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-2 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">
                        Image Web URL
                      </label>
                      <input
                        type="url"
                        required
                        value={quickNewPhotoUrl}
                        onChange={(e) => setQuickNewPhotoUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-gray-300 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-1.5 text-[10px] font-bold border border-gray-300 cursor-pointer">
                        <Upload className="w-3 h-3" />
                        <span>Upload from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const optimized = await compressImageFile(file);
                                setQuickNewPhotoUrl(optimized);
                              } catch (err) {
                                console.error('Image compression failed:', err);
                              }
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Quick Studio Looks */}
                <div>
                  <span className="text-[10px] text-neutral-400 block mb-1">
                    Or select from studio looks:
                  </span>
                  <div className="grid grid-cols-6 gap-1.5">
                    {PRESET_TSHIRT_PHOTOS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuickNewPhotoUrl(p.url)}
                        className={`aspect-3/4 border overflow-hidden ${
                          quickNewPhotoUrl === p.url ? 'ring-2 ring-black border-black' : 'border-gray-200'
                        }`}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setQuickPhotoProduct(null)}
                    className="px-3 py-2 text-xs font-bold text-neutral-600 hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black hover:bg-neutral-800 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
                  >
                    Save Photo
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================= */}
      {/* MODAL: QUICK SIZES AVAILABLE MANAGEMENT MODAL                 */}
      {/* ============================================================= */}
      <AnimatePresence>
        {quickSizesProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black shadow-2xl max-w-md w-full p-6 text-left font-mono"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h4 className="font-serif font-bold text-base uppercase">Manage Available Sizes</h4>
                <button
                  onClick={() => setQuickSizesProduct(null)}
                  className="text-neutral-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleQuickSizesSave} className="mt-4 space-y-4 text-xs">
                <p className="font-bold text-neutral-900 line-clamp-1 font-sans">
                  {quickSizesProduct.name}
                </p>

                {/* Active Sizes */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1.5">
                    Selected Sizes ({quickSizesList.length}):
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {quickSizesList.map((sz) => (
                      <span
                        key={sz}
                        className="bg-black text-white px-2 py-0.5 text-xs font-bold flex items-center gap-1"
                      >
                        <span>{sz}</span>
                        <button
                          type="button"
                          onClick={() => setQuickSizesList(quickSizesList.filter((s) => s !== sz))}
                          className="hover:text-rose-300 ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Popular Size Toggles */}
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1.5">
                    Quick Toggle:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {POPULAR_SIZES.map((sz) => {
                      const isActive = quickSizesList.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            if (isActive) {
                              setQuickSizesList(quickSizesList.filter((s) => s !== sz));
                            } else {
                              setQuickSizesList([...quickSizesList, sz]);
                            }
                          }}
                          className={`px-2 py-0.5 text-xs font-bold border transition-colors ${
                            isActive
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-neutral-700 border-gray-300 hover:border-black'
                          }`}
                        >
                          {isActive ? `✓ ${sz}` : sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add Custom Size */}
                <div className="pt-2 border-t border-gray-200 flex items-center gap-2">
                  <input
                    type="text"
                    value={quickSizesCustomInput}
                    onChange={(e) => setQuickSizesCustomInput(e.target.value)}
                    placeholder="Custom size (e.g. 4XL)"
                    className="flex-1 px-2.5 py-1.5 text-xs bg-neutral-50 border border-gray-300 focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = quickSizesCustomInput.trim().toUpperCase();
                      if (trimmed && !quickSizesList.includes(trimmed)) {
                        setQuickSizesList([...quickSizesList, trimmed]);
                        setQuickSizesCustomInput('');
                      }
                    }}
                    className="bg-neutral-900 hover:bg-black text-white px-3 py-1.5 text-[11px] font-bold uppercase"
                  >
                    + Add Size
                  </button>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setQuickSizesProduct(null)}
                    className="px-3 py-2 text-xs font-bold text-neutral-600 hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black hover:bg-neutral-800 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
                  >
                    Save Available Sizes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================= */}
      {/* MODAL: ORDER CANCEL CONFIRMATION DIALOG                       */}
      {/* ============================================================= */}
      <AnimatePresence>
        {cancelModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-rose-600 shadow-2xl max-w-lg w-full p-6 text-left font-mono"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2 text-rose-700">
                  <Ban className="w-5 h-5" />
                  <h4 className="font-serif font-bold text-base uppercase text-neutral-950">
                    Cancel Order Option
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="text-neutral-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Overview */}
              <div className="mt-4 p-3.5 bg-neutral-50 border border-neutral-200 space-y-1.5 text-xs">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-neutral-950 text-sm">
                    Order #{cancelModalOrder.orderNumber}
                  </span>
                  <span className="text-neutral-900">
                    Grand Total: ₹{cancelModalOrder.grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-neutral-600">
                  Buyer: <span className="font-bold text-neutral-900">{cancelModalOrder.customerName}</span> ({cancelModalOrder.customerPhone})
                </p>
                <p className="text-[11px] text-neutral-500 line-clamp-1">
                  Items: {cancelModalOrder.items.map((i) => `${i.productName} (${i.size}) x${i.quantity}`).join(', ')}
                </p>
              </div>

              {/* Cancellation Form */}
              <form onSubmit={handleConfirmCancelOrder} className="mt-4 space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1.5">
                    Select Cancellation Reason *
                  </label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {CANCELLATION_REASONS.map((reason) => (
                      <label
                        key={reason}
                        className={`flex items-center gap-2.5 p-2 border cursor-pointer text-xs transition-colors ${
                          cancelReasonPreset === reason
                            ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold'
                            : 'bg-white border-gray-200 hover:border-gray-400 text-neutral-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="cancellationReason"
                          checked={cancelReasonPreset === reason}
                          onChange={() => setCancelReasonPreset(reason)}
                          className="accent-rose-600"
                        />
                        <span>{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {cancelReasonPreset === 'Other (Custom reason)' && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">
                      Specify Custom Reason *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={cancelReasonCustom}
                      onChange={(e) => setCancelReasonCustom(e.target.value)}
                      placeholder="Enter the specific reason for cancelling this order..."
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-gray-300 focus:outline-none focus:border-black font-sans"
                    />
                  </div>
                )}

                {/* WhatsApp Buyer Notify Checkbox */}
                <div className="p-3 bg-emerald-50 border border-emerald-200">
                  <label className="flex items-start gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={cancelNotifyWhatsApp}
                      onChange={(e) => setCancelNotifyWhatsApp(e.target.checked)}
                      className="mt-0.5 accent-emerald-600"
                    />
                    <div>
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                        Send Cancellation Notification to Buyer on WhatsApp
                      </span>
                      <p className="text-[10px] text-emerald-800 font-sans mt-0.5">
                        Automatically opens WhatsApp with pre-formatted cancellation details and order number for {cancelModalOrder.customerName}.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Modal Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setCancelModalOrder(null)}
                    className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-black"
                  >
                    Keep Order (Do Not Cancel)
                  </button>
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Confirm Cancel Order</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================= */}
      {/* MODAL 3: FULL CUSTOMER ORDER DETAILS MODAL                     */}
      {/* ============================================================= */}
      <AnimatePresence>
        {selectedOrderForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col text-left font-mono"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-neutral-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-neutral-950">
                      Order {selectedOrderForDetail.orderNumber}
                    </span>
                    <span
                      className={`text-[9px] uppercase px-2 py-0.5 border ${
                        selectedOrderForDetail.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-neutral-100 text-neutral-900 border-neutral-300'
                      }`}
                    >
                      {selectedOrderForDetail.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    Placed on{' '}
                    {new Date(selectedOrderForDetail.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrderForDetail(null)}
                  className="text-neutral-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* Customer & Shipping Details */}
                <div className="p-4 bg-neutral-50 border border-gray-200 space-y-2">
                  <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    Customer Profile & Delivery Address
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-800">
                    <div>
                      <p className="text-neutral-400 text-[10px]">Name:</p>
                      <p className="font-bold">{selectedOrderForDetail.customerName}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 text-[10px]">Phone:</p>
                      <p className="font-bold">{selectedOrderForDetail.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 text-[10px]">Email:</p>
                      <p className="font-bold">{selectedOrderForDetail.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 text-[10px]">Payment Method:</p>
                      <p className="font-bold uppercase text-neutral-950">
                        {selectedOrderForDetail.paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-neutral-400 text-[10px]">Shipping Address:</p>
                    <p className="font-sans font-medium text-neutral-900">
                      {selectedOrderForDetail.shippingAddress.address}
                      {selectedOrderForDetail.shippingAddress.landmark &&
                        `, Landmark: ${selectedOrderForDetail.shippingAddress.landmark}`}
                      , {selectedOrderForDetail.shippingAddress.city},{' '}
                      {selectedOrderForDetail.shippingAddress.state} -{' '}
                      {selectedOrderForDetail.shippingAddress.pincode}
                    </p>
                  </div>

                  {selectedOrderForDetail.orderNotes && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-neutral-400 text-[10px]">Customer Order Note:</p>
                      <p className="italic text-neutral-600">
                        "{selectedOrderForDetail.orderNotes}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Items Ordered List */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">
                    Ordered T-Shirts ({selectedOrderForDetail.items.length})
                  </p>
                  <div className="divide-y divide-gray-200 border border-gray-200">
                    {selectedOrderForDetail.items.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-10 h-12 object-cover border border-gray-200"
                          />
                          <div>
                            <p className="font-bold text-neutral-900 font-sans">{item.productName}</p>
                            <p className="text-[10px] text-neutral-500">
                              Size: {item.size}{item.color ? ` · Color: ${item.color}` : ''} · Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-neutral-950">
                            ₹{item.totalPrice.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-neutral-400">₹{item.unitPrice} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="p-3 bg-neutral-50 border border-gray-200 space-y-1">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrderForDetail.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedOrderForDetail.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount ({selectedOrderForDetail.couponCode || 'PROMO'}):</span>
                      <span>-₹{selectedOrderForDetail.discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping Fee:</span>
                    <span>
                      {selectedOrderForDetail.shippingFee === 0
                        ? 'FREE'
                        : `₹${selectedOrderForDetail.shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-950 font-bold text-sm pt-2 border-t border-gray-200">
                    <span>Grand Total:</span>
                    <span>₹{selectedOrderForDetail.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Status Update Actions */}
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <p className="text-[10px] uppercase font-bold text-neutral-400">
                    Update Order Status:
                  </p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            if (st === 'cancelled') {
                              setCancelModalOrder(selectedOrderForDetail);
                              setCancelReasonPreset('Customer requested cancellation via Call/WhatsApp');
                              setCancelReasonCustom('');
                            } else {
                              updateOrderStatus(selectedOrderForDetail.id, st);
                              setSelectedOrderForDetail({ ...selectedOrderForDetail, status: st });
                              showToast('Status Changed', `Order updated to ${st}`, 'success');
                            }
                          }}
                          className={`py-2 text-center text-[10px] uppercase font-bold border transition-colors ${
                            selectedOrderForDetail.status === st
                              ? st === 'cancelled'
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'bg-black text-white border-black'
                              : 'bg-white text-neutral-700 border-gray-200 hover:border-black'
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* DEDICATED ORDER CANCEL OPTION PANEL */}
                <div
                  className={`p-3.5 border ${
                    selectedOrderForDetail.status === 'cancelled'
                      ? 'bg-rose-50 border-rose-300'
                      : 'bg-neutral-50 border-gray-200'
                  } space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-mono font-bold tracking-wider flex items-center gap-1.5 text-neutral-900">
                      <Ban
                        className={`w-4 h-4 ${
                          selectedOrderForDetail.status === 'cancelled'
                            ? 'text-rose-600'
                            : 'text-neutral-500'
                        }`}
                      />
                      <span>Order Cancel Option</span>
                    </span>
                    {selectedOrderForDetail.status === 'cancelled' ? (
                      <span className="bg-rose-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
                        Status: Cancelled
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-400 font-mono">
                        Active Order
                      </span>
                    )}
                  </div>

                  {selectedOrderForDetail.status === 'cancelled' ? (
                    <div className="space-y-2 text-xs font-mono">
                      <p className="text-rose-950 font-medium">
                        <strong>Reason:</strong>{' '}
                        {selectedOrderForDetail.cancellationReason || 'Cancelled by Admin'}
                      </p>
                      {selectedOrderForDetail.cancelledAt && (
                        <p className="text-[10px] text-rose-700">
                          Cancelled At:{' '}
                          {new Date(selectedOrderForDetail.cancelledAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleReopenOrder(selectedOrderForDetail)}
                          className="bg-neutral-900 hover:bg-black text-white px-3 py-1.5 text-[10px] font-bold uppercase flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reopen Order (Set to Pending)</span>
                        </button>
                        <a
                          href={`https://wa.me/${selectedOrderForDetail.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hello ${selectedOrderForDetail.customerName},\nThis is TEEZOON regarding your order #${selectedOrderForDetail.orderNumber}.\n\nYour order is CANCELLED.\nReason: ${selectedOrderForDetail.cancellationReason || 'Store Admin Cancellation'}\nTotal Amount: ₹${selectedOrderForDetail.grandTotal.toLocaleString('en-IN')}\n\nPlease reply if you need any assistance or have questions.\nTeam TEEZOON`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-[10px] font-bold uppercase flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Send WhatsApp Notice</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs font-mono">
                      <p className="text-neutral-500 text-[11px] leading-relaxed">
                        Need to cancel this order due to buyer request, inventory shortage, or delivery failure? Click below to select a cancellation reason and trigger an optional WhatsApp notice.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setCancelModalOrder(selectedOrderForDetail);
                          setCancelReasonPreset('Customer requested cancellation via Call/WhatsApp');
                          setCancelReasonCustom('');
                        }}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-xs"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel Order Option</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Customer Contact Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/${selectedOrderForDetail.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedOrderForDetail.customerName}, this is TEEZOON regarding your order #${selectedOrderForDetail.orderNumber}. We have updated your status to ${selectedOrderForDetail.status.toUpperCase()}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-center font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Customer</span>
                  </a>

                  <a
                    href={`tel:${selectedOrderForDetail.customerPhone}`}
                    className="flex-1 bg-neutral-900 hover:bg-black text-white py-2.5 text-center font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Customer</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================= */}
      {/* MODAL: ADD / EDIT CATEGORY COLLECTION MODAL                   */}
      {/* ============================================================= */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col text-left rounded-xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-neutral-50">
                <div>
                  <h3 className="font-serif font-bold text-lg uppercase tracking-tight flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-500" />
                    <span>{editingCategory ? 'Edit Category Collection' : 'Add New Category Collection'}</span>
                  </h3>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    Configure collection title, URL slug, storefront banner photo, and promotional badge
                  </p>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSaveCategory} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
                {/* Category Name */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-700 font-bold mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      const autoSlug = newName
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '');
                      setCategoryForm((prev) => ({
                        ...prev,
                        name: newName,
                        slug: editingCategory ? prev.slug : autoSlug
                      }));
                    }}
                    placeholder="e.g. Acid Washed Vintage T-Shirts"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:border-black font-sans font-bold"
                  />
                </div>

                {/* Slug & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-700 font-bold mb-1">
                      URL Slug (Unique ID) *
                    </label>
                    <div className="flex items-center">
                      <span className="bg-neutral-100 border border-r-0 border-gray-300 px-2.5 py-2 text-neutral-500 font-mono text-xs">
                        /category/
                      </span>
                      <input
                        type="text"
                        required
                        value={categoryForm.slug}
                        onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                        placeholder="acid-washed-vintage"
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 focus:outline-none focus:border-black font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-700 font-bold mb-1">
                      Badge / Series Tag
                    </label>
                    <input
                      type="text"
                      value={categoryForm.badge}
                      onChange={(e) => setCategoryForm({ ...categoryForm, badge: e.target.value })}
                      placeholder="e.g. New Drop, Essential, Popular"
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:outline-none focus:border-black font-mono text-xs"
                    />
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      {['New Drop', 'Popular', 'Essential', 'Art Series', 'Classic', 'Performance'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setCategoryForm({ ...categoryForm, badge: preset })}
                          className="text-[9px] font-mono bg-neutral-100 hover:bg-neutral-200 px-1.5 py-0.5 rounded text-neutral-700"
                        >
                          +{preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-700 font-bold mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={categoryForm.shortDescription}
                    onChange={(e) => setCategoryForm({ ...categoryForm, shortDescription: e.target.value })}
                    placeholder="Distinctive graphic illustrations, high-density typography & abstract art prints."
                    className="w-full px-3 py-2 bg-white border border-gray-300 focus:outline-none focus:border-black font-sans text-xs leading-relaxed"
                  />
                </div>

                {/* Category Cover Image */}
                <div className="space-y-2 p-3 bg-neutral-50 border border-gray-200 rounded-lg">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-700 font-bold">
                    Cover Image URL & Upload *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={categoryForm.image}
                      onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 focus:outline-none focus:border-black font-mono text-xs"
                    />
                    <label className="bg-neutral-800 hover:bg-black text-white px-3 py-2 font-mono font-bold text-xs uppercase flex items-center gap-1 cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCategoryImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Preset Photos */}
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 block mb-1">
                      Or select high-res studio preset look:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                      {PRESET_CATEGORY_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCategoryForm({ ...categoryForm, image: preset.url })}
                          className={`aspect-square border overflow-hidden relative group transition-all ${
                            categoryForm.image === preset.url ? 'ring-2 ring-black border-black' : 'border-gray-200'
                          }`}
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  {categoryForm.image && (
                    <div className="relative aspect-16/7 w-full rounded-lg overflow-hidden border border-gray-300 mt-2 bg-neutral-900">
                      <img src={categoryForm.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-3 text-white">
                        <div>
                          {categoryForm.badge && (
                            <span className="bg-amber-400 text-black text-[9px] font-mono font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                              {categoryForm.badge}
                            </span>
                          )}
                          <h4 className="font-serif font-bold text-base">{categoryForm.name || 'Category Title Preview'}</h4>
                          <p className="text-[10px] text-neutral-300 line-clamp-1">{categoryForm.shortDescription}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-neutral-700 text-xs font-bold uppercase hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-neutral-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{editingCategory ? 'Save Changes' : 'Create Category Collection'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================= */}
      {/* MODAL: DELETE PRODUCT CONFIRMATION DIALOG                     */}
      {/* ============================================================= */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-rose-600 shadow-2xl max-w-md w-full p-6 text-left font-mono"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2 text-rose-600">
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded">
                    <Trash2 className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wide text-neutral-900">
                      Delete T-Shirt?
                    </h3>
                    <p className="text-[10px] text-neutral-500 font-sans">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="text-neutral-400 hover:text-black p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Preview Card */}
              <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 flex items-center gap-3">
                <img
                  src={productToDelete.images[0]}
                  alt={productToDelete.name}
                  className="w-14 h-16 object-cover bg-neutral-200 border border-gray-300 shrink-0"
                />
                <div className="overflow-hidden">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">
                    {productToDelete.category}
                  </span>
                  <p className="font-bold text-xs text-neutral-900 line-clamp-2 font-sans">
                    {productToDelete.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="font-bold text-neutral-950">
                      ₹{productToDelete.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-neutral-400">· Stock: {productToDelete.stock} pcs</span>
                  </div>
                </div>
              </div>

              {/* Warning Notice */}
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-[11px] font-sans text-rose-900 leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  Are you sure you want to permanently delete <strong>"{productToDelete.name}"</strong>? It will be removed from your catalog and will no longer appear in the customer storefront.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="px-4 py-2 text-xs font-bold font-mono uppercase text-neutral-600 hover:text-black border border-gray-300 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel / Keep
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteProduct}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Permanently</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================= */}
      {/* MODAL: DELETE CATEGORY CONFIRMATION DIALOG                    */}
      {/* ============================================================= */}
      <AnimatePresence>
        {categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-rose-600 shadow-2xl max-w-md w-full p-6 text-left font-mono"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2 text-rose-600">
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded">
                    <Trash2 className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wide text-neutral-900">
                      Delete Collection?
                    </h3>
                    <p className="text-[10px] text-neutral-500 font-sans">
                      Collection: {categoryToDelete.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCategoryToDelete(null)}
                  className="text-neutral-400 hover:text-black p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Warning Notice */}
              <div className="mt-4 p-3 bg-neutral-50 border border-gray-200 text-xs font-sans text-neutral-800 leading-relaxed space-y-1">
                <p>
                  Are you sure you want to delete the <strong>"{categoryToDelete.name}"</strong> collection?
                </p>
                <p className="text-[11px] text-neutral-500">
                  Existing products mapped to this collection will remain safe in your store catalog.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setCategoryToDelete(null)}
                  className="px-4 py-2 text-xs font-bold font-mono uppercase text-neutral-600 hover:text-black border border-gray-300 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteCategory}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Collection</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
