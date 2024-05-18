import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="fixed bottom-8 right-8">
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    className="w-10 h-10 bg-[#212121] text-white rounded-full shadow-lg hover:bg-[#121212] transition-all flex items-center justify-center"
                    initial={{ y: '180%' }}
                    animate={{ y: 1 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', stiffness: 1000, damping: 1000 }}
                >

                    <button
                        onClick={scrollToTop}
                        className="w-8 h-8 bg-[#212121] text-white rounded-full shadow-lg hover:bg-[#121212] transition-all"
                    >
                        ↑
                    </button>
                </motion.button>
            )}
        </div>
    );
};

export default ScrollToTop;
