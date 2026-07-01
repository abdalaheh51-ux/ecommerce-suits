'use client'

import { useEffect } from 'react'
import { useCartStore, useWishlistStore } from '@/lib/store'

export function useStoreInit() {
  const refreshCart = useCartStore((s) => s.refresh)
  const refreshWishlist = useWishlistStore((s) => s.refresh)

  useEffect(() => {
    refreshCart()
    refreshWishlist()
  }, [refreshCart, refreshWishlist])
}
