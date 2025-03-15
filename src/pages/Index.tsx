
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LocationSelector from "@/components/LocationSelector";
import PrayerTimes from "@/components/PrayerTimes";
import CurrentTime from "@/components/CurrentTime";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  const [selectedCity, setSelectedCity] = useState("Semarang");

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 animate-fade-in">
              Jadwal Sholat Jawa Tengah
            </h1>
            <p className="text-center text-muted-foreground mb-8 animate-fade-in delay-100">
              Jadwal sholat dan imsakiyah untuk seluruh kabupaten/kota di Jawa Tengah
            </p>
            
            <CurrentTime />
            
            <LocationSelector onChange={handleCityChange} />
            
            <div className="mt-8">
              <PrayerTimes city={selectedCity} />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
