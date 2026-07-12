"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { useCart } from '../context/CartContext'

const NavBar = () => {
    const { cartCount } = useCart()

    return (
        <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
            <div className="container mx-auto flex items-center justify-between p-4">
                <div className="text-white text-2xl font-bold tracking-wide">
                    <Link href="/">My Shop</Link>
                </div>

                <div className="hidden md:flex space-x-10">
                    <Link href="/" className="text-white hover:text-yellow-300 transition duration-300 text-lg font-medium">Home</Link>
                    <Link href="/about" className="text-white hover:text-yellow-300 transition duration-300 text-lg font-medium">About</Link>
                    <Link href="/products" className="text-white hover:text-yellow-300 transition duration-300 text-lg font-medium">Products</Link>
                    <Link href="/contact" className="text-white hover:text-yellow-300 transition duration-300 text-lg font-medium">Contact</Link>
                    <Link href="/cartDetail" className="text-white hover:text-yellow-300 transition duration-300 text-lg font-medium">
                        Cart({cartCount})
                    </Link>
                </div>

                <div className="hidden md:block">
                    <Button className="rounded-full">Login</Button>
                </div>

                <div className="md:hidden">
                    <button className="text-white focus:outline-none hover:text-yellow-300 transition duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;
