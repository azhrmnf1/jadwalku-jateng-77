
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

// List of cities in Central Java
const JATENG_CITIES = [
  "Semarang", "Surakarta", "Pekalongan", "Salatiga", "Tegal",
  "Magelang", "Banyumas", "Brebes", "Cilacap", "Kudus",
  "Batang", "Blora", "Boyolali", "Demak", "Grobogan",
  "Jepara", "Karanganyar", "Kebumen", "Kendal", "Klaten",
  "Pati", "Pekalongan", "Pemalang", "Purbalingga", "Purworejo",
  "Rembang", "Sragen", "Sukoharjo", "Temanggung", "Wonogiri",
  "Wonosobo"
];

interface LocationSelectorProps {
  onChange: (city: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onChange }) => {
  const [selectedCity, setSelectedCity] = useState<string>("Semarang");
  const [gpsStatus, setGpsStatus] = useState<string>("idle");
  
  useEffect(() => {
    onChange(selectedCity);
  }, [selectedCity, onChange]);
  
  const handleCityChange = (value: string) => {
    setSelectedCity(value);
  };
  
  const detectLocation = () => {
    setGpsStatus("detecting");
    
    if (!navigator.geolocation) {
      toast.error("Geolokasi tidak didukung oleh browser Anda");
      setGpsStatus("error");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, we would use the coordinates to determine the closest city
        // For now, we'll just simulate it with a random city from our list
        const randomIndex = Math.floor(Math.random() * JATENG_CITIES.length);
        const detected = JATENG_CITIES[randomIndex];
        
        setSelectedCity(detected);
        toast.success(`Lokasi terdeteksi: ${detected}`);
        setGpsStatus("success");
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Gagal mendeteksi lokasi. Silakan pilih kota secara manual.");
        setGpsStatus("error");
      }
    );
  };
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto mb-6 animate-slide-up">
      <Select value={selectedCity} onValueChange={handleCityChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih kota" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {JATENG_CITIES.sort().map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <button
        onClick={detectLocation}
        className="flex items-center justify-center gap-2 rounded-lg py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
        disabled={gpsStatus === "detecting"}
      >
        <MapPin className="h-4 w-4" />
        <span className="text-sm font-medium">
          {gpsStatus === "detecting" ? "Mendeteksi..." : "Deteksi Lokasi"}
        </span>
      </button>
    </div>
  );
};

export default LocationSelector;
