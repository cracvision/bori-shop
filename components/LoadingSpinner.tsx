
import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-purple-500"></div>
        </div>
    );
};

export default LoadingSpinner;
