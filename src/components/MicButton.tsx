import { Mic } from "lucide-react";
import { motion } from "framer-motion";

interface MicButtonProps {
  isListening?: boolean;
  onClick: () => void;
  size?: "lg" | "xl";
}

const MicButton = ({ isListening = false, onClick, size = "xl" }: MicButtonProps) => {
  const sizeClasses = size === "xl" ? "w-28 h-28" : "w-16 h-16";
  const iconSize = size === "xl" ? 40 : 24;
  const ringSize = size === "xl" ? 112 : 64;

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      {isListening && (
        <>
          <span
            className="absolute rounded-full bg-primary/20 animate-pulse-ring"
            style={{ width: ringSize, height: ringSize }}
          />
          <span
            className="absolute rounded-full bg-primary/10 animate-pulse-ring"
            style={{ animationDelay: "0.5s", width: ringSize, height: ringSize }}
          />
          <span
            className="absolute rounded-full bg-primary/5 animate-pulse-ring"
            style={{ animationDelay: "1s", width: ringSize, height: ringSize }}
          />
        </>
      )}
      {/* Static ring */}
      {!isListening && (
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full border-2 border-dashed border-primary/20"
          style={{ width: ringSize + 24, height: ringSize + 24 }}
        />
      )}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.08 }}
        onClick={onClick}
        className={`${sizeClasses} rounded-full bg-gradient-hero flex items-center justify-center shadow-glow text-primary-foreground relative z-10 cursor-pointer`}
      >
        <Mic size={iconSize} />
      </motion.button>
    </div>
  );
};

export default MicButton;
