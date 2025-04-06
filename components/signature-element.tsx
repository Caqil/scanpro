// Enhanced SignatureElement component with improved mobile touch handling

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SignatureElementProps {
  element: {
    id: string;
    type: 'signature' | 'text' | 'stamp' | 'drawing' | 'image';
    position: { x: number; y: number };
    size: { width: number; height: number };
    data: string;
    rotation?: number;
    scale?: number;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
  onUpdate: (id: string, position: { x: number; y: number }) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  scale: number;
}

export const SignatureElement: React.FC<SignatureElementProps> = ({
  element,
  onUpdate,
  onSelect,
  isSelected,
  scale = 1,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(element.position);
  
  // Track touch start position for mobile
  const touchStartRef = useRef({ x: 0, y: 0 });
  // Track element's original position at touch start
  const elementStartPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setPosition(element.position);
  }, [element.position]);

  // Handle touch start event - specifically for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent default to avoid screen scrolling during drag
    e.preventDefault();
    
    // Select the element
    onSelect(element.id);
    
    // Record the start touch position
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    
    // Record the element's current position
    elementStartPosRef.current = {
      x: position.x,
      y: position.y
    };
    
    setIsDragging(true);
  };

  // Handle touch move event - specifically for mobile
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    // Prevent default to avoid screen scrolling during drag
    e.preventDefault();
    
    // Calculate the delta movement from the touch start
    const deltaX = (e.touches[0].clientX - touchStartRef.current.x) / scale;
    const deltaY = (e.touches[0].clientY - touchStartRef.current.y) / scale;
    
    // Update position based on the original position plus the delta
    const newPosition = {
      x: elementStartPosRef.current.x + deltaX,
      y: elementStartPosRef.current.y + deltaY
    };
    
    setPosition(newPosition);
  };

  // Handle touch end event - specifically for mobile
  const handleTouchEnd = () => {
    if (isDragging) {
      // Update the parent component with the new position
      onUpdate(element.id, position);
      setIsDragging(false);
    }
  };

  // This is for mouse interactions on desktop
  const handleDragEnd = (event: any, info: any) => {
    const newPosition = {
      x: position.x + info.offset.x / scale,
      y: position.y + info.offset.y / scale,
    };
    setPosition(newPosition);
    onUpdate(element.id, newPosition);
  };

  // Render the appropriate content based on element type
  const renderContent = () => {
    switch (element.type) {
      case 'signature':
      case 'image':
        return (
          <img
            src={element.data}
            alt="Signature"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            draggable="false"
          />
        );
      case 'text':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              color: element.color || '#000',
              fontSize: `${element.fontSize || 16}px`,
              fontFamily: element.fontFamily || 'Arial',
              userSelect: 'none',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
            }}
          >
            {element.data}
          </div>
        );
      case 'stamp':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              border: '2px solid red',
              color: 'red',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              userSelect: 'none',
              pointerEvents: 'none',
              padding: '4px',
            }}
          >
            {element.data.toUpperCase()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={elementRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: element.size.width,
        height: element.size.height,
        cursor: 'move',
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        opacity: element.scale || 1,
        touchAction: 'none', // Important for preventing browser gestures during touch
      }}
      className={`signature-element ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => onSelect(element.id)}
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
    >
      {renderContent()}
      {isSelected && (
        <div className="absolute -top-2 -left-2 -right-2 -bottom-2 border-2 border-dashed border-primary rounded-sm pointer-events-none" />
      )}
    </motion.div>
  );
};