
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { PrayerTimes as PrayerTimesType, fetchPrayerTimes, getNextPrayer } from "@/utils/api";
import TimeCard from "./TimeCard";
import { Sun, Clock, MoonStar, CloudSun, CloudMoon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PrayerTimesProps {
  city: string;
}

const PrayerTimes: React.FC<PrayerTimesProps> = ({ city }) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadPrayerTimes = async () => {
      setLoading(true);
      try {
        const times = await fetchPrayerTimes(city);
        setPrayerTimes(times);
        
        if (times) {
          setNextPrayer(getNextPrayer(times));
        }
      } catch (error) {
        console.error("Error loading prayer times:", error);
        toast({
          title: "Error",
          description: "Gagal memuat jadwal sholat. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPrayerTimes();
    
    // Refresh every minute to update "next prayer"
    const interval = setInterval(() => {
      if (prayerTimes) {
        setNextPrayer(getNextPrayer(prayerTimes));
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [city, toast]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] animate-pulse">
        <div className="h-6 w-40 bg-muted rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="prayer-card h-24"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!prayerTimes) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-muted-foreground">Data tidak tersedia</p>
      </div>
    );
  }
  
  const formatDisplayDate = (dateStr: string) => {
    if (dateStr === "Hari Ini") return dateStr;
    return dateStr;
  };
  
  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-xl font-medium text-center mb-6">
        Jadwal Sholat {city} - {formatDisplayDate(prayerTimes.date)}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl mx-auto">
        <TimeCard 
          name="Imsak" 
          time={prayerTimes.imsak} 
          icon={<Clock className="h-5 w-5" />}
        />
        <TimeCard 
          name="Subuh" 
          time={prayerTimes.fajr} 
          isNext={nextPrayer?.name === 'Subuh'} 
          icon={<CloudMoon className="h-5 w-5" />}
        />
        <TimeCard 
          name="Dzuhur" 
          time={prayerTimes.dhuhr} 
          isNext={nextPrayer?.name === 'Dzuhur'} 
          icon={<Sun className="h-5 w-5" />}
        />
        <TimeCard 
          name="Ashar" 
          time={prayerTimes.asr} 
          isNext={nextPrayer?.name === 'Ashar'} 
          icon={<CloudSun className="h-5 w-5" />}
        />
        <TimeCard 
          name="Maghrib" 
          time={prayerTimes.maghrib} 
          isNext={nextPrayer?.name === 'Maghrib'} 
          icon={<MoonStar className="h-5 w-5" />}
        />
        <TimeCard 
          name="Isya" 
          time={prayerTimes.isha} 
          isNext={nextPrayer?.name === 'Isya'} 
          icon={<MoonStar className="h-5 w-5" />}
        />
      </div>
    </div>
  );
};

export default PrayerTimes;
