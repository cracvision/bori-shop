// La ruta de importación se ajusta para la estructura de tu proyecto.
// Desde 'services/', sube un nivel ('../') para encontrar 'types.ts'.
import type { Attraction } from '../types';

const API_BASE_URL = '/api/viator';

// Lista completa de los códigos de producto de tu tienda.
const BORI_SHOP_PRODUCT_CODES = [
  "393101P18", "362275P2", "114689P9", "115023P3", "378933P5", "44586P1", 
  "47300P1", "446125P3", "393101P5", "5513800P1", "91473P1", "42873P6", 
  "16627P3", "393101P12", "362275P1", "393101P13", "393101P4", "481338P1", 
  "115023P2", "350273P5", "215128P4", "5519634P1", "41096P2", "41096P1", 
  "14939P2", "449481P1", "333667P2", "333667P1", "358368P7", "358368P3", 
  "41096P4", "6013P15", "364154P1", "9266P1", "29733P8", "14939P3", 
  "244937P3", "24791P9", "180426P1", "350273P2", "5514612P1", "6013WIND", 
  "9266P2", "244937P2", "101727P7", "203015P1", "71908P2", "9266P3", 
  "40637P5", "4170DIFF", "24791P4"
];

let tagMapCache: Map<number, string> | null = null;

const viatorApiRequest = async (
  method: 'GET' | 'POST',
  endpoint: string,
  body?: object
) => {
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
    const errorData = await response.json().catch(() => ({
      message: 'Failed to parse error response.',
    }));
    const apiErrorMessage =
      errorData?.message || `Error from Viator API: ${response.statusText}`;
    throw new Error(apiErrorMessage);
  }
  return response.json();
};

const getTagMap = async (): Promise<Map<number, string>> => {
  if (tagMapCache) return tagMapCache;
  const response = await viatorApiRequest('GET', 'products/tags');
  const tags = response?.data || [];
  const newTagMap = new Map<number, string>();
  for (const tag of tags) newTagMap.set(tag.id, tag.name);
  tagMapCache = newTagMap;
  return tagMapCache;
};

export const fetchAttractions = async (): Promise<Attraction[]> => {
  try {
    const tagMap = await getTagMap();

    // La lógica final y correcta para la llamada a la API.
    const searchBody = {
      filtering: {
        destination: "36",
        productCodes: BORI_SHOP_PRODUCT_CODES
      },
      sorting: { sort: 'TOP_SELLERS', order: 'DESCENDING' },
      currency: 'USD',
    };

    const searchResponse = await viatorApiRequest(
      'POST',
      'products/search',
      searchBody
    );

    console.log('Respuesta final de la API:', searchResponse);

    const products = searchResponse.products || [];

    if (!Array.isArray(products) || products.length === 0) {
      console.log('La API de Viator no devolvió productos para los códigos especificados.');
      return [];
    }

    return products
      .map((product: any) => {
        const productCategories = (product.tags || [])
          .map((id: number) => tagMap.get(id))
          .filter((name: string | undefined): name is string => !!name);

        const imageUrl =
          product.images?.find((img: any) => img.variant === 'HIGH_RESOLUTION')
            ?.url ||
          product.images?.find((img: any) => img.variant === 'MEDIUM_RESOLUTION')
            ?.url ||
          product.images?.[0]?.url;

        return {
          name: product.title,
          description: product.description,
          city: product.summary?.primaryDestinationName || 'Ubicación no disponible',
          image: imageUrl,
          affiliateLink: `https://www.viator.com/${product.productUrl}`,
          categories: productCategories,
          productCode: product.productCode,
        };
      })
      .filter((attraction: Attraction) => attraction.image);
  } catch (error) {
    console.error('Error en fetchAttractions:', error);
    return [];
  }
};