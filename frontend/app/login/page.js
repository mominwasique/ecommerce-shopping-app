'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(form.email, form.password)
            router.push('/')
            router.refresh()
        } catch (err) {
            setError(err.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-md flex-col rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
                <h1 className="text-3xl font-semibold">Welcome back</h1>
                <p className="mt-2 text-sm text-slate-400">Log in to access your account and cart.</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <input
                        required
                        type="email"
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none ring-0"
                        placeholder="Email"
                        value={form.email}
                        onChange={(event) => setForm({ ...form, email: event.target.value })}
                    />
                    <input
                        required
                        type="password"
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none ring-0"
                        placeholder="Password"
                        value={form.password}
                        onChange={(event) => setForm({ ...form, password: event.target.value })}
                    />
                    {error ? <p className="text-sm text-rose-400">{error}</p> : null}
                    <button type="submit" disabled={loading} className="w-full rounded-full bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70">
                        {loading ? 'Signing in...' : 'Log in'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-400">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-medium text-cyan-300">Sign up</Link>
                </p>
            </div>
        </main>
    )
}
