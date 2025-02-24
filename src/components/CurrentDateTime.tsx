// Front-End/src/components/CurrentDateTime.tsx
import React, { useEffect, useState } from 'react';

const CurrentDateTime: React.FC = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-black font-bold text-xl md:text-lg lg:text-xl mr-20 md:mr-5 lg:mr-20">
            {currentDateTime.toLocaleString()}
        </div>
    );
};

export default CurrentDateTime;