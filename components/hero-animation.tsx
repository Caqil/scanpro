"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, FileText, FileImage, Table, File, Code, FileSpreadsheet, FileType, Copy, Layers, BarChart, PenTool } from 'lucide-react';

// Define the file format type
interface FileFormat {
  format: string;
  icon: React.ForwardRefExoticComponent<any>;
  color: string;
  bgColor: string;
  description: string;
}

// File format icons and their colors
const fileFormats: FileFormat[] = [
  { format: 'PDF', icon: FileText, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20', description: 'Document' },
  { format: 'DOCX', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20', description: 'Word' },
  { format: 'XLSX', icon: Table, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20', description: 'Excel' },
  { format: 'JPG', icon: FileImage, color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', description: 'Image' },
  { format: 'HTML', icon: Code, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20', description: 'Web' },
  { format: 'PPTX', icon: Layers, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20', description: 'PowerPoint' },
  { format: 'SVG', icon: PenTool, color: 'text-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', description: 'Vector' },
  { format: 'TXT', icon: FileType, color: 'text-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-900/20', description: 'Text' },
];

const HeroAnimation = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const [converting, setConverting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<FileFormat | null>(null);
  const [convertedFormat, setConvertedFormat] = useState<FileFormat | null>(null);
  const [conversionCount, setConversionCount] = useState(0);

  // Animation flow
  useEffect(() => {
    const interval = setInterval(() => {
      if (!converting) {
        // Start conversion animation
        setConverting(true);
        setSelectedFormat(fileFormats[activeIndex]);
        
        // Choose format to convert to based on a pattern for first few conversions
        let nextIndex;
        
        if (conversionCount < fileFormats.length - 1) {
          // For the first few animations, cycle through formats in order
          nextIndex = (activeIndex + 1) % fileFormats.length;
        } else {
          // After showing all formats, choose randomly
          do {
            nextIndex = Math.floor(Math.random() * fileFormats.length);
          } while (nextIndex === activeIndex);
        }
        
        setConvertedFormat(fileFormats[nextIndex]);
        
        // After conversion animation completes
        setTimeout(() => {
          setDirection(nextIndex > activeIndex ? 'right' : 'left');
          setActiveIndex(nextIndex);
          setConverting(false);
          setConversionCount(prev => prev + 1);
        }, 3000); // Total conversion animation time
      }
    }, 4000); // Interval between animations

    return () => clearInterval(interval);
  }, [activeIndex, converting, conversionCount]);

  // File format card component
  const FormatCard = ({ format, active = false, className = "" }: { format: FileFormat, active?: boolean, className?: string }) => {
    const Icon = format.icon;
    
    return (
      <motion.div 
        className={`flex flex-col items-center justify-center rounded-lg border-2 ${active ? 'border-primary shadow-lg' : 'border-border'} ${format.bgColor} p-3 ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        layout
      >
        <div className={`relative ${active ? 'animate-pulse-gentle' : ''}`}>
          <Icon className={`h-8 w-8 mb-1 ${format.color}`} />
          {active && (
            <motion.div 
              className="absolute inset-0 rounded-full"
              initial={{ boxShadow: `0 0 0 0 ${format.color.includes('red') ? 'rgba(239, 68, 68, 0.4)' : 
                                          format.color.includes('blue') ? 'rgba(59, 130, 246, 0.4)' : 
                                          format.color.includes('green') ? 'rgba(16, 185, 129, 0.4)' : 
                                          format.color.includes('yellow') ? 'rgba(245, 158, 11, 0.4)' : 
                                          format.color.includes('purple') ? 'rgba(139, 92, 246, 0.4)' : 
                                          format.color.includes('orange') ? 'rgba(249, 115, 22, 0.4)' : 
                                          format.color.includes('indigo') ? 'rgba(99, 102, 241, 0.4)' : 
                                          'rgba(156, 163, 175, 0.4)'}` }}
              animate={{ 
                boxShadow: [
                  `0 0 0 0 ${format.color.includes('red') ? 'rgba(239, 68, 68, 0)' : 
                              format.color.includes('blue') ? 'rgba(59, 130, 246, 0)' : 
                              format.color.includes('green') ? 'rgba(16, 185, 129, 0)' : 
                              format.color.includes('yellow') ? 'rgba(245, 158, 11, 0)' : 
                              format.color.includes('purple') ? 'rgba(139, 92, 246, 0)' : 
                              format.color.includes('orange') ? 'rgba(249, 115, 22, 0)' : 
                              format.color.includes('indigo') ? 'rgba(99, 102, 241, 0)' : 
                              'rgba(156, 163, 175, 0)'}`,
                  `0 0 15px 5px ${format.color.includes('red') ? 'rgba(239, 68, 68, 0.4)' : 
                                  format.color.includes('blue') ? 'rgba(59, 130, 246, 0.4)' : 
                                  format.color.includes('green') ? 'rgba(16, 185, 129, 0.4)' : 
                                  format.color.includes('yellow') ? 'rgba(245, 158, 11, 0.4)' : 
                                  format.color.includes('purple') ? 'rgba(139, 92, 246, 0.4)' : 
                                  format.color.includes('orange') ? 'rgba(249, 115, 22, 0.4)' : 
                                  format.color.includes('indigo') ? 'rgba(99, 102, 241, 0.4)' : 
                                  'rgba(156, 163, 175, 0.4)'}`,
                  `0 0 0 0 ${format.color.includes('red') ? 'rgba(239, 68, 68, 0)' : 
                              format.color.includes('blue') ? 'rgba(59, 130, 246, 0)' : 
                              format.color.includes('green') ? 'rgba(16, 185, 129, 0)' : 
                              format.color.includes('yellow') ? 'rgba(245, 158, 11, 0)' : 
                              format.color.includes('purple') ? 'rgba(139, 92, 246, 0)' : 
                              format.color.includes('orange') ? 'rgba(249, 115, 22, 0)' : 
                              format.color.includes('indigo') ? 'rgba(99, 102, 241, 0)' : 
                              'rgba(156, 163, 175, 0)'}`
                ],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
              }}
            />
          )}
        </div>
        <div className="text-center">
          <div className="text-sm font-bold">{format.format}</div>
          <div className="text-xs text-muted-foreground mt-1">{format.description}</div>
        </div>
      </motion.div>
    );
  };

  // Particles animation when conversion happens
  const ConversionEffect = ({ startX, startY, endX, endY }: { startX: number, startY: number, endX: number, endY: number }) => {
    const particles = Array.from({ length: 24 });
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((_, i) => {
          // Random particle paths
          const offsetX = Math.random() * 80 - 40;
          const offsetY = Math.random() * 80 - 40;
          const delay = Math.random() * 0.5;
          
          // Different particle shapes
          const shapes = [
            "w-2 h-2 rounded-full",
            "w-3 h-1 rounded-md",
            "w-1 h-3 rounded-md",
            "w-2 h-2 rotate-45 transform",
            "w-1 h-1 rounded-full",
          ];
          
          const shape = shapes[Math.floor(Math.random() * shapes.length)];
          
          // Mix of source and target colors
          const useTargetColor = Math.random() > 0.5;
          const particleColor = useTargetColor && convertedFormat
            ? convertedFormat.color.replace('text-', 'bg-')
            : selectedFormat
              ? selectedFormat.color.replace('text-', 'bg-')
              : '';
            
          // Particle opacity and scale variations
          const maxOpacity = 0.3 + Math.random() * 0.7; // Between 0.3 and 1.0
          const maxScale = 0.7 + Math.random() * 1.3;   // Between 0.7 and 2.0
          
          return (
            <motion.div
              key={i}
              initial={{ 
                x: startX, 
                y: startY,
                opacity: 0,
                scale: 0,
                rotate: Math.random() * 180,
              }}
              animate={{
                x: [startX, startX + offsetX, endX],
                y: [startY, startY + offsetY, endY],
                opacity: [0, maxOpacity, 0],
                scale: [0, maxScale, 0],
                transition: { 
                  duration: 1.5,
                  delay,
                  times: [0, 0.3, 1],
                  ease: ["easeOut", "easeIn"]
                }
              }}
              className={`absolute ${shape} ${particleColor} shadow-md`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto h-64 flex items-center justify-center">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Glass container effect */}
      <motion.div 
        className="absolute inset-0 backdrop-blur-sm bg-background/70 rounded-xl border border-border/60 overflow-hidden shadow-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -inset-[100px] opacity-20 blur-3xl"
            initial={{ background: "radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(255,255,255,0) 70%)" }}
            animate={{ 
              background: [
                "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(255,255,255,0) 70%)",
                "radial-gradient(circle, rgba(239,68,68,0.3) 0%, rgba(255,255,255,0) 70%)",
                "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(255,255,255,0) 70%)",
                "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(255,255,255,0) 70%)",
                "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(255,255,255,0) 70%)"
              ]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>

      {/* Grid layout for file formats */}
      <div className="grid grid-cols-5 w-full h-full px-4 py-8">
        {/* Left format carousel */}
        <div className="col-span-2 flex justify-end items-center pr-4">
          <AnimatePresence mode="wait">
            {!converting ? (
              <div>
                <motion.div
                  key={`source-${activeIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormatCard
                    format={fileFormats[activeIndex]}
                    active={true}
                  />
                </motion.div>
                <motion.div
                  className="mt-2 text-center text-xs font-medium text-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Source
                </motion.div>
              </div>
            ) : (
              <motion.div
                key="source-converting"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 0.95, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {selectedFormat && (
                  <FormatCard
                    format={selectedFormat}
                    active={true}
                    className="opacity-90"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Center conversion animation */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          {converting ? (
            <div className="relative z-10">
              {/* Processing indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotateY: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotateY: 360
                }}
                transition={{ 
                  duration: 2,
                  rotateY: { 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    duration: 1.5
                  }
                }}
                className="bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm rounded-lg p-3 shadow-xl"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="h-10 w-10 border-t-2 border-r-2 border-primary rounded-full"
                  />
                  <motion.div 
                    animate={{ rotate: -180 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="h-6 w-6 border-b-2 border-l-2 border-primary/70 rounded-full absolute inset-0 m-auto"
                  />
                </div>
              </motion.div>
              
              {/* Particles effect */}
              {selectedFormat && convertedFormat && (
                <ConversionEffect startX={-80} startY={0} endX={80} endY={0} />
              )}
              
              {/* Progress text */}
              <motion.div 
                className="absolute -bottom-6 left-0 right-0 text-center text-xs font-medium text-primary/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Converting
              </motion.div>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="bg-primary/10 rounded-full p-2"
            >
              <ChevronRight className="h-8 w-8 text-primary" />
            </motion.div>
          )}
        </div>
        
        {/* Target format */}
        <div className="col-span-2 flex justify-start items-center pl-4">
          <AnimatePresence mode="wait">
            {converting ? (
              <div>
                {convertedFormat && (
                  <motion.div
                    key="target-converting"
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      transition: { 
                        delay: 0.2,
                        duration: 0.5
                      }
                    }}
                  >
                    <FormatCard
                      format={convertedFormat}
                      active={false}
                    />
                  </motion.div>
                )}
                <motion.div
                  className="mt-2 text-center text-xs font-medium text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Target
                </motion.div>
              </div>
            ) : (
              <div>
                <motion.div
                  key={`target-${activeIndex}`}
                  initial={{ opacity: 0, x: direction === 'right' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormatCard
                    format={fileFormats[activeIndex]}
                    active={false}
                  />
                </motion.div>
                <motion.div
                  className="mt-2 text-center text-xs font-medium text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Result
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Format carousel indicators */}
      <motion.div 
        className="absolute -bottom-10 left-0 right-0 flex justify-center space-x-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {fileFormats.map((format, index) => (
          <motion.button
            key={format.format}
            className={`flex flex-col items-center`}
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              if (!converting) {
                setDirection(index > activeIndex ? 'right' : 'left');
                setActiveIndex(index);
              }
            }}
          >
            <div className={`h-1.5 w-8 rounded-full mb-1 ${index === activeIndex ? 'bg-primary' : 'bg-muted'}`} />
            <span className={`text-xs ${index === activeIndex ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
              {format.format}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default HeroAnimation;