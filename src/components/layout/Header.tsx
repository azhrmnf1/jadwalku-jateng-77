
import { useState, useEffect } from "react";
import ThemeToggle from "../ThemeToggle";
import { Clock } from "lucide-react";

const Header = () => {
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  const formattedDate = date.toLocaleDateString('id-ID', options);
  
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center animate-fade-in">
      <div className="flex items-center space-x-2">
        <Clock className="h-6 w-6 text-primary" />
        <h1 className="text-xl md:text-2xl font-semibold">JadwalKu</h1>
      </div>
      
      <div className="hidden md:block text-center text-sm text-muted-foreground">
        {formattedDate}
      </div>
      
      <div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
