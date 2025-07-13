import type { Attraction } from '../types';
import { mockAttractions } from "./mockData";

// Leer API KEY desde variable de entorno Vite
const API_KEY = import.meta.env.VITE_VIATOR_API_KEY;

// ENDPOINT REAL DE VIATOR (Producción)
const API_BASE_URL = 'https://api.viator.com/partner';
const AFFILIATE_PARAMS = 'pid=P00255360&mcid=42383&medium=website&campaign=borishop&target-lander=NONE';

let tagMapCache: Map<number, string> | null = null;

// Función para llamar al API Viator (GET o POST)
const viatorApiRequest = async (method: 'GET' | 'POST', endpoint: string, body?: object) => {
    if (!API_KEY) throw new Error("Viator API key is not configured.");

    const headers: HeadersInit = {
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'es',
        'exp-api-key': API_KEY,
    };

    const config: RequestInit = { method, headers };

    if (method === 'POST' && body) {
        headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

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

    const response = await viatorApiRequest('GET', '/taxonomy/tags');
    const tags = response?.data || [];

    const newTagMap = new Map<number, string>();
    for (const tag of tags) newTagMap.set(tag.id, tag.name);

    tagMapCache = newTagMap;
    return tagMapCache;
};

// FETCH PRINCIPAL: Siempre intenta Viator primero
export const fetchAttractions = async (): Promise<Attraction[]> => {
    if (!API_KEY) {
        console.warn("API_KEY environment variable not set. Usando mockData.");
        return mockAttractions;
    }

    try {
        console.log("Intentando fetch de atracciones REALES desde Viator API...");
        const tagMap = await getTagMap();
        const searchBody = {
            filtering: { destination: "36" },
            pagination: { start: 1, count: 51 }, // <-- para 51 atracciones
            sorting: { sort: 'TOP_SELLERS', order: 'DESCENDING' },
            currency: 'USD'
        };

        const searchResponse = await viatorApiRequest('POST', '/products/search', searchBody);
        const products = searchResponse.products || [];

        if (!Array.isArray(products) || products.length === 0) {
            console.warn("Viator API respondió pero no devolvió productos. Usando mockData.");
            return mockAttractions;
        }

        const attractions: Attraction[] = products.map((product: any) => {
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
                affiliateLink: `https://www.viator.com/${product.productUrl}?${AFFILIATE_PARAMS}`,
                categories: productCategories,
                productCode: product.productCode,
            };
        }).filter((attraction: Attraction) => attraction.image);

        console.log(`✅ Recibiendo data REAL de Viator. Atracciones recibidas: ${attractions.length}`);
        return attractions;

    } catch (error) {
        console.error("❌ ERROR al hacer fetch de Viator API. Usando mockData. Error:", error);
        return mockAttractions;
    }
};
