
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

// Approximate coordinates for all regions in Central Java
// In a production app, these would be more precise
const REGION_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  // Kabupaten
  "Kabupaten Banjarnegara": { latitude: -7.3971, longitude: 109.6915 },
  "Kabupaten Banyumas": { latitude: -7.5031, longitude: 109.2031 },
  "Kabupaten Batang": { latitude: -7.0392, longitude: 109.8894 },
  "Kabupaten Blora": { latitude: -7.0122, longitude: 111.3799 },
  "Kabupaten Boyolali": { latitude: -7.5316, longitude: 110.5969 },
  "Kabupaten Brebes": { latitude: -6.8725, longitude: 109.0428 },
  "Kabupaten Cilacap": { latitude: -7.7257, longitude: 109.0118 },
  "Kabupaten Demak": { latitude: -6.8944, longitude: 110.6384 },
  "Kabupaten Grobogan": { latitude: -7.0135, longitude: 110.9177 },
  "Kabupaten Jepara": { latitude: -6.5827, longitude: 110.6677 },
  "Kabupaten Karanganyar": { latitude: -7.5981, longitude: 111.0453 },
  "Kabupaten Kebumen": { latitude: -7.6681, longitude: 109.6526 },
  "Kabupaten Kendal": { latitude: -7.0264, longitude: 110.1879 },
  "Kabupaten Klaten": { latitude: -7.7022, longitude: 110.6031 },
  "Kabupaten Kudus": { latitude: -6.8102, longitude: 110.8418 },
  "Kabupaten Magelang": { latitude: -7.4305, longitude: 110.2832 },
  "Kabupaten Pati": { latitude: -6.7559, longitude: 111.0389 },
  "Kabupaten Pekalongan": { latitude: -7.0317, longitude: 109.6242 },
  "Kabupaten Pemalang": { latitude: -6.8881, longitude: 109.3784 },
  "Kabupaten Purbalingga": { latitude: -7.3892, longitude: 109.3759 },
  "Kabupaten Purworejo": { latitude: -7.7132, longitude: 110.0079 },
  "Kabupaten Rembang": { latitude: -6.8082, longitude: 111.4277 },
  "Kabupaten Semarang": { latitude: -7.2001, longitude: 110.4399 },
  "Kabupaten Sragen": { latitude: -7.4278, longitude: 111.0091 },
  "Kabupaten Sukoharjo": { latitude: -7.6484, longitude: 110.8559 },
  "Kabupaten Tegal": { latitude: -6.8637, longitude: 109.1058 },
  "Kabupaten Temanggung": { latitude: -7.3156, longitude: 110.1742 },
  "Kabupaten Wonogiri": { latitude: -7.8138, longitude: 110.9231 },
  "Kabupaten Wonosobo": { latitude: -7.3632, longitude: 109.9005 },
  
  // Kota
  "Kota Magelang": { latitude: -7.4797, longitude: 110.2177 },
  "Kota Pekalongan": { latitude: -6.8898, longitude: 109.6746 },
  "Kota Salatiga": { latitude: -7.3305, longitude: 110.5084 },
  "Kota Semarang": { latitude: -7.0051, longitude: 110.4381 },
  "Kota Surakarta": { latitude: -7.5591, longitude: 110.8291 },
  "Kota Tegal": { latitude: -6.8797, longitude: 109.1256 },
};

// Default to Kota Semarang if region not found
const DEFAULT_COORDS = { latitude: -7.0051, longitude: 110.4381 };

export async function fetchPrayerTimes(region: string, date: Date = new Date()): Promise<PrayerTimes | null> {
  try {
    const coords = REGION_COORDINATES[region] || DEFAULT_COORDS;
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
