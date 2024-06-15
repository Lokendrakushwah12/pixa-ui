import React, { useState, useRef, useEffect } from 'react';

const Drawer = ({ isOpen, onClose, children }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [translateY, setTranslateY] = useState(window.innerHeight);
    const drawerRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            openDrawer();
        } else {
            closeDrawer();
        }
    }, [isOpen]);

    const openDrawer = () => {
        setTranslateY(0);
    };

    const closeDrawer = () => {
        setTranslateY(window.innerHeight);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartY(e.clientY);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const deltaY = e.clientY - startY;
        if (deltaY > 0) {
            setTranslateY(deltaY);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (translateY > 100) {
            closeDrawer();
            onClose && onClose();
        } else {
            setTranslateY(0);
        }
    };

    const handleOverlayClick = () => {
        if (!isDragging) {
            closeDrawer();
            onClose && onClose();
        }
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-30 bg-[#000] bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={handleOverlayClick}
            ></div>

            <div
                ref={drawerRef}
                className={`fixed max-h-[80vh] flex flex-col justify-center items-center select-none bottom-0 z-40 rounded-t-xl left-0 w-full bg-white shadow-lg transition-transform transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{
                    transform: `translateY(${isOpen ? translateY : window.innerHeight}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease'
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseDown={handleMouseDown}
            >
                <div className="w-12 h-1 bg-gray-400 rounded-full cursor-grab my-4" onMouseDown={handleMouseDown} />

                <div className="p-4 w-full h-full overflow-y-auto">
                    {children}
                </div>
            </div>
        </>
    );
};

export default Drawer;
