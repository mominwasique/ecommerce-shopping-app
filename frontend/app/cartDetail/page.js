'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, Minus, Plus, ShoppingBag, Sparkles, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCart } from '../context/CartContext'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'INR',
})

const getImageUrl = (image) => {
  if (!image) return ''
  if (typeof image === 'string') return image
  if (image.url?.startsWith('http')) return image.url
  return `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${image.url || ''}`
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem } = useCart()

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  )

  const shipping = subtotal > 250 ? 0 : 18
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Premium shopping experience
            </div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Your cart</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
              Review your curated selections, adjust quantities, and move smoothly to checkout.
            </p>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200">
            Continue shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        {cartItems.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-white/20 bg-slate-900/70 p-10 text-center shadow-lg shadow-black/20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold">Your cart is empty</h2>
            <p className="mx-auto mt-3 max-w-md text-slate-400">
              Add a few standout pieces from our collection and return here when you are ready to checkout.
            </p>
            <Link href="/products" className="mt-6 inline-flex">
              <Button className="rounded-full bg-cyan-500 px-6 text-slate-950 hover:bg-cyan-400">
                Explore products
              </Button>
            </Link>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
            <section className="space-y-4">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-lg shadow-black/20 sm:flex-row sm:p-5"
                >
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title || item.name}
                    className="h-32 w-full rounded-2xl object-cover sm:h-28 sm:w-28"
                  />
                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-semibold text-white">{item.title || item.name}</h2>
                          <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-rose-300"
                          aria-label={`Remove ${item.title || item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-400">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{item.color}</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{item.size}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="rounded-full p-2 transition hover:bg-white/10"
                          aria-label={`Decrease quantity for ${item.title || item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="rounded-full p-2 transition hover:bg-white/10"
                          aria-label={`Increase quantity for ${item.title || item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Unit price</p>
                        <p className="text-lg font-semibold text-white">{currency.format(item.price)}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
              <h2 className="text-xl font-semibold text-white">Order summary</h2>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{currency.format(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : currency.format(shipping)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estimated tax</span>
                  <span>{currency.format(tax)}</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                <p className="font-medium">Free shipping on orders above $250</p>
                <p className="mt-1 text-cyan-200/80">Enjoy fast delivery and priority support on every order.</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-lg font-semibold text-white">
                <span>Total</span>
                <span>{currency.format(total)}</span>
              </div>

              <Button className="mt-6 w-full rounded-full bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                Proceed to checkout
              </Button>
              <Button variant="outline" className="mt-3 w-full rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10">
                Use gift card
              </Button>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}