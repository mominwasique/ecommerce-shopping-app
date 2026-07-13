const DEFAULT_STRAPI_URL = 'http://localhost:1337'

export function getStrapiUrl() {
    return process.env.NEXT_PUBLIC_STRAPI_URL || DEFAULT_STRAPI_URL
}

export function getStrapiImageUrl(image) {
    if (!image) return ''
    if (typeof image === 'string') return image
    if (image.url?.startsWith('http')) return image.url
    return `${getStrapiUrl()}${image.url || ''}`
}

export async function fetchStrapi(path, options = {}) {
    const url = `${getStrapiUrl()}${path}`
    const response = await fetch(url, {
        cache: 'no-store',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `Request failed with ${response.status}`)
    }

    return response.json()
}
