// Enhanced PDF page container component with improved mobile support

import React, { useRef, useState } from 'react';
import { SignatureElement } from './signature-element';

interface PageContainerProps {
  page: {
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
    imageUrl?: string;
  };
  elements: Array<{
    id: string;
    type: 'signature' | 'text' | 'stamp' | 'drawing' | 'image';
    position: { x: number; y: number };
    size: { width: number; height: number };
    data: string;
    rotation?: number;
    scale?: number;
    page: number;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  }>;
  onElementUpdate: (id: string, position: { x: number; y: number }) => void;
  onElementSelect: (id: string) => void;
  selectedElementId: string | null;
  pageIndex: number;
  scale: number;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  page,
  elements,
  onElementUpdate,
  onElementSelect,
  selectedElementId,
  pageIndex,
  scale,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchBlocked, setTouchBlocked] = useState(false);

  // Filter elements for the current page
  const pageElements = elements.filter(element => element.page === pageIndex);

  // Handle container touch start - prevent default only when we have elements
  const handleContainerTouchStart = (e: React.TouchEvent) => {
    if (pageElements.length > 0) {
      // Don't prevent default here, just check if we should block page scrolling
      const touch = e.touches[0];
      
      // Check if the touch is on any of our signature elements
      const touchOnElement = pageElements.some(element => {
        const elementRect = {
          left: element.position.x,
          top: element.position.y,
          right: element.position.x + element.size.width,
          bottom: element.position.y + element.size.height,
        };
        
        // Get container bounds
        const container = containerRef.current?.getBoundingClientRect();
        if (!container) return false;
        
        // Adjust touch coordinates relative to the container
        const relativeX = (touch.clientX - container.left) / scale;
        const relativeY = (touch.clientY - container.top) / scale;
        
        // Check if touch is within element bounds
        return (
          relativeX >= elementRect.left &&
          relativeX <= elementRect.right &&
          relativeY >= elementRect.top &&
          relativeY <= elementRect.bottom
        );
      });
      
      if (touchOnElement) {
        // Only prevent default if we're touching a signature element
        e.preventDefault();
        setTouchBlocked(true);
      }
    }
  };

  // Clear the touch blocked state on touch end
  const handleContainerTouchEnd = () => {
    setTouchBlocked(false);
  };

  // Handle touch move on container
  const handleContainerTouchMove = (e: React.TouchEvent) => {
    // Only prevent default if we're interacting with an element
    if (touchBlocked) {
      e.preventDefault();
    }
  };

  return (
    <div className="relative mb-8 shadow-lg">
      <div
        ref={containerRef}
        className="relative bg-white"
        style={{
          width: page.width,
          height: page.height,
          touchAction: touchBlocked ? 'none' : 'auto', // Only disable touch actions when interacting with elements
        }}
        onTouchStart={handleContainerTouchStart}
        onTouchMove={handleContainerTouchMove}
        onTouchEnd={handleContainerTouchEnd}
      >
        {/* Page background */}
        {page.imageUrl && (
          <img
            src={page.imageUrl}
            alt={`Page ${pageIndex + 1}`}
            className="absolute top-0 left-0 w-full h-full object-contain"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
            draggable="false"
          />
        )}

        {/* Page elements */}
        {pageElements.map((element) => (
          <SignatureElement
            key={element.id}
            element={element}
            onUpdate={onElementUpdate}
            onSelect={onElementSelect}
            isSelected={selectedElementId === element.id}
            scale={scale}
          />
        ))}
      </div>
      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
        Page {pageIndex + 1}
      </div>
    </div>
  );
};