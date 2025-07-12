import type { Attraction } from '../types';
import { mockAttractions } from "./mockData";

// Store API key from environment variables
const API_KEY = process.env.API_KEY;

// Viator API configuration
const API_BASE_URL = 'https://api.viator.com/partner';
const AFFILIATE_PARAMS = 'pid=P00255360&mcid=42383&medium=website&campaign=borishop&target-lander=NONE';

// In-memory cache for Viator's taxonomy tags to avoid redundant API calls
let tagMapCache: Map<number, string> | null = null;

/**
 * A helper function to make authenticated requests to the Viator API.
 * @param method The HTTP method ('GET' or 'POST').
 * @param endpoint The API endpoint to call (e.g., '/products/search').
 * @param body The request body for POST requests.
 * @returns The JSON response from the API.
 */
const viatorApiRequest = async (method: 'GET' | 'POST', endpoint: string, body?: object) => {
    if (!API_KEY) {
        throw new Error("Viator API key is not configured.");
    }

    const headers: HeadersInit = {
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'es',
        'exp-api-key': API_KEY,
    };
    
    const config: RequestInit = {
        method,
        headers,
    };

    if (method === 'POST' && body) {
        headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
        console.error("Viator API Error:", response.status, errorData);
        const apiErrorMessage = errorData?.message || `Error from Viator API: ${response.statusText}`;
        throw new Error(apiErrorMessage);
    }

    return response.json();
};


/**
 * Fetches and caches the mapping of tag IDs to tag names from Viator.
 * @returns A Map where keys are tag IDs and values are tag names.
 */
const getTagMap = async (): Promise<Map<number, string>> => {
    if (tagMapCache) {
        return tagMapCache;
    }

    console.log("Fetching Viator category tags via GET...");
    // Taxonomy data is typically fetched via GET. Using the wrong method can cause network errors.
    const response = await viatorApiRequest('GET', '/taxonomy/tags');
    const tags = response?.data || [];

    const newTagMap = new Map<number, string>();
    for (const tag of tags) {
        newTagMap.set(tag.id, tag.name);
    }
    
    tagMapCache = newTagMap;
    console.log(`Cached ${tagMapCache.size} tags.`);
    return tagMapCache;
};

/**
 * Fetches attractions from the Viator API for Puerto Rico.
 * If the API call fails, it falls back to mock data.
 * @returns A promise that resolves to an array of Attraction objects.
 */
export const fetchAttractions = async (): Promise<Attraction[]> => {
    if (!API_KEY) {
        console.warn("API_KEY environment variable not set. Returning mock data.");
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        return Promise.resolve(mockAttractions);
    }

    try {
        console.log("Fetching attractions from Viator API...");
        const tagMap = await getTagMap();

        const searchBody = {
            filtering: {
                destination: "36", // Destination ID for Puerto Rico
            },
            pagination: {
                start: 1,
                count: 24,
            },
            sorting: {
                sort: 'TOP_SELLERS',
                order: 'DESCENDING'
            },
            currency: 'USD'
        };

        const searchResponse = await viatorApiRequest('POST', '/products/search', searchBody);

        const products = searchResponse.products || [];
        
        const attractions: Attraction[] = products.map((product: any) => {
            const productCategories = (product.tags || [])
                .map((id: number) => tagMap.get(id))
                .filter((name: string | undefined): name is string => !!name);
            
            const imageUrl = product.images.find((img: any) => img.variant === 'HIGH_RESOLUTION')?.url 
                          || product.images.find((img: any) => img.variant === 'MEDIUM_RESOLUTION')?.url
                          || product.images[0]?.url;

            return {
                name: product.title,
                description: product.description,
                city: product.summary.primaryDestinationName || 'Puerto Rico',
                image: imageUrl,
                affiliateLink: `https://www.viator.com/${product.productUrl}?${AFFILIATE_PARAMS}`,
                categories: productCategories,
                productCode: product.productCode,
            };
        }).filter((attraction: Attraction) => attraction.image);

        console.log(`Successfully mapped ${attractions.length} attractions from Viator.`);
        return attractions;

    } catch (error) {
        console.error("Failed to fetch attractions from Viator API. Falling back to mock data.", error);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay for fallback
        return Promise.resolve(mockAttractions);
    }
};
