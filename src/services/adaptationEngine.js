// Real Adaptation Engine - Multi-Objective Decision Making
// Uses actual system data to calculate optimal quality

// Quality levels with specifications
export const qualityLevels = {
  '360p': {
    resolution: '360p',
    bitrate: 500, // kbps
    power: 350, // mW (estimated)
    label: '360p (Low)',
    pedagogicalScore: 0.6
  },
  '480p': {
    resolution: '480p',
    bitrate: 800,
    power: 450,
    label: '480p (Medium)',
    pedagogicalScore: 0.8
  },
  '540p': {
    resolution: '540p',
    bitrate: 1000,
    power: 520,
    label: '540p (Medium+)',
    pedagogicalScore: 0.85
  },
  '720p': {
    resolution: '720p',
    bitrate: 1500,
    power: 650,
    label: '720p (HD)',
    pedagogicalScore: 0.95
  },
  '1080p': {
    resolution: '1080p',
    bitrate: 3000,
    power: 850,
    label: '1080p (Full HD)',
    pedagogicalScore: 1.0
  }
};

// Content type definitions
export const contentTypes = {
  slides: {
    label: 'Lecture Slides',
    minQuality: '480p',
    textDensity: 0.9
  },
  diagram: {
    label: 'Detailed Diagrams',
    minQuality: '720p',
    textDensity: 0.8
  },
  lecture: {
    label: 'Live Lecture',
    minQuality: '480p',
    textDensity: 0.6
  },
  demonstration: {
    label: 'Live Demonstration',
    minQuality: '720p',
    textDensity: 0.3
  }
};

// Reward function weights
const WEIGHTS = {
  alpha: 0.4,   // Quality benefit
  beta: 0.2,    // Rebuffering penalty
  gamma: 0.15,  // Energy cost
  delta: 0.15,  // Carbon cost
  epsilon: 0.1  // Pedagogical effectiveness
};

// Thresholds
const THRESHOLDS = {
  batteryCritical: 20,
  carbonHigh: 400,
  bufferLow: 3,
  networkSlow: 1
};

/**
 * Main adaptation function
 */
export const adaptQuality = (state) => {
  const { battery, carbonIntensity, networkSpeed, contentType } = state;
  
  // Hierarchical decision logic
  
  // 1. Battery Critical Mode
  if (battery < THRESHOLDS.batteryCritical) {
    const decision = batterySavingMode(state);
    return {
      ...decision,
      mode: 'Battery Critical',
      reasoning: `Battery at ${battery}% - aggressive power saving`,
      priority: 'battery'
    };
  }
  
  // 2. Carbon Conscious Mode
  if (carbonIntensity > THRESHOLDS.carbonHigh) {
    const decision = carbonConsciousMode(state);
    return {
      ...decision,
      mode: 'Carbon Conscious',
      reasoning: `High carbon (${carbonIntensity} gCO₂e/kWh) - reducing emissions`,
      priority: 'carbon'
    };
  }
  
  // 3. Multi-Objective Optimization
  const decision = multiObjectiveOptimization(state);
  return {
    ...decision,
    mode: 'Multi-Objective',
    reasoning: 'Balanced optimization across all objectives',
    priority: 'balanced'
  };
};

/**
 * Battery saving mode - minimum quality for content type
 */
const batterySavingMode = (state) => {
  const { contentType } = state;
  const minQuality = contentTypes[contentType].minQuality;
  
  return {
    quality: minQuality,
    reward: 0,
    energySaved: calculateEnergySavings(minQuality)
  };
};

/**
 * Carbon conscious mode - balance carbon with pedagogy
 */
const carbonConsciousMode = (state) => {
  const { contentType, networkSpeed } = state;
  const minQuality = contentTypes[contentType].minQuality;
  
  // For high detail content, go one level up if network allows
  if (contentType === 'diagram' && networkSpeed > 2) {
    return {
      quality: '720p',
      reward: 0,
      carbonReduced: calculateCarbonSavings('720p', state.carbonIntensity)
    };
  }
  
  return {
    quality: minQuality,
    reward: 0,
    carbonReduced: calculateCarbonSavings(minQuality, state.carbonIntensity)
  };
};

