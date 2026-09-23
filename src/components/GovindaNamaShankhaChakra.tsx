import React from 'react';

interface GovindaNamaShankhaChakraProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  height?: number | string;
  variant?: 'full' | 'namam-only' | 'badge';
  title?: string;
}

/**
 * Sacred Govinda Nama Shankha Chakra (శంఖు చక్ర నామాలు)
 * Authentic symbol of Lord Venkateswara (Balaji / Hari / Govinda) of Tirumala Tirupati.
 * Features:
 * - Left: Sacred Panchajanya Shankha (Conch) with divine golden flame aura
 * - Center: Sacred Tirupati Govinda Namam (Thirunamam / Urdhva Pundra) with white arms,
 *           vibrant sacred red Sri Choornam (Lakshmi Tilakam), and golden lotus base
 * - Right: Sacred Sudarshana Chakra (Divine Discus) with celestial flames and radiant spokes
 */
export const GovindaNamaShankhaChakra: React.FC<GovindaNamaShankhaChakraProps> = ({
  className = '',
  size = 'md',
  height,
  variant = 'full',
  title = 'Govinda Nama Shankha Chakra — Lord Venkateswara Sacred Emblem'
}) => {
  // Height mapping if explicit height is not provided
  const heightClass = {
    xs: 'h-5',
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16'
  }[size];

  if (variant === 'namam-only') {
    return (
      <svg
        viewBox="0 0 80 100"
        className={`${height ? '' : heightClass} ${className} shrink-0 drop-shadow-xs`}
        style={height ? { height } : undefined}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={title}
        role="img"
      >
        <title>{title}</title>
        <defs>
          <linearGradient id="namamGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF1B8" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>
          <linearGradient id="namamRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF4D4F" />
            <stop offset="40%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#9F1239" />
          </linearGradient>
          <filter id="namamGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#D4AF37" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Golden Lotus Pedestal Base (Padma Peetham) */}
        <g filter="url(#namamGlow)">
          <path
            d="M24,78 C30,73 36,75 40,79 C44,75 50,73 56,78 C54,84 48,89 40,90 C32,89 26,84 24,78 Z"
            fill="url(#namamGoldGrad)"
            stroke="#B45309"
            strokeWidth="0.8"
          />
          <circle cx="40" cy="85" r="2.2" fill="#E11D48" stroke="#FFEBA5" strokeWidth="0.5" />
        </g>

        {/* White Outer Namam Prongs (Holy Lotus Feet / Pachakarpuram) */}
        <path
          d="M18,16 C22,28 27,48 29,66 C30,74 34,77 40,77 C46,77 50,74 51,66 C53,48 58,28 62,16 C57,22 51,32 49,46 C47,56 45,63 40,63 C35,63 33,56 31,46 C29,32 23,22 18,16 Z"
          fill="#FFFFFF"
          stroke="#D4AF37"
          strokeWidth="1.2"
          strokeLinejoin="round"
          filter="url(#namamGlow)"
        />

        {/* Center Sacred Red Sri Choornam (Lakshmi Devi Sindoor) */}
        <path
          d="M40,16 C41.5,19 42.8,25 42.8,38 L42.5,70 C42.5,72 41.5,73 40,73 C38.5,73 37.5,72 37.5,70 L37.2,38 C37.2,25 38.5,19 40,16 Z"
          fill="url(#namamRedGrad)"
          stroke="#FFE4E6"
          strokeWidth="0.6"
        />
        {/* Tilakam Top Flame / Golden Bindu */}
        <polygon points="40,11 41.8,17 38.2,17" fill="#FDE047" stroke="#D4AF37" strokeWidth="0.4" />
      </svg>
    );
  }

  // Full Sacred Emblem: Shankha + Govinda Namam + Chakra
  return (
    <svg
      viewBox="0 0 250 95"
      className={`${height ? '' : heightClass} ${className} shrink-0 drop-shadow-xs`}
      style={height ? { height } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={title}
      role="img"
    >
      <title>{title}</title>
      <defs>
        {/* Divine Golden Gradients */}
        <linearGradient id="divineGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7D6" />
          <stop offset="35%" stopColor="#F5D061" />
          <stop offset="70%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8C5E13" />
        </linearGradient>

        <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#E11D48" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>

        <linearGradient id="sriChoornamRed" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF3366" />
          <stop offset="40%" stopColor="#DC2626" />
          <stop offset="85%" stopColor="#991B1B" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>

        <linearGradient id="shellWhiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#F3E8D0" />
        </linearGradient>

        <radialGradient id="chakraRadiance" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="60%" stopColor="#F5D061" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>

        <filter id="holyGlow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#D4AF37" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* ============================================================== */}
      {/* 1. LEFT: SACRED PANCHAJANYA SHANKHA (CONCH SHELL)             */}
      {/* ============================================================== */}
      <g id="shankha-conch" transform="translate(10, 2)" filter="url(#holyGlow)">
        {/* Conch Crown Sacred Flame (Jwala) */}
        <path
          d="M35,6 C38,12 43,15 40,21 C38,25 33,26 31,23 C29,20 31,14 35,6 Z"
          fill="url(#flameGrad)"
        />
        <path
          d="M35,8 C37,12 40,14 38,18 C37,21 34,22 32,20 C31,18 32,13 35,8 Z"
          fill="#FFF9D2"
        />

        {/* Shankha Outer Golden Aura Wings */}
        <path
          d="M22,30 C12,38 12,58 20,68 C25,74 34,80 38,84 C38,78 37,70 33,64 C29,58 27,44 32,32 Z"
          fill="url(#divineGold)"
          opacity="0.85"
        />

        {/* Main Sacred Conch Shell Body (Pristine White with Golden Sheen) */}
        <path
          d="M35,21 C48,22 58,34 56,50 C54,64 43,76 35,82 C32,83 29,81 30,77 C33,68 37,56 33,46 C29,36 26,27 35,21 Z"
          fill="url(#shellWhiteGrad)"
          stroke="#D4AF37"
          strokeWidth="1.2"
        />

        {/* Conch Spiral Swirl Lines (Dakshinavarti Sacred Spirals) */}
        <path
          d="M35,21 C41,25 45,33 44,43 C43,51 38,60 33,67"
          stroke="#D4AF37"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M37,28 C41,33 42,40 40,48 C38,55 35,60 32,64"
          stroke="#B45309"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M34,35 C37,39 38,44 36,50"
          stroke="#C59B27"
          strokeWidth="0.7"
          strokeLinecap="round"
        />

        {/* Golden Ornate Filigree on Conch Base */}
        <circle cx="34" cy="79" r="2.5" fill="url(#divineGold)" stroke="#8C5E13" strokeWidth="0.5" />
        <circle cx="34" cy="79" r="1.1" fill="#DC2626" />
      </g>

      {/* ============================================================== */}
      {/* 2. CENTER: GOVINDA NAMAM (TIRUMALA THIRUNAMAM / URDHVA PUNDRA)  */}
      {/* ============================================================== */}
      <g id="govinda-namam" transform="translate(85, 2)" filter="url(#holyGlow)">
        {/* Golden Lotus Pedestal Base (Padma Peetham) */}
        <path
          d="M20,74 C26,69 34,71 40,76 C46,71 54,69 60,74 C58,82 50,88 40,89 C30,88 22,82 20,74 Z"
          fill="url(#divineGold)"
          stroke="#8C5E13"
          strokeWidth="1"
        />
        {/* Center Ruby on Lotus Base */}
        <circle cx="40" cy="82" r="2.8" fill="#DC2626" stroke="#FFE4E6" strokeWidth="0.6" />

        {/* White Outer Namam Arms (The Divine Lotus Feet of Lord Venkateswara) */}
        {/* Left Arm & Right Arm joined at bottom with traditional sharp flares */}
        <path
          d="M12,12 C18,26 24,48 27,65 C28,73 33,76 40,76 C47,76 52,73 53,65 C56,48 62,26 68,12 C61,19 54,32 52,46 C50,56 47,63 40,63 C33,63 30,56 28,46 C26,32 19,19 12,12 Z"
          fill="#FFFFFF"
          stroke="url(#divineGold)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* Subtle inner pearl highlight */}
        <path
          d="M17,17 C22,28 27,47 29,62 C34,62 36,54 34,44 C32,32 25,23 17,17 Z"
          fill="#FFFDF7"
          opacity="0.8"
        />
        <path
          d="M63,17 C58,28 53,47 51,62 C46,62 44,54 46,44 C48,32 55,23 63,17 Z"
          fill="#FFFDF7"
          opacity="0.8"
        />

        {/* Center Sacred Red Sri Choornam (Goddess Lakshmi Tilakam) */}
        <path
          d="M40,14 C41.6,18 43,26 43,38 L42.6,68 C42.6,71 41.5,72.5 40,72.5 C38.5,72.5 37.4,71 37.4,68 L37,38 C37,26 38.4,18 40,14 Z"
          fill="url(#sriChoornamRed)"
          stroke="#FFE4E6"
          strokeWidth="0.6"
        />

        {/* Golden Auspicious Flame Tip / Tilaka Crown */}
        <polygon
          points="40,8 42.2,15 37.8,15"
          fill="url(#flameGrad)"
          stroke="#B45309"
          strokeWidth="0.4"
        />
      </g>

      {/* ============================================================== */}
      {/* 3. RIGHT: SACRED SUDARSHANA CHAKRA (DIVINE FLAMING DISCUS)    */}
      {/* ============================================================== */}
      <g id="sudarshana-chakra" transform="translate(178, 2)" filter="url(#holyGlow)">
        {/* Top Flame of Chakra */}
        <path
          d="M32,6 C35,12 40,15 37,21 C35,25 30,26 28,23 C26,20 28,14 32,6 Z"
          fill="url(#flameGrad)"
        />
        <path
          d="M32,8 C34,12 37,14 35,18 C34,21 31,22 29,20 C28,18 29,13 32,8 Z"
          fill="#FFF9D2"
        />

        {/* Radiating Flame Tongues (Jwalas) around the disc */}
        <g fill="url(#divineGold)">
          {/* North-East */}
          <path d="M47,35 C53,32 57,35 55,41 C51,40 48,38 47,35 Z" />
          {/* East */}
          <path d="M53,49 C60,50 61,56 55,59 C54,55 52,52 53,49 Z" />
          {/* South-East */}
          <path d="M48,65 C53,70 49,74 44,72 C45,68 46,66 48,65 Z" />
          {/* South */}
          <path d="M32,74 C34,81 29,83 26,79 C28,76 30,75 32,74 Z" />
          {/* South-West */}
          <path d="M17,66 C12,71 8,68 11,62 C13,64 16,65 17,66 Z" />
          {/* West */}
          <path d="M11,50 C5,49 5,43 11,41 C11,45 11,48 11,50 Z" />
          {/* North-West */}
          <path d="M16,35 C11,31 14,26 19,29 C18,32 17,34 16,35 Z" />
        </g>

        {/* Outer Golden Flaming Rim of Chakra */}
        <circle
          cx="32"
          cy="51"
          r="23"
          fill="url(#divineGold)"
          stroke="#8C5E13"
          strokeWidth="1.2"
        />

        {/* Concentric Golden Ring with Pearl Bead Insets */}
        <circle
          cx="32"
          cy="51"
          r="17"
          fill="url(#chakraRadiance)"
          stroke="#B45309"
          strokeWidth="0.8"
        />

        {/* Sudarshana Spokes (8 Divine Golden Spokes) */}
        <g stroke="#8C5E13" strokeWidth="1.2" strokeLinecap="round">
          <line x1="32" y1="35" x2="32" y2="67" />
          <line x1="16" y1="51" x2="48" y2="51" />
          <line x1="21" y1="40" x2="43" y2="62" />
          <line x1="43" y1="40" x2="21" y2="62" />
        </g>

        {/* Central Lotus Nabhi (Hub) with Sacred Vermilion Center */}
        <circle cx="32" cy="51" r="6" fill="url(#divineGold)" stroke="#FFEBA5" strokeWidth="0.8" />
        <circle cx="32" cy="51" r="3.2" fill="#DC2626" stroke="#FFFFFF" strokeWidth="0.6" />
      </g>
    </svg>
  );
};
