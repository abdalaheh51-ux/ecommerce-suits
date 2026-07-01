export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  icon: string | null
  featured: boolean
  order: number
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  currency: string
  categoryId: string
  images: string[]
  sizes: string[]
  colors: string[]
  rating: number
  reviewCount: number
  stock: number
  sku: string
  badge: string | null
  featured: boolean
  material: string | null
  care: string | null
  category?: Category
  reviews?: Review[]
}

export type Review = {
  id: string
  productId: string
  authorName: string
  rating: number
  title: string | null
  comment: string
  verified: boolean
  createdAt: string
}

export type CartItem = {
  id: string
  productId: string
  quantity: number
  size: string | null
  color: string | null
  product: Product
}

export type WishlistItem = {
  id: string
  productId: string
  product: Product
}

export type Order = {
  id: string
  orderNumber: string
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  governorate: string
  postalCode: string | null
  notes: string | null
  subtotal: number
  shipping: number
  total: number
  status: string
  paymentMethod: string
  items: OrderItem[]
  createdAt: string
}

export type OrderItem = {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  size: string | null
  color: string | null
  image: string
}

// Transform DB product to API product (parse JSON fields)
export function serializeProduct(p: any): Product {
  return {
    ...p,
    images: p.images ? JSON.parse(p.images) : [],
    sizes: p.sizes ? JSON.parse(p.sizes) : [],
    colors: p.colors ? JSON.parse(p.colors) : [],
    category: p.category ? { ...p.category } : undefined,
    reviews: p.reviews ? p.reviews.map((r: any) => ({ ...r, createdAt: r.createdAt.toISOString() })) : undefined,
  }
}

export function formatPrice(price: number, currency = 'EGP'): string {
  return new Intl.NumberFormat('ar-EG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' ' + (currency === 'EGP' ? 'ج.م' : currency)
}
