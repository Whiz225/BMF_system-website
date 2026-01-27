"use client";

import Image from "next/image";
import { useState } from "react";

export default function Logo({
  size = "medium",
  className = "",
  showText = true,
  customLogo = null,
  businessName = "Foam Business",
  tagline = "Quality Mattress & Foam Solutions",
}) {
  const [imageError, setImageError] = useState(false);

  // Size mapping
  const sizeMap = {
    small: { width: 32, height: 32, textSize: "text-lg" },
    medium: { width: 48, height: 48, textSize: "text-xl" },
    large: { width: 64, height: 64, textSize: "text-2xl" },
    xlarge: { width: 80, height: 80, textSize: "text-3xl" },
  };

  const { width, height, textSize } = sizeMap[size] || sizeMap.medium;

  return (
    <div className={`flex items-center ${className}`}>
      {/* Custom Logo Image or Default */}
      <div className="relative flex-shrink-0">
        {customLogo ? (
          <div
            className="relative"
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <Image
              src={customLogo}
              alt={`${businessName} Logo`}
              fill
              className="object-contain"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 32px, (max-width: 1200px) 48px, 64px"
            />
          </div>
        ) : (
          <div
            className={`relative rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center`}
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            {/* Default logo - you can replace this with your initials */}
            <span className="text-white font-bold text-sm">
              {businessName.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Business Name and Tagline */}
      {showText && (
        <div className="ml-3">
          <h1 className={`font-bold text-gray-900 dark:text-white ${textSize}`}>
            {businessName}
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400">{tagline}</p>
        </div>
      )}
    </div>
  );
}

// Configuration file for business info
export const businessConfig = {
  name: "Best-Muca",
  tagline: "Quality Mattress & Foam Solutions",
  email: "info@bestmucafoambusiness.com",
  phone: "+234 706 747 9006",
  address: "No 2 Douglas Street, Menax, Onitsha Anambra State, Nigeria",
  logo: "/img/BMF_logo.png", // Path to your logo in public folder
  heroImage: "/hero-image.jpg", // Path to your hero image
  aboutImage: "/img/BMF_image.jpg", // Path to your about image
};
