import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionId } from '@/lib/session'

export const dynamic = 'force-dynamic'

function genOrderNumber() {
  const d = new Date()
  const y = d.getFullYear().toString().slice(-2)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `VL-${y}${m}${day}-${rand}`
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = await getSessionId()
    const body = await req.json()
    const { customerName, email, phone, address, city, governorate, postalCode, notes, paymentMethod } = body

    // Basic validation
    if (!customerName || !email || !phone || !address || !city || !governorate) {
      return NextResponse.json({ error: 'يرجى تعبئة جميع الحقول المطلوبة' }, { status: 400 })
    }

    const cartItems = await db.cartItem.findMany({
      where: { sessionId },
      include: { product: true },
    })

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'السلة فارغة' }, { status: 400 })
    }

    let subtotal = 0
    const orderItems = cartItems.map((ci) => {
      const imgs: string[] = ci.product.images ? JSON.parse(ci.product.images) : []
      subtotal += ci.product.price * ci.quantity
      return {
        productId: ci.productId,
        name: ci.product.name,
        price: ci.product.price,
        quantity: ci.quantity,
        size: ci.size,
        color: ci.color,
        image: imgs[0] ?? '',
      }
    })

    // Free shipping over 3000 EGP
    const shipping = subtotal >= 3000 ? 0 : 70
    const total = subtotal + shipping

    const order = await db.order.create({
      data: {
        orderNumber: genOrderNumber(),
        sessionId,
        customerName,
        email,
        phone,
        address,
        city,
        governorate,
        postalCode: postalCode ?? null,
        notes: notes ?? null,
        subtotal,
        shipping,
        total,
        paymentMethod: paymentMethod ?? 'cod',
        items: { create: orderItems },
      },
      include: { items: true },
    })

    // Decrement stock
    for (const ci of cartItems) {
      await db.product.update({
        where: { id: ci.productId },
        data: { stock: { decrement: ci.quantity } },
      })
    }

    // Clear cart
    await db.cartItem.deleteMany({ where: { sessionId } })

    return NextResponse.json({ ok: true, order })
  } catch (e: any) {
    console.error('POST /api/orders error', e)
    return NextResponse.json({ error: 'فشل إنشاء الطلب' }, { status: 500 })
  }
}
