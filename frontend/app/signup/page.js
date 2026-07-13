'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'

export default function SignupPage() {
    const router = useRouter()
    const { register } = useAuth()
    const [form, setForm] = useState({ username: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            await register(form.username, form.email, form.password)
            router.push('/login')
        } catch (err) {
            setError(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-md flex-col rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
                <h1 className="text-3xl font-semibold">Create your account</h1>
                <p className="mt-2 text-sm text-slate-400">Sign up to continue shopping.</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <input
                        required
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none ring-0"
                        placeholder="Username"
                        value={form.username}
                        onChange={(event) => setForm({ ...form, username: event.target.value })}
                    />
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
                        {loading ? 'Creating account...' : 'Sign up'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-cyan-300">Log in</Link>
                </p>
            </div>
        </main>
    )
}