/**
 * Multi-objective optimization - evaluate all quality levels
 */
const multiObjectiveOptimization = (state) => {
  const { networkSpeed, contentType } = state;
  const availableQualities = Object.keys(qualityLevels);
  
  let bestQuality = null;
  let bestReward = -Infinity;
  
  availableQualities.forEach(quality => {
    // Check network capability
    const requiredSpeed = qualityLevels[quality].bitrate / 1000;
    if (requiredSpeed > networkSpeed * 1.2) return;
    
    // Check pedagogical requirement
    const minQuality = contentTypes[contentType].minQuality;
    if (!meetsMinimumQuality(quality, minQuality)) return;
    
    // Calculate reward
    const reward = calculateReward(state, quality);
    
    if (reward > bestReward) {
      bestReward = reward;
      bestQuality = quality;
    }
  });
  
  return {
    quality: bestQuality || '720p',
    reward: bestReward,
    optimized: true
  };
};

/**
 * Calculate reward function
 */
const calculateReward = (state, quality) => {
  const { battery, carbonIntensity, contentType } = state;
  
  // Quality benefit
  const qualityBitrate = qualityLevels[quality].bitrate;
  const qualityScore = Math.log10(qualityBitrate) / Math.log10(3000);
  const qualityReward = WEIGHTS.alpha * qualityScore;
  
  // Energy cost (scaled by battery level)
  const energyMW = qualityLevels[quality].power;
  const batteryMultiplier = (100 - battery) / 100;
  const energyCost = WEIGHTS.gamma * (energyMW / 850) * batteryMultiplier;
  
  // Carbon cost
  const carbonMultiplier = carbonIntensity / 600;
  const carbonCost = WEIGHTS.delta * (energyMW / 850) * carbonMultiplier;
  
  // Pedagogical bonus
  const pedagogicalScore = qualityLevels[quality].pedagogicalScore;
  const contentRequirement = contentType === 'diagram' ? 0.9 : 0.7;
  const pedagogyBonus = pedagogicalScore >= contentRequirement ? WEIGHTS.epsilon : 0;
  
  return qualityReward - energyCost - carbonCost + pedagogyBonus;
};

/**
 * Check minimum quality requirement
 */
const meetsMinimumQuality = (quality, minRequired) => {
  const qualityOrder = ['360p', '480p', '540p', '720p', '1080p'];
  const currentIndex = qualityOrder.indexOf(quality);
  const minIndex = qualityOrder.indexOf(minRequired);
  return currentIndex >= minIndex;
};

/**
 * Calculate energy savings vs 1080p baseline
 */
const calculateEnergySavings = (quality) => {
  const baseline = 850; // 1080p power
  const current = qualityLevels[quality].power;
  const savings = baseline - current;
  return {
    mW: savings,
    percentage: Math.round((savings / baseline) * 100)
  };
};

/**
 * Calculate carbon savings
 */
const calculateCarbonSavings = (quality, carbonIntensity) => {
  const baseline = 850;
  const current = qualityLevels[quality].power;
  const powerSaved = baseline - current;
  
  // Convert to grams CO2 per hour
  const energyKWh = (powerSaved / 1000000) * 1; // 1 hour
  const carbonGrams = energyKWh * carbonIntensity;
  
  return {
    grams: carbonGrams.toFixed(2),
    percentage: Math.round((powerSaved / baseline) * 100)
  };
};

/**
 * Log decision with full context
 */
export const logDecision = (state, decision) => {
  return {
    timestamp: new Date().toLocaleTimeString(),
    state: {
      battery: state.battery,
      charging: state.charging,
      carbonIntensity: state.carbonIntensity,
      networkSpeed: state.networkSpeed,
      contentType: state.contentType
    },
    decision: {
      quality: decision.quality,
      mode: decision.mode,
      reasoning: decision.reasoning,
      priority: decision.priority
    },
    metrics: {
      bitrate: qualityLevels[decision.quality].bitrate,
      power: qualityLevels[decision.quality].power,
      pedagogical: qualityLevels[decision.quality].pedagogicalScore
    }
  };
};

export default {
  adaptQuality,
  logDecision,
  qualityLevels,
  contentTypes,
  WEIGHTS,
  THRESHOLDS
};
