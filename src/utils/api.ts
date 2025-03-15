
import { format, isToday } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";

export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  imsak: string;
  date: string;
}

// Map city names to their respective IDs or coordinates that the API understands
// This is a simplified example - in a real app, you'd have a complete mapping
const CITY_MAPPINGS: Record<string, { latitude: number; longitude: number }> = {
  "Semarang": { latitude: -7.0051453, longitude: 110.4381254 },
  "Surakarta": { latitude: -7.5591122, longitude: 110.8291434 },
  "Yogyakarta": { latitude: -7.7955798, longitude: 110.3694896 },
  "Pekalongan": { latitude: -6.8898362, longitude: 109.6745916 },
  "Salatiga": { latitude: -7.3305234, longitude: 110.5084366 },
  "Tegal": { latitude: -6.8797041, longitude: 109.1255917 },
  "Magelang": { latitude: -7.4797342, longitude: 110.2176941 },
  // Add coordinates for other cities...
};

// Default to Semarang if city not found
const DEFAULT_COORDS = { latitude: -7.0051453, longitude: 110.4381254 };

export async function fetchPrayerTimes(city: string, date: Date = new Date()): Promise<PrayerTimes | null> {
  try {
    const coords = CITY_MAPPINGS[city] || DEFAULT_COORDS;
    const formattedDate = format(date, 'dd-MM-yyyy');
    
    // Using the Aladhan API for prayer times
    const url = `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=11`; // Method 11 = Egyptian General Authority of Survey
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code !== 200 || !data.data) {
      throw new Error("Invalid data received from API");
    }
    
    // Format time strings to local format (24h)
    const timings = data.data.timings;
    
    return {
      fajr: timings.Fajr,
      dhuhr: timings.Dhuhr,
      asr: timings.Asr,
      maghrib: timings.Maghrib,
      isha: timings.Isha,
      imsak: timings.Imsak,
      date: isToday(date) 
        ? "Hari Ini" 
        : format(date, "EEEE, d MMMM yyyy", { locale: id })
    };
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    toast.error("Gagal memuat jadwal sholat. Silakan coba lagi nanti.");
    return null;
  }
}

// Helper function to check if a time has passed
export function hasTimePassed(timeStr: string): boolean {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  const timeToday = new Date();
  timeToday.setHours(hours, minutes, 0, 0);
  
  return now > timeToday;
}

// Find the next prayer time
export function getNextPrayer(prayerTimes: PrayerTimes): { name: string; time: string } | null {
  if (!prayerTimes) return null;
  
  const prayers = [
    { name: 'Subuh', time: prayerTimes.fajr },
    { name: 'Dzuhur', time: prayerTimes.dhuhr },
    { name: 'Ashar', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isya', time: prayerTimes.isha }
  ];
  
  for (const prayer of prayers) {
    if (!hasTimePassed(prayer.time)) {
      return prayer;
    }
  }
  
  // If all prayers have passed, return the first prayer of tomorrow
  return { name: 'Subuh (besok)', time: prayerTimes.fajr };
}
