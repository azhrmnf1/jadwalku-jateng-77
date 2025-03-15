
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

// List of regions in Central Java
const JATENG_REGIONS = {
  kabupaten: [
    "Banjarnegara", "Banyumas", "Batang", "Blora", "Boyolali",
    "Brebes", "Cilacap", "Demak", "Grobogan", "Jepara",
    "Karanganyar", "Kebumen", "Kendal", "Klaten", "Kudus",
    "Magelang", "Pati", "Pekalongan", "Pemalang", "Purbalingga",
    "Purworejo", "Rembang", "Semarang", "Sragen", "Sukoharjo",
    "Tegal", "Temanggung", "Wonogiri", "Wonosobo"
  ],
  kota: [
    "Magelang", "Pekalongan", "Salatiga", "Semarang", "Surakarta", "Tegal"
  ]
};

// Create a flat list for all regions (for location detection)
const ALL_REGIONS = [
  ...JATENG_REGIONS.kabupaten.map(name => `Kabupaten ${name}`),
  ...JATENG_REGIONS.kota.map(name => `Kota ${name}`)
];

interface LocationSelectorProps {
  onChange: (city: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onChange }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("Kota Semarang");
  const [gpsStatus, setGpsStatus] = useState<string>("idle");
  
  useEffect(() => {
    onChange(selectedRegion);
  }, [selectedRegion, onChange]);
  
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
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
        // In a real app, we would use the coordinates to determine the closest region
        // For now, we'll just simulate it with a random region from our list
        const randomIndex = Math.floor(Math.random() * ALL_REGIONS.length);
        const detected = ALL_REGIONS[randomIndex];
        
        setSelectedRegion(detected);
        toast.success(`Lokasi terdeteksi: ${detected}`);
        setGpsStatus("success");
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Gagal mendeteksi lokasi. Silakan pilih lokasi secara manual.");
        setGpsStatus("error");
      }
    );
  };
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto mb-6 animate-slide-up">
      <Select value={selectedRegion} onValueChange={handleRegionChange}>
        <SelectTrigger className="w-full bg-white dark:bg-gray-800 text-foreground border-blue-100 dark:border-gray-700">
          <SelectValue placeholder="Pilih wilayah" />
        </SelectTrigger>
        <SelectContent className="max-h-80 bg-white dark:bg-gray-800 border dark:border-gray-700">
          <SelectGroup>
            <SelectLabel className="font-semibold text-primary dark:text-blue-400">Kabupaten</SelectLabel>
            {JATENG_REGIONS.kabupaten.sort().map((name) => (
              <SelectItem key={`kabupaten-${name}`} value={`Kabupaten ${name}`} className="text-foreground dark:text-white">
                Kabupaten {name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel className="font-semibold text-primary dark:text-blue-400">Kota</SelectLabel>
            {JATENG_REGIONS.kota.sort().map((name) => (
              <SelectItem key={`kota-${name}`} value={`Kota ${name}`} className="text-foreground dark:text-white">
                Kota {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <button
        onClick={detectLocation}
        className="flex items-center justify-center gap-2 rounded-lg py-2 px-4 bg-primary text-white hover:bg-primary/90 transition-colors"
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
