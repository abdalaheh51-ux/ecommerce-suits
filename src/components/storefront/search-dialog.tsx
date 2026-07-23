'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Search, X, Loader2, ArrowLeft } from 'lucide-react'
import { useUIStore } from '@/lib/store'
import { formatPrice } from '@/lib/types'
import type { Product } from '@/lib/types'

export function SearchDialog() {
  const { searchOpen, setSearchOpen, setQuickView } = useUIStore()
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [suggestions] = useState(['بدلة', 'سموكن', 'قميص', 'معطف', 'أكسفورد', 'كرفات'])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQ('')
      setResults([])
    }
  }, [searchOpen])

  useEffect(() => {
    if (!q.trim()) {
      setResults([])
      return
    }
    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(q)}&limit=8`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setResults(data.products)
        }
      } catch {} finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  const pick = (p: Product) => {
    setSearchOpen(false)
    setQuickView(p)
  }

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-background top-[15%] translate-y-0">
        <DialogTitle className="sr-only">بحث</DialogTitle>
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search className="size-5 text-gold shrink-0" strokeWidth={1.5} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن منتج، فئة، أو علامة..."
            className="flex-1 bg-transparent border-0 outline-none text-base placeholder:text-foreground/40"
          />
          {loading ? (
            <Loader2 className="size-5 text-foreground/40 animate-spin" />
          ) : q ? (
            <button onClick={() => setQ('')} className="text-foreground/40 hover:text-foreground" aria-label="مسح">
              <X className="size-5" />
            </button>
          ) : null}
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!q.trim() ? (
            <div className="p-5">
              <p className="text-xs tracking-wide-luxe text-foreground/50 uppercase mb-3">بحث شائع</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQ(s)}
                    className="px-4 py-2 text-sm bg-secondary hover:bg-accent rounded-full text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="p-10 text-center">
              <p className="text-foreground/60">لا توجد نتائج لـ &ldquo;{q}&rdquo;</p>
              <p className="text-sm text-foreground/40 mt-1">جرّب كلمات بحث أخرى</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {results.map((p) => {
                const imgs: string[] = p.images || []
                return (
                  <button
                    key={p.id}
                    onClick={() => pick(p)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-secondary/50 transition-colors text-right"
                  >
                    <div className="size-16 shrink-0 rounded-sm overflow-hidden bg-muted">
                      <img src={imgs[0] || '/images/cat-suits.jpg'} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/cat-suits.jpg' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{p.name}</p>
                      <p className="text-xs text-foreground/50">{p.category?.name}</p>
                    </div>
                    <span className="font-display font-bold text-sm text-foreground">{formatPrice(p.price)}</span>
                    <ArrowLeft className="size-4 text-foreground/30" />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
