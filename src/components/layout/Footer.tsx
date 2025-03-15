
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-6 px-6 mt-auto bg-gradient-to-t from-blue-50 to-transparent dark:from-transparent dark:to-transparent">
      <div className="container mx-auto flex flex-col items-center justify-center text-sm text-muted-foreground">
        <p className="text-center">
          © {new Date().getFullYear()} JadwalKu Jateng
        </p>
        <p className="text-center mt-1">
          Dibuat oleh Azhari Munif
        </p>
      </div>
    </footer>
  );
};

export default Footer;
