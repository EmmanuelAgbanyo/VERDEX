import { ClimateSignal, GreenAsset } from '@/types';

export const INITIAL_CLIMATE_SIGNALS: ClimateSignal[] = [
  {
    id: 'sig-accra-aqi',
    region: 'accra',
    regionLabel: 'Accra, Greater Accra',
    name: 'Air Quality Index (AQI)',
    type: 'air_quality',
    currentValue: 42,
    unit: 'AQI',
    changePercent: -8.0,
    baselineValue: 50,
    statusText: '-8% vs 7d avg',
    updatedSecondsAgo: 12,
    impactDescription: 'Lower particulate pollution boosts urban solar efficiency and workforce productivity.',
    volatilityImpact: 1.05,
  },
  {
    id: 'sig-suhum-rain',
    region: 'eastern_suhum',
    regionLabel: 'Suhum, Eastern Region',
    name: 'Rainfall Anomaly',
    type: 'rainfall',
    currentValue: 114,
    unit: 'mm',
    changePercent: 12.0,
    baselineValue: 100,
    statusText: '+12% vs avg',
    updatedSecondsAgo: 28,
    impactDescription: 'Above-average precipitation enhances cocoa pod filling in Suhum cooperatives.',
    volatilityImpact: 1.12,
  },
  {
    id: 'sig-savannah-heat',
    region: 'northern_savannah',
    regionLabel: 'Tamale, Northern Savannah',
    name: 'Thermal Anomaly',
    type: 'heat_anomaly',
    currentValue: 0.8,
    unit: '°C',
    changePercent: 1.2,
    baselineValue: 0.0,
    statusText: '+0.8° stable',
    updatedSecondsAgo: 45,
    impactDescription: 'Peak solar irradiance increases daily micro-grid power output by 14%.',
    volatilityImpact: 1.08,
  },
  {
    id: 'sig-volta-mangrove',
    region: 'volta_delta',
    regionLabel: 'Ada Foah, Volta Delta',
    name: 'Mangrove Carbon Capture',
    type: 'carbon_offset',
    currentValue: 84.2,
    unit: 'tCO2e/ha',
    changePercent: 4.5,
    baselineValue: 80.0,
    statusText: '+4.5% sequestered',
    updatedSecondsAgo: 60,
    impactDescription: 'Restored estuary canopy accelerates biomass accumulation and coastal defense.',
    volatilityImpact: 1.15,
  },
];

