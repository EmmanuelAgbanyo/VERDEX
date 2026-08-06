import React from 'react';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

interface SvgIconProps {
  size?: number;
  color?: string;
  secondaryColor?: string;
}

export const AirQualitySvg: React.FC<SvgIconProps> = ({ size = 24, color = '#0D5C46', secondaryColor = '#34D399' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient id="aqiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={color} />
        <Stop offset="100%" stopColor={secondaryColor} />
      </LinearGradient>
    </Defs>
    {/* Flowing breeze lines */}
    <Path
      d="M2 8h15.5a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0-2.5 2.5"
      stroke="url(#aqiGrad)"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 12h18.5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1-2.5-2.5"
      stroke="url(#aqiGrad)"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 16h11.5a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0-2.5 2.5"
      stroke="url(#aqiGrad)"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Micro-particulate dots representing filtration */}
    <Circle cx={8} cy={4} r={1.5} fill={secondaryColor} opacity={0.6} />
    <Circle cx={14} cy={10} r={1.5} fill={secondaryColor} opacity={0.6} />
    <Circle cx={19} cy={6} r={1} fill={color} opacity={0.4} />
  </Svg>
);

export const RainfallSvg: React.FC<SvgIconProps> = ({ size = 24, color = '#1A73E8', secondaryColor = '#60A5FA' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient id="rainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor={secondaryColor} />
        <Stop offset="100%" stopColor={color} />
      </LinearGradient>
    </Defs>
    {/* Cloud body */}
    <Path
      d="M17 12a5 5 0 0 0-5-5 5 5 0 0 0-4.3 2.5A4.5 4.5 0 0 0 4 14a4.5 4.5 0 0 0 4.5 4.5h8a4 4 0 0 0 4-4 4 4 0 0 0-3.5-4z"
      fill="url(#rainGrad)"
      opacity={0.85}
    />
    {/* Precise diagonal rain drops */}
    <Path d="M9 19.5l-1 2" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M13 19.5l-1 2" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M17 19.5l-1 2" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export const HeatAnomalySvg: React.FC<SvgIconProps> = ({ size = 24, color = '#E8711A', secondaryColor = '#FBBF24' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient id="heatGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <Stop offset="0%" stopColor={color} />
        <Stop offset="100%" stopColor={secondaryColor} />
      </LinearGradient>
    </Defs>
    {/* Solar flare outer circle glow */}
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
    {/* Thermometer body */}
    <Path
      d="M12 3a2 2 0 0 0-2 2v7.3a4 4 0 1 0 4 0V5a2 2 0 0 0-2-2z"
      stroke="url(#heatGrad)"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Temperature fluid indicator */}
    <Circle cx={12} cy={16} r={2} fill={color} />
    <Path d="M12 14V8" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export const CarbonCanopySvg: React.FC<SvgIconProps> = ({ size = 24, color = '#0D5C46', secondaryColor = '#34D399' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={secondaryColor} />
        <Stop offset="100%" stopColor={color} />
      </LinearGradient>
    </Defs>
    {/* Mangrove leaf silhouette */}
    <Path
      d="M2 22c0-8.5 6.5-15 15-15h5v5c0 8.5-6.5 15-15 15H2z"
      fill="url(#leafGrad)"
      opacity={0.8}
    />
    {/* Internal leaf vein lines */}
    <Path d="M2 22l15-15M8 16l4-2M12 12l3-1M5 19l2-2" stroke="#FFFFFF" strokeWidth={1.5} strokeLinecap="round" />
    {/* Encircling carbon rings */}
    <Circle cx={17} cy={7} r={4} stroke={color} strokeWidth={1} strokeDasharray="2 2" />
    <Circle cx={17} cy={7} r={1.5} fill={secondaryColor} />
  </Svg>
);

export const BellSvg: React.FC<SvgIconProps> = ({ size = 20, color = '#1A2E26' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

export const MapPinSvg: React.FC<SvgIconProps> = ({ size = 16, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx={12} cy={10} r={3} />
  </Svg>
);

export const SparklesSvg: React.FC<SvgIconProps> = ({ size = 16, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.32 11.32l.707-.707M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
  </Svg>
);

export const FlameSvg: React.FC<SvgIconProps> = ({ size = 20, color = '#FF5A5F', secondaryColor = '#FBBF24' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <Stop offset="0%" stopColor={color} />
        <Stop offset="100%" stopColor={secondaryColor} />
      </LinearGradient>
    </Defs>
    <Path
      d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 1.5 2 2.5 2.5 4 .622 1.867 0 3-.5 4.5A4 4 0 1 1 8.5 14.5z"
      fill="url(#flameGrad)"
      stroke={color}
      strokeWidth={1}
    />
  </Svg>
);

export const AwardSvg: React.FC<SvgIconProps> = ({ size = 20, color = '#FFD700', secondaryColor = '#FFA500' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient id="awardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={color} />
        <Stop offset="100%" stopColor={secondaryColor} />
      </LinearGradient>
    </Defs>
    {/* Ribbons */}
    <Path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke={secondaryColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    {/* Medal Outer Rim */}
    <Circle cx={12} cy={9} r={7} fill="url(#awardGrad)" stroke={secondaryColor} strokeWidth={1} />
    {/* Inner Star */}
    <Path d="M12 6l1.24 2.51L16 8.9l-2 1.95.47 2.75L12 12.3l-2.47 1.3L10 10.85l-2-1.95 2.76-.39L12 6z" fill="#FFFFFF" />
  </Svg>
);

export const CoopFinanceSvg: React.FC<SvgIconProps> = ({ size = 24, color = '#10B981', secondaryColor = '#065F46' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {/* Scale base */}
    <Path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1M5 20v2M12 20v2" />
    {/* Scale balance arm */}
    <Path d="M2 8h14M9 3v5" />
    {/* Scale pans with leaf & dollar */}
    <Circle cx={2} cy={12} r={2} />
    <Circle cx={16} cy={12} r={2} />
    <Path d="M2 10v2M16 10v2" stroke={secondaryColor} />
  </Svg>
);

export const IotSensorSvg: React.FC<SvgIconProps> = ({ size = 24, color = '#F59E0B', secondaryColor = '#92400E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2a10 10 0 0 1 10 10c0 2.29-.77 4.4-2.06 6.1" />
    <Path d="M12 6a6 6 0 0 1 6 6c0 1.38-.46 2.64-1.24 3.66" />
    <Circle cx={12} cy={12} r={2} fill={color} />
    <Path d="M12 14v8M9 22h6" />
  </Svg>
);

