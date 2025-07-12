import type { Attraction } from '../types';
import { mockAttractions } from "./mockData";

// API endpoint de tu proxy seguro en Vercel
const API_URL = "/api/viator";

export const fetchAttractions = async (): Promise<Attraction[]> => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                destinationId: "36", // Puerto Rico
                sortOrder: "RELEVANCE",
                currency: "USD"
            })
        });

        if (!response.ok) {
            throw new Error("Error al obtener los datos de Viator");
        }

        const data = await response.json();

        // Asegúrate que data.products sea un array
        const products = Array.isArray(data.products) ? data.products : [];

        // Mapeo para tu frontend (ajusta según tus necesidades)
        return products.map((product: any) => ({
            name: product.title,
            description: product.description,
            city: product.summary?.primaryDestinationName || 'Puerto Rico',
            image: product.images?.[0]?.url || "",
            affiliateLink: product.productUrl ? `https://www.viator.com${product.productUrl}` : "",
            categories: product.tags || [],
            productCode: product.productCode,
        })).filter((attraction: Attraction) => attraction.image);

    } catch (error) {
        // Si falla, retorna datos de ejemplo (mock)
        console.error("Fallo el fetch a /api/viator, usando mockAttractions", error);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simula espera
        return mockAttractions;
    }
};
