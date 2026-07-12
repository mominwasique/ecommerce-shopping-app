'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([])

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem('strapi-cart')
            if (stored) {
                setCartItems(JSON.parse(stored))
            }
        } catch (error) {
            console.error('Failed to load cart from storage', error)
        }
    }, [])

    useEffect(() => {
        window.localStorage.setItem('strapi-cart', JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = (product) => {
        setCartItems((current) => {
            const existing = current.find((item) => item.id === product.id)
            if (existing) {
                return current.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }

            return [...current, { ...product, quantity: 1 }]
        })
    }

    const updateQuantity = (id, change) => {
        setCartItems((current) =>
            current
                .map((item) =>
                    item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
                )
                .filter((item) => item.quantity > 0)
        )
    }

    const removeItem = (id) => {
        setCartItems((current) => current.filter((item) => item.id !== id))
    }

    const cartCount = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]
    )

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, cartCount }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)

    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }

    return context
}
