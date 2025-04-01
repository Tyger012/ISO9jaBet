import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LuckyWheelProps extends React.HTMLAttributes<HTMLDivElement> {
  isSpinning?: boolean;
  onSpinComplete?: () => void;
  size?: "sm" | "md" | "lg";
  result?: number;
}

// Ensure spin animation lasts exactly 5 seconds
const SPIN_DURATION = 5; // in seconds

export function LuckyWheel({
  className,
  isSpinning = false,
  onSpinComplete,
  size = "md",
  result,
  ...props
}: LuckyWheelProps) {
  const sizeClasses = {
    sm: "w-40 h-40",
    md: "w-56 h-56",
    lg: "w-72 h-72",
  };

  // Calculate rotation based on result
  const getResultRotation = () => {
    // Each option takes up a portion of the wheel
    // The wheel is divided into 6 segments
    if (result === undefined || isSpinning === false) return 0;
    
    // Map result to segment
    const segmentMap: Record<number, number> = {
      3000: 0,   // 0-60 degrees
      4000: 60,  // 60-120 degrees
      5000: 120, // 120-180 degrees
      6000: 180, // 180-240 degrees
      7000: 240, // 240-300 degrees
      8000: 300, // 300-360 degrees
    };
    
    // Add some randomness within the segment
    const baseRotation = segmentMap[result] || 0;
    const randomOffset = Math.random() * 40 - 20; // random offset between -20 and 20 degrees
    
    // Add multiple rotations for effect (8 full rotations plus the target position)
    // This makes the wheel spin more realistically over the 5 seconds
    return 2880 + baseRotation + randomOffset; // 2880 = 8 * 360
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <motion.div
        className={cn(
          "lucky-wheel rounded-full relative",
          sizeClasses[size]
        )}
        animate={{
          rotate: isSpinning ? getResultRotation() : 0,
        }}
        transition={{
          duration: SPIN_DURATION,
          ease: [0.32, 0.72, 0.15, 0.95], // Custom cubic bezier curve for a more realistic spin-down effect
          type: "tween"
        }}
        onAnimationComplete={() => {
          if (isSpinning && onSpinComplete) {
            onSpinComplete();
          }
        }}
        style={{
          background: "conic-gradient(#DC2626 0% 10%, #F59E0B 10% 25%, #10B981 25% 50%, #3B82F6 50% 65%, #8B5CF6 65% 80%, #EC4899 80% 100%)",
        }}
      >
        {/* Wheel segments */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <div 
              key={i}
              className="absolute w-1/2 h-0.5 bg-white/20"
              style={{ 
                transformOrigin: "0 center",
                transform: `rotate(${deg}deg)` 
              }}
            />
          ))}
        </div>
        
        {/* Wheel center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center z-10 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-500">
            <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.937 6.937 0 006.229 6.71c.15 1.5.692 3.221 1.878 4.74a.75.75 0 001.075.055A17.926 17.926 0 0016.752 14c.366.54.695 1.087.979 1.638a16.91 16.91 0 003.012-.982.75.75 0 00.321-1.154 18.126 18.126 0 01-2.53-3.364 750.025 750.025 0 01-2.154-3.475 1.2 1.2 0 00-.211-.319 3.856 3.856 0 01-.389-.812c-.163-.539-.22-1.05-.217-1.503a19.441 19.441 0 015.332-9.316.75.75 0 00-.186-1.22c-1.245-.578-2.749-.92-4.23-.92a9.747 9.747 0 00-2.333.287 19.292 19.292 0 01-8.248 3.138.75.75 0 00-.588.78c.008.934.223 1.793.583 2.553.091.19.198.379.325.555.073.1.15.193.226.291a16.68 16.68 0 00-3.721 5.207.75.75 0 00.417 1 19.277 19.277 0 006.5 1.166c-.073.283-.148.562-.205.837a.75.75 0 00.217.67 19.046 19.046 0 005.013 3.425c.505.222 1.125-.094 1.153-.633.028-.547.082-1.081.153-1.605z" clipRule="evenodd" />
          </svg>
        </div>
      </motion.div>
      
      {/* Wheel pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-20">
        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[20px] border-l-transparent border-r-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
}
