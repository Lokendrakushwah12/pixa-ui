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

        const handleResize = () => setTranslateY(window.innerHeight);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);

    const openDrawer = () => {
        setTranslateY(0);
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        setTranslateY(window.innerHeight);
        document.body.style.overflow = '';
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartY(e.clientY || e.touches[0].clientY);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const clientY = e.clientY || e.touches[0].clientY;
        const deltaY = clientY - startY;
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
                aria-hidden={isOpen ? "false" : "true"}
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
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseUp}
                role="dialog"
                aria-modal="true"
            >
                <div className="w-full flex justify-center items-center"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                >
                    <div className="w-16 h-[5px] bg-[#c2c4c9] rounded-full cursor-grab my-4" />
                </div>

                <div className="px-4 pt-0 pb-4 w-full h-full overflow-y-auto">
                    {children}
                </div>
            </div>
        </>
    );
};

export default Drawer;
