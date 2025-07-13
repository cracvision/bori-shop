import React, { useState, useEffect, useCallback } from 'react';
import AttractionCard from './components/AttractionCard';
import CategoryFilter from './components/CategoryFilter';
import LoadingSpinner from './components/LoadingSpinner';
import { fetchAttractions } from './services/viatorService';
import type { Attraction } from './types';

const App: React.FC = () => {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadAttractions = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchAttractions();
            setAttractions(data);

            // Saca todas las categorías únicas (dinámicamente)
            const categorySet = new Set<string>();
            data.forEach(attr => (attr.categories || []).forEach(cat => categorySet.add(cat)));
            setAllCategories(Array.from(categorySet).sort());
        } catch (e) {
            setAttractions([]);
            setAllCategories([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAttractions();
    }, [loadAttractions]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const filteredAttractions = selectedCategories.length === 0
        ? attractions
        : attractions.filter(attraction =>
            attraction.categories && attraction.categories.some(cat => selectedCategories.includes(cat))
        );

    const renderContent = () => {
        if (isLoading) {
            return <LoadingSpinner />;
        }
        if (filteredAttractions.length > 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAttractions.map((attraction) => (
                        <AttractionCard key={attraction.productCode} attraction={attraction} />
                    ))}
                </div>
            );
        }
        return (
            <div className="text-center py-10">
                <p className="text-xl text-gray-300">No se encontraron atracciones con los filtros seleccionados.</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white p-4 sm:p-8 relative overflow-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none flex justify-center" aria-hidden="true">
                <img
                    src="https://static.wixstatic.com/media/86b1c8_aa13c5837d9344b793e3ec2b6f6c8801~mv2.png"
                    alt=""
                    className="w-2/3 md:w-1/2 lg:w-2/5 opacity-20 mix-blend-lighten"
                    style={{
                        objectFit: 'contain',
                        objectPosition: 'center top',
                        height: '100vh',
                    }}
                />
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-black/20 z-0"></div>
            <main className="relative z-10 container mx-auto">
                <header className="text-center my-12">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        Borí Shop
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                        Descubre los mejores tours y actividades en la Isla del Encanto. Filtra por tu aventura ideal y reserva hoy.
                    </p>
                </header>

                <div className="bg-black/5 rounded-2xl p-4 sm:p-8 border border-white/10 mb-8">
                    <CategoryFilter
                        categories={allCategories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                    />
                </div>

                <div className="bg-black/5 rounded-2xl p-4 sm:p-8 border border-white/10">
                    <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-purple-500/50 pb-3">
                        Tours y Actividades Populares
                    </h2>
                    {renderContent()}
                </div>

                <footer className="text-center text-gray-400 mt-12 text-sm">
                    <p>&copy; {new Date().getFullYear()} Borí Shop. Potenciado por Viator y React.</p>
                </footer>
            </main>
        </div>
    );
};

export default App;