export const INITIAL_GREEN_ASSETS: GreenAsset[] = [
  {
    id: 'asset-ghana-cocoa',
    symbol: 'GH-COCOA',
    name: 'Suhum Cocoa Coop Climate Bond',
    region: 'eastern_suhum',
    regionLabel: 'Suhum, Eastern Region',
    category: 'cocoa',
    price: 148.50,
    change24h: 4.25,
    signalScore: 88,
    signalType: 'rainfall',
    primarySignalId: 'sig-suhum-rain',
    researchReady: true,
    description: 'Direct financing bond for 2,400 shade-grown organic cocoa farmers in Eastern Ghana implementing water harvesting and soil nitrogen management.',
    communityImpact: 'Funds 12 solar-powered drip irrigation hubs & pays premium organic prices to smallholders.',
    whyThisMattersSnippet: 'This bond helps 2,400 smallholder cocoa farmers in Ashanti & Eastern region access disease-resistant seedlings and solar shade irrigation.',
    impactBreakdown: {
      peopleReached: '2,400 farmers',
      environmentalBenefit: '1,200 ha climate-smart farming',
      jobsSupported: '180 local jobs',
    },
    communityStory: {
      personName: 'Akua Mensah',
      role: 'Smallholder Cocoa Farmer',
      location: 'Asante Akim, Eastern Region',
      storyText: 'Akua lost 40% of her crop to black pod disease last year. The cooperative bond funded fungicide training and solar irrigation hubs. She now expects a full harvest this season.',
    },
    environmentalMetrics: [
      { label: 'Soil Moisture', value: '64% (Optimal)' },
      { label: 'Shade Canopy Density', value: '42%' },
      { label: 'Carbon Sink Credit', value: '3.4 tCO2e/ha' },
    ],
    riskFactors: [
      'Late-season dry harmattan wind outbreak',
      'Global fertilizer input cost inflation',
      'Pest pressure from black pod disease if humidity exceeds 85%',
    ],
    historicalPrices: [
      { time: '09:00', price: 142.10 },
      { time: '10:00', price: 143.80 },
      { time: '11:00', price: 145.20 },
      { time: '12:00', price: 144.90 },
      { time: '13:00', price: 147.00 },
      { time: '14:00', price: 148.50 },
    ],
  },
  {
    id: 'asset-northern-solar',
    symbol: 'WA-SOLAR',
    name: 'Tamale Micro-Grid Solar Shares',
    region: 'northern_savannah',
    regionLabel: 'Tamale, Northern Region',
    category: 'solar',
    price: 42.10,
    change24h: 6.18,
    signalScore: 92,
    signalType: 'solar_irradiance',
    primarySignalId: 'sig-savannah-heat',
    researchReady: true,
    description: 'Community-owned 2.4MW decentralised solar micro-grid powering agricultural cold storage and 8 rural commercial centers near Tamale.',
    communityImpact: 'Replaces 48 diesel generators, reducing local farm crop spoilage by 35%.',
    whyThisMattersSnippet: 'This solar micro-grid powers 3 health clinics and 500 households in the Northern Savannah, replacing diesel generators and reducing air pollution.',
    impactBreakdown: {
      peopleReached: '1,500 residents',
      environmentalBenefit: '320 tonnes CO₂ avoided/year',
      jobsSupported: '40 local jobs',
    },
    communityStory: {
      personName: 'Ibrahim Kassim',
      role: 'Cold Storage Coordinator',
      location: 'Tamale Agricultural Buffer',
      storyText: 'Before the solar grid was installed, post-harvest tomato rot caused massive income losses. Today, community solar refrigeration keeps produce fresh for market delivery.',
    },
    environmentalMetrics: [
      { label: 'Solar Irradiance', value: '6.8 kWh/m²/day' },
      { label: 'Grid Uptime', value: '99.4%' },
      { label: 'Diesel Replaced', value: '18,500 L/mo' },
    ],
    riskFactors: [
      'Harmattan dust accumulation requiring panel cleaning',
      'Battery energy storage degradation over time',
      'Sub-optimal grid interconnection tariffs',
    ],
    historicalPrices: [
      { time: '09:00', price: 39.50 },
      { time: '10:00', price: 40.20 },
      { time: '11:00', price: 41.00 },
      { time: '12:00', price: 41.50 },
      { time: '13:00', price: 41.80 },
      { time: '14:00', price: 42.10 },
    ],
  },
  {
    id: 'asset-volta-mangrove',
    symbol: 'V-CARBON',
    name: 'Volta Estuary Mangrove Carbon Token',
    region: 'volta_delta',
    regionLabel: 'Ada Foah, Volta Delta',
    category: 'mangrove',
    price: 28.75,
    change24h: 8.42,
    signalScore: 95,
    signalType: 'carbon_offset',
    primarySignalId: 'sig-volta-mangrove',
    researchReady: true,
    description: 'High-integrity blue carbon token backing 4,500 hectares of mangrove restoration protecting Ada coastal fisheries.',
    communityImpact: 'Employs 340 women eco-guards in seedling propagation & sustainable oyster harvesting.',
    whyThisMattersSnippet: 'Restoring mangroves in Keta & Ada protects coastal villages from storm surges, provides fish breeding grounds, and sequesters carbon.',
    impactBreakdown: {
      peopleReached: '12,000 coastal dwellers',
      environmentalBenefit: '50 ha restored, 200 tCO₂ sequestered',
      jobsSupported: '60 eco-guard jobs',
    },
    communityStory: {
      personName: 'Grace Kpodo',
      role: 'Women Oyster Collective Lead',
      location: 'Ada Foah Estuary',
      storyText: 'Coastal storm surges used to flood our village homes. Mangrove reforestation has stabilized the shoreline while increasing local crab and fish stocks for sustainable harvest.',
    },
    environmentalMetrics: [
      { label: 'Blue Carbon Capture', value: '84.2 tCO2e/ha' },
      { label: 'Coastline Stabilized', value: '18.4 km' },
      { label: 'Biodiversity Score', value: '94/100' },
    ],
    riskFactors: [
      'Illegal wood harvesting for fish smoking',
      'Severe sea storm erosion during high tide season',
      'Salinity shifts from upstream hydro dam releases',
    ],
    historicalPrices: [
      { time: '09:00', price: 26.20 },
      { time: '10:00', price: 26.80 },
      { time: '11:00', price: 27.50 },
      { time: '12:00', price: 28.00 },
      { time: '13:00', price: 28.30 },
      { time: '14:00', price: 28.75 },
    ],
  },
  {
    id: 'asset-mole-savannah',
    symbol: 'MOLE-REFOR',
    name: 'Mole Corridor Reforestation Stake',
    region: 'northern_savannah',
    regionLabel: 'Mole Buffer Zone, Savannah',
    category: 'savannah',
    price: 76.40,
    change24h: -1.25,
    signalScore: 81,
    signalType: 'heat_anomaly',
    primarySignalId: 'sig-savannah-heat',
    researchReady: true,
    description: 'Agroforestry and native shea tree corridor re-establishing wildlife migratory pathways between Mole National Park and reserve zones.',
    communityImpact: 'Provides sustainable shea butter processing equipment for 8 women cooperatives.',
    whyThisMattersSnippet: 'Protects Northern Mole ecological corridors from wildfire degradation while funding women-led shea agroforestry collectives.',
    impactBreakdown: {
      peopleReached: '3,100 community members',
      environmentalBenefit: '14,000 ha protected corridor',
      jobsSupported: '95 agroforestry jobs',
    },
    communityStory: {
      personName: 'Fatima Abukari',
      role: 'Shea Cooperative Leader',
      location: 'Mole Buffer Zone',
      storyText: 'Shea tree wild harvesting is our primary income. The firebreak corridor keeps bushfires away from our native trees, securing our community income year-round.',
    },
    environmentalMetrics: [
      { label: 'Hectares Protected', value: '14,000 ha' },
      { label: 'Shea Canopy Growth', value: '+14% YoY' },
      { label: 'Fire Break Perimeter', value: '45 km' },
    ],
    riskFactors: [
      'Bushfire threats during dry season',
      'Illegal cattle grazing encroachment',
      'Water table drawdown in drought months',
    ],
    historicalPrices: [
      { time: '09:00', price: 77.50 },
      { time: '10:00', price: 77.20 },
      { time: '11:00', price: 76.80 },
      { time: '12:00', price: 76.50 },
      { time: '13:00', price: 76.10 },
      { time: '14:00', price: 76.40 },
    ],
  },
  {
    id: 'asset-brong-drought',
    symbol: 'BA-CROP',
    name: 'Brong-Ahafo Climate Seed Bond',
    region: 'brong_ahafo',
    regionLabel: 'Sunyani, Brong-Ahafo',
    category: 'cocoa',
    price: 95.20,
    change24h: 3.10,
    signalScore: 84,
    signalType: 'rainfall',
    primarySignalId: 'sig-suhum-rain',
    researchReady: true,
    description: 'Micro-loan pool funding heat-resistant maize and cassava hybrid seeds with bio-char soil enhancement for transition zone farmers.',
    communityImpact: 'Guarantees crop insurance payout if seasonal rainfall drops below 80mm threshold.',
    whyThisMattersSnippet: 'Provides drought-tolerant hybrid seeds and micro-insurance payouts to 850 smallholder farmers during rainfall deficits.',
    impactBreakdown: {
      peopleReached: '850 smallholder families',
      environmentalBenefit: '+35% drought yield protection',
      jobsSupported: '50 farm jobs',
    },
    communityStory: {
      personName: 'Kwaku Osei',
      role: 'Cassava Farmer',
      location: 'Sunyani Transition Belt',
      storyText: 'Unpredictable rain shifts used to wipe out our cassava crops. Hybrid drought-tolerant seeds ensure a steady harvest even when monsoons are delayed.',
    },
    environmentalMetrics: [
      { label: 'Drought Resilience', value: '+35% Yield' },
      { label: 'Organic Soil Matter', value: '4.8%' },
      { label: 'Farmers Financed', value: '850 smallholders' },
    ],
    riskFactors: [
      'Delayed onset of minor rainy season',
      'Local market price volatility for grain',
      'Storage pest outbreaks in humid warehouses',
    ],
    historicalPrices: [
      { time: '09:00', price: 92.10 },
      { time: '10:00', price: 92.80 },
      { time: '11:00', price: 93.50 },
      { time: '12:00', price: 94.20 },
      { time: '13:00', price: 94.80 },
      { time: '14:00', price: 95.20 },
    ],
  },
];

