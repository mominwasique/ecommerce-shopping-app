'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getStrapiUrl } from '@/app/lib/strapi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            const storedUser = window.localStorage.getItem('strapi-user')
            const storedToken = window.localStorage.getItem('strapi-token')

            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser))
            }
        } catch (error) {
            console.error('Failed to restore auth session', error)
        } finally {
            setLoading(false)
        }
    }, [])

    const login = async (email, password) => {
        const response = await fetch(`${getStrapiUrl()}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        const payload = await response.json()

        if (!response.ok) {
            throw new Error(payload.error?.message || 'Login failed')
        }

        window.localStorage.setItem('strapi-token', payload.jwt)
        window.localStorage.setItem('strapi-user', JSON.stringify(payload.user))
        setUser(payload.user)
        return payload
    }

    const register = async (username, email, password) => {
        const response = await fetch(`${getStrapiUrl()}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        })

        const payload = await response.json()

        if (!response.ok) {
            throw new Error(payload.error?.message || 'Registration failed')
        }

        return payload
    }

    const logout = async () => {
        try {
            await fetch(`${getStrapiUrl()}/api/auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
        } catch (error) {
            console.error('Logout request failed', error)
        }

        window.localStorage.removeItem('strapi-token')
        window.localStorage.removeItem('strapi-user')
        setUser(null)
    }

    const value = useMemo(() => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user) }), [user, loading])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
