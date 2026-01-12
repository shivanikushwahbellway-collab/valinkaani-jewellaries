import React, { useState, useRef, useEffect } from "react";

interface ImageZoomProps {
    src: string;
    alt?: string;
    zoomScale?: number;
    className?: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({
    src,
    alt = "Product Image",
    zoomScale = 2.5,
    className = "",
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [showRight, setShowRight] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const { left, width, height, top } = containerRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;

        // Check space on right
        const spaceOnRight = windowWidth - (left + width);
        setShowRight(spaceOnRight > width); // If space is less than width, show on left

        // Mouse position relative to the container
        let x = e.clientX - left;
        let y = e.clientY - top;

        // Constrain x and y within the container bounds
        x = Math.max(0, Math.min(x, width));
        y = Math.max(0, Math.min(y, height));

        setCursorPosition({ x, y });

        // Calculate background position for the zoomed image
        const moveX = (x / width) * 100;
        const moveY = (y / height) * 100;

        setPosition({ x: moveX, y: moveY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    return (
        <div
            ref={containerRef}
            className={`relative cursor-crosshair ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Internal container to keep image clipped while allowing preview to overflow */}
            <div className="w-full h-full overflow-hidden rounded-xl relative">
                {/* Main Image */}
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover transition-opacity duration-300"
                />

                {/* Lens */}
                {isHovering && (
                    <div
                        className="absolute border border-gray-400/30 bg-white/20 pointer-events-none transition-opacity duration-200 z-10"
                        style={{
                            left: `${cursorPosition.x}px`,
                            top: `${cursorPosition.y}px`,
                            width: `${100 / zoomScale}%`,
                            height: `${100 / zoomScale}%`,
                            transform: "translate(-50%, -50%)",
                            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        }}
                    />
                )}
            </div>

            {/* Side Zoom Preview Box - Flipkart style */}
            {isHovering && (
                <div
                    className={`absolute top-0 w-[120%] h-[120%] z-[100] pointer-events-none bg-white overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-300 rounded-lg`}
                    style={{
                        [showRight ? "left" : "right"]: "110%",
                        backgroundImage: `url(${src})`,
                        backgroundPosition: `${position.x}% ${position.y}%`,
                        backgroundSize: `${zoomScale * 100}%`,
                        backgroundRepeat: "no-repeat",
                    }}
                />
            )}
        </div>
    );
};

export default ImageZoom;
