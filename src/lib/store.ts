'use client'

import { create } from 'zustand'
import type { Product, CartItem, WishlistItem } from '@/lib/types'

type UIState = {
  // Drawers / modals
  cartOpen: boolean
  wishlistOpen: boolean
  searchOpen: boolean
  mobileMenuOpen: boolean
  quickViewProduct: Product | null
  productDetailSlug: string | null
  checkoutOpen: boolean
  // Active category filter
  activeCategory: string // slug
  activeSort: string
  searchQuery: string
  // Actions
  setCartOpen: (v: boolean) => void
  setWishlistOpen: (v: boolean) => void
  setSearchOpen: (v: boolean) => void
  setMobileMenuOpen: (v: boolean) => void
  setQuickView: (p: Product | null) => void
  setProductDetail: (slug: string | null) => void
  setCheckoutOpen: (v: boolean) => void
  setActiveCategory: (slug: string) => void
  setActiveSort: (s: string) => void
  setSearchQuery: (q: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  wishlistOpen: false,
  searchOpen: false,
  mobileMenuOpen: false,
  quickViewProduct: null,
  productDetailSlug: null,
  checkoutOpen: false,
  activeCategory: 'all',
  activeSort: 'featured',
  searchQuery: '',
  setCartOpen: (v) => set({ cartOpen: v }),
  setWishlistOpen: (v) => set({ wishlistOpen: v }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
  setQuickView: (p) => set({ quickViewProduct: p }),
  setProductDetail: (slug) => set({ productDetailSlug: slug }),
  setCheckoutOpen: (v) => set({ checkoutOpen: v }),
  setActiveCategory: (slug) => set({ activeCategory: slug }),
  setActiveSort: (s) => set({ activeSort: s }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}))

type CartState = {
  items: CartItem[]
  loading: boolean
  setItems: (items: CartItem[]) => void
  setLoading: (v: boolean) => void
  add: (productId: string, quantity?: number, size?: string, color?: string) => Promise<void>
  update: (id: string, quantity: number) => Promise<void>
  remove: (id: string) => Promise<void>
  clear: () => Promise<void>
  refresh: () => Promise<void>
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  setItems: (items) => set({ items }),
  setLoading: (v) => set({ loading: v }),
  add: async (productId, quantity = 1, size, color) => {
    set({ loading: true })
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, size, color }),
      })
      if (!res.ok) throw new Error('failed')
      await get().refresh()
    } finally {
      set({ loading: false })
    }
  },
  update: async (id, quantity) => {
    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantity }),
    })
    await get().refresh()
  },
  remove: async (id) => {
    await fetch(`/api/cart?id=${id}`, { method: 'DELETE' })
    await get().refresh()
  },
  clear: async () => {
    await fetch('/api/cart', { method: 'DELETE' })
    await get().refresh()
  },
  refresh: async () => {
    try {
      const res = await fetch('/api/cart', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      set({ items: data.items ?? [] })
    } catch {}
  },
}))

type WishlistState = {
  items: WishlistItem[]
  loading: boolean
  setItems: (items: WishlistItem[]) => void
  toggle: (productId: string) => Promise<'added' | 'removed'>
  remove: (id: string) => Promise<void>
  refresh: () => Promise<void>
  has: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loading: false,
  setItems: (items) => set({ items }),
  toggle: async (productId) => {
    set({ loading: true })
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      await get().refresh()
      return data.action as 'added' | 'removed'
    } finally {
      set({ loading: false })
    }
  },
  remove: async (id) => {
    await fetch(`/api/wishlist?id=${id}`, { method: 'DELETE' })
    await get().refresh()
  },
  refresh: async () => {
    try {
      const res = await fetch('/api/wishlist', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      set({ items: data.items ?? [] })
    } catch {}
  },
  has: (productId) => get().items.some((i) => i.productId === productId),
}))

// Derived selectors
export function cartCount(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.quantity, 0)
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((s, i) => s + (i.product?.price ?? 0) * i.quantity, 0)
}
