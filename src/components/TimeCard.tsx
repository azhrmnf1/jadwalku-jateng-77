
import React from "react";
import { cn } from "@/lib/utils";

interface TimeCardProps {
  name: string;
  time: string;
  isNext?: boolean;
  icon?: React.ReactNode;
}

const TimeCard: React.FC<TimeCardProps> = ({ name, time, isNext = false, icon }) => {
  return (
    <div 
      className={cn(
        "prayer-card group",
        isNext && "ring-2 ring-primary ring-opacity-50"
      )}
    >
      {isNext && (
        <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
          Selanjutnya
        </span>
      )}
      
      <div className="flex items-center gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        
        <div className="flex-1">
          <h3 className="font-medium text-foreground transition-colors">{name}</h3>
          <p className={cn(
            "text-2xl font-bold tracking-tight transition-colors",
            isNext ? "text-primary" : "text-foreground"
          )}>
            {time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimeCard;
