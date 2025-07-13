import type { Attraction } from '../types';

// URL DEL PROXY en producción (Vercel Serverless Function)
const API_BASE_URL = '/api/viator';

let tagMapCache: Map<number, string> | null = null;

// Abstracción para llamar al proxy de Viator
const viatorApiRequest = async (method: 'GET' | 'POST', endpoint: string, body?: object) => {
    const headers: HeadersInit = {
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'es',
    };
    const config: RequestInit = { method, headers };

    if (method === 'POST' && body) {
        headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
        const apiErrorMessage = errorData?.message || `Error from Viator API: ${response.statusText}`;
        throw new Error(apiErrorMessage);
    }
    return response.json();
};

// Obtener/cachar tags
const getTagMap = async (): Promise<Map<number, string>> => {
    if (tagMapCache) return tagMapCache;
    const response = await viatorApiRequest('GET', 'taxonomy/tags');
    const tags = response?.data || [];
    const newTagMap = new Map<number, string>();
    for (const tag of tags) newTagMap.set(tag.id, tag.name);
    tagMapCache = newTagMap;
    return tagMapCache;
};

// FETCH PRINCIPAL: SOLO datos reales de Viator (sin fallback)
export const fetchAttractions = async (): Promise<Attraction[]> => {
    // Siempre intenta la API real, si falla, retorna array vacío.
    try {
        const tagMap = await getTagMap();
        const searchBody = {
            filtering: { destination: "36" },
            pagination: { start: 1, count: 51 },
            sorting: { sort: 'TOP_SELLERS', order: 'DESCENDING' },
            currency: 'USD'
        };
        const searchResponse = await viatorApiRequest('POST', 'products/search', searchBody);
        const products = searchResponse.products || [];

        if (!Array.isArray(products) || products.length === 0) {
            return []; // NO mock, NO datos si API no responde bien
        }

        return products.map((product: any) => {
            const productCategories = (product.tags || [])
                .map((id: number) => tagMap.get(id))
                .filter((name: string | undefined): name is string => !!name);

            const imageUrl = product.images?.find((img: any) => img.variant === 'HIGH_RESOLUTION')?.url
                || product.images?.find((img: any) => img.variant === 'MEDIUM_RESOLUTION')?.url
                || product.images?.[0]?.url;

            return {
                name: product.title,
                description: product.description,
                city: product.summary?.primaryDestinationName || 'Puerto Rico',
                image: imageUrl,
                affiliateLink: `https://www.viator.com/${product.productUrl}`,
                categories: productCategories,
                productCode: product.productCode,
            };
        }).filter((attraction: Attraction) => attraction.image);

    } catch (error) {
        // Si falla la API, NO retorna nada, NO mock.
        return [];
    }
};
