
import { useState, useEffect } from "react";

const CurrentTime = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };
  
  return (
    <div className="flex flex-col items-center justify-center glass-card rounded-full py-4 px-8 mb-6 mx-auto max-w-xs animate-fade-in">
      <div className="text-3xl font-bold tracking-tight">
        {formatTime(time)}
      </div>
      <div className="text-sm text-muted-foreground">
        Waktu Lokal
      </div>
    </div>
  );
};

export default CurrentTime;
