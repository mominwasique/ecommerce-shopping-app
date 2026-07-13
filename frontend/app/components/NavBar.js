"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const NavBar = () => {
    const { cartCount } = useCart()
    const { user, logout, isAuthenticated } = useAuth()
    const [mobileOpen, setMobileOpen] = useState(false)

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/products', label: 'Products' },
        { href: '/contact', label: 'Contact' },
        { href: '/cartDetail', label: `Cart(${cartCount})` },
    ]

    return (
        <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
            <div className="container mx-auto flex items-center justify-between p-4">
                <div className="text-white text-2xl font-bold tracking-wide">
                    <Link href="/" onClick={() => setMobileOpen(false)}>My Shop</Link>
                </div>

                <div className="hidden md:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="text-white hover:text-yellow-300 transition duration-300 text-lg font-medium">
                            {link.label}
                        </Link>
                    ))}
                    {isAuthenticated ? (
                        <>
                            <span className="text-sm text-white/90">Hi, {user?.username || user?.email}</span>
                            <Button className="rounded-full" onClick={logout}>Logout</Button>
                        </>
                    ) : (
                        <Link href="/signup"><Button className="rounded-full">Sign up</Button></Link>
                    )}
                </div>

                <div className="flex items-center gap-3 md:hidden">
                    {isAuthenticated ? (
                        <Button className="rounded-full px-3 py-2 text-sm" onClick={logout}>Logout</Button>
                    ) : (
                        <Link href="/signup"><Button className="rounded-full px-3 py-2 text-sm">Sign up</Button></Link>
                    )}
                    <button onClick={() => setMobileOpen((open) => !open)} className="text-white focus:outline-none hover:text-yellow-300 transition duration-300" aria-label="Toggle menu">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>

            {mobileOpen ? (
                <div className="border-t border-white/20 bg-slate-950/90 px-4 py-4 md:hidden">
                    <div className="flex flex-col gap-3">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="text-white text-base font-medium" onClick={() => setMobileOpen(false)}>
                                {link.label}
                            </Link>
                        ))}
                        {!isAuthenticated ? (
                            <Link href="/login" className="text-cyan-300 font-medium" onClick={() => setMobileOpen(false)}>Login</Link>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </nav>
    )
}

export default NavBar;