/**
 * Simulates a tick of environmental data and shifts prices accordingly.
 */
export function tickClimateData(
  signals: ClimateSignal[],
  assets: GreenAsset[]
): { updatedSignals: ClimateSignal[]; updatedAssets: GreenAsset[] } {
  const updatedSignals = signals.map((sig) => {
    const deltaPercent = (Math.random() * 2 - 0.9) * 0.5;
    const newValue = Math.max(1, Number((sig.currentValue + deltaPercent).toFixed(1)));
    const newChangePercent = Number((sig.changePercent + deltaPercent * 0.2).toFixed(1));
    return {
      ...sig,
      currentValue: newValue,
      changePercent: newChangePercent,
      updatedSecondsAgo: 2,
    };
  });

  const updatedAssets = assets.map((asset) => {
    const linkedSignal = updatedSignals.find((s) => s.id === asset.primarySignalId);
    const signalFactor = linkedSignal ? linkedSignal.changePercent * 0.05 : 0.1;
    const randomNoise = (Math.random() - 0.48) * 0.4;
    const priceShift = (signalFactor + randomNoise);
    const newPrice = Number(Math.max(1.0, asset.price + priceShift).toFixed(2));
    const newChange24h = Number((asset.change24h + priceShift * 0.2).toFixed(2));

    const updatedHistory = [
      ...asset.historicalPrices.slice(1),
      { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), price: newPrice },
    ];

    return {
      ...asset,
      price: newPrice,
      change24h: newChange24h,
      historicalPrices: updatedHistory,
    };
  });

  return { updatedSignals, updatedAssets };
}
