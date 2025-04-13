/**
 * Solar Terms (24 Jieqi) Service
 * This service provides functions to calculate the current solar term and related information
 */

// The 24 Solar Terms data with English descriptions, proverbs, and weather characteristics
const solarTermsData = [
  {
    name: "Beginning of Spring (Lichun)",
    description: "The Beginning of Spring marks the start of spring in East Asian cultures.",
    proverb: "Spring rain is as precious as oil.",
    weather: "Temperatures begin to rise, though cold spells may still occur. Plants start to show signs of new growth."
  },
  {
    name: "Rain Water (Yushui)",
    description: "Rain Water signifies the increase in rainfall and rising temperatures.",
    proverb: "Rain brings a hundred kinds of blessings.",
    weather: "Precipitation increases, with temperatures gradually warming. Melting snow and ice contribute to increased humidity."
  },
  {
    name: "Awakening of Insects (Jingzhe)",
    description: "Awakening of Insects indicates when hibernating insects begin to awaken due to warming weather.",
    proverb: "When the Awakening of Insects comes, thunder will be heard.",
    weather: "Thunderstorms may begin to appear. The weather becomes noticeably warmer, encouraging insects to emerge."
  },
  {
    name: "Spring Equinox (Chunfen)",
    description: "Spring Equinox marks equal length of day and night, representing balance.",
    proverb: "If it's sunny on Spring Equinox, the hundred days that follow will bring favorable weather.",
    weather: "Day and night are of equal length. Weather is mild with moderate temperatures and occasional spring showers."
  },
  {
    name: "Pure Brightness (Qingming)",
    description: "Pure Brightness is a time for ancestral worship and tomb sweeping.",
    proverb: "Qingming time, plant melons and beans.",
    weather: "Clear and bright weather with occasional light rain. Perfect time for planting crops."
  },
  {
    name: "Grain Rain (Guyu)",
    description: "Grain Rain signifies the rainfall needed for crops to grow.",
    proverb: "Grain Rain brings enough moisture to wet the ground.",
    weather: "Increased rainfall that nourishes growing crops. Temperatures continue to rise with higher humidity."
  },
  {
    name: "Beginning of Summer (Lixia)",
    description: "Beginning of Summer marks the start of summer in East Asian cultures.",
    proverb: "Summer heat comes, and the earth is filled with life.",
    weather: "Temperatures rise significantly. Days become longer and nights shorter. Increased chance of thunderstorms."
  },
  {
    name: "Grain Buds (Xiaoman)",
    description: "Grain Buds indicates when grains begin to become plump but are not yet ripe.",
    proverb: "Xiaoman, Xiaoman, grains are filling the fields.",
    weather: "Warm and humid with increasing rainfall. Temperatures continue to rise as summer progresses."
  },
  {
    name: "Grain in Ear (Mangzhong)",
    description: "Grain in Ear signifies when grains such as wheat and barley begin to ripen.",
    proverb: "Planting at Grain in Ear will still yield a harvest.",
    weather: "Hot and humid with frequent rainfall. The rainy season begins in many regions."
  },
  {
    name: "Summer Solstice (Xiazhi)",
    description: "Summer Solstice is the longest day of the year in the Northern Hemisphere.",
    proverb: "The Summer Solstice brings the longest day and shortest night.",
    weather: "Hot temperatures with the longest daylight hours of the year. High humidity and occasional thunderstorms."
  },
  {
    name: "Minor Heat (Xiaoshu)",
    description: "Minor Heat indicates the beginning of the hottest period of the year.",
    proverb: "Minor Heat brings sweat to the brow.",
    weather: "Very hot and humid. Frequent thunderstorms and heavy rainfall in many regions."
  },
  {
    name: "Major Heat (Dashu)",
    description: "Major Heat is the hottest period of the year.",
    proverb: "During Major Heat, even the nights are hot.",
    weather: "Extreme heat and humidity. The hottest period of summer with frequent thunderstorms and occasional droughts."
  },
  {
    name: "Beginning of Autumn (Liqiu)",
    description: "Beginning of Autumn marks the start of autumn in East Asian cultures.",
    proverb: "Autumn begins, yet summer heat remains.",
    weather: "Still hot but with occasional cool breezes. Humidity begins to decrease slightly."
  },
  {
    name: "End of Heat (Chushu)",
    description: "End of Heat signifies the end of the extremely hot weather.",
    proverb: "End of Heat brings relief from summer's fury.",
    weather: "Temperatures begin to moderate. Days remain warm but nights become cooler."
  },
  {
    name: "White Dew (Bailu)",
    description: "White Dew indicates when dew appears as the weather cools.",
    proverb: "White Dew on grass shows autumn's arrival.",
    weather: "Cooler temperatures, especially at night. Morning dew becomes common as humidity condenses in the cooler air."
  },
  {
    name: "Autumn Equinox (Qiufen)",
    description: "Autumn Equinox marks equal length of day and night, representing balance.",
    proverb: "Equal day and night, cool winds arrive.",
    weather: "Day and night are of equal length. Weather becomes cooler with clear skies and lower humidity."
  },
  {
    name: "Cold Dew (Hanlu)",
    description: "Cold Dew indicates when dew becomes cold due to lower temperatures.",
    proverb: "Cold Dew brings frost to high mountains.",
    weather: "Significantly cooler temperatures. Morning dew feels cold, and frost may appear in northern regions."
  },
  {
    name: "Frost's Descent (Shuangjiang)",
    description: "Frost's Descent signifies when frost begins to appear.",
    proverb: "When frost descends, winter is not far behind.",
    weather: "Cold temperatures with frost appearing in many regions. Trees begin to lose their leaves rapidly."
  },
  {
    name: "Beginning of Winter (Lidong)",
    description: "Beginning of Winter marks the start of winter in East Asian cultures.",
    proverb: "Winter begins, store food for the cold days ahead.",
    weather: "Cold temperatures become the norm. Northern regions may see first snowfall."
  },
  {
    name: "Minor Snow (Xiaoxue)",
    description: "Minor Snow indicates when light snow begins to fall in northern regions.",
    proverb: "Minor Snow brings the first flakes of winter.",
    weather: "Very cold with light snowfall in northern regions. Southern regions experience cold rain."
  },
  {
    name: "Major Snow (Daxue)",
    description: "Major Snow signifies heavier snowfall as winter deepens.",
    proverb: "Major Snow covers the world in white.",
    weather: "Heavy snowfall in northern regions. Very cold temperatures throughout most areas."
  },
  {
    name: "Winter Solstice (Dongzhi)",
    description: "Winter Solstice is the shortest day of the year in the Northern Hemisphere.",
    proverb: "After Winter Solstice, each day brings more light.",
    weather: "The shortest daylight hours of the year. Extremely cold with snow common in northern regions."
  },
  {
    name: "Minor Cold (Xiaohan)",
    description: "Minor Cold is one of the coldest periods of the year.",
    proverb: "Minor Cold brings ice to rivers and lakes.",
    weather: "Extremely cold temperatures. Lakes and rivers may freeze in northern regions."
  },
  {
    name: "Major Cold (Dahan)",
    description: "Major Cold is the coldest period of the year.",
    proverb: "During Major Cold, stay indoors and keep warm.",
    weather: "The coldest period of winter. Extreme cold with heavy snow possible in many regions."
  }
];

/**
 * Calculate the current solar term based on the date
 * This is a simplified calculation and may not be 100% accurate for all years
 * @param {Date} date - The date to check (defaults to current date)
 * @returns {Object} The current solar term information
 */
const getCurrentSolarTerm = (date = new Date()) => {
  // Get the current date components
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1; // JavaScript months are 0-based
  const currentDay = date.getDate();
  
  // Simplified solar term calculation based on approximate dates
  // These dates are approximate and may vary slightly from year to year
  let solarTermIndex;
  
  if ((currentMonth === 2 && currentDay >= 3 && currentDay < 18) || (currentMonth === 2 && currentDay < 3)) {
    solarTermIndex = 0; // Beginning of Spring (Feb 3-17)
  } else if (currentMonth === 2 && currentDay >= 18) {
    solarTermIndex = 1; // Rain Water (Feb 18-Mar 4)
  } else if (currentMonth === 3 && currentDay >= 5 && currentDay < 20) {
    solarTermIndex = 2; // Awakening of Insects (Mar 5-19)
  } else if ((currentMonth === 3 && currentDay >= 20) || (currentMonth === 4 && currentDay < 4)) {
    solarTermIndex = 3; // Spring Equinox (Mar 20-Apr 3)
  } else if (currentMonth === 4 && currentDay >= 4 && currentDay < 19) {
    solarTermIndex = 4; // Pure Brightness (Apr 4-18)
  } else if ((currentMonth === 4 && currentDay >= 19) || (currentMonth === 5 && currentDay < 5)) {
    solarTermIndex = 5; // Grain Rain (Apr 19-May 4)
  } else if (currentMonth === 5 && currentDay >= 5 && currentDay < 20) {
    solarTermIndex = 6; // Beginning of Summer (May 5-19)
  } else if ((currentMonth === 5 && currentDay >= 20) || (currentMonth === 6 && currentDay < 5)) {
    solarTermIndex = 7; // Grain Buds (May 20-Jun 4)
  } else if (currentMonth === 6 && currentDay >= 5 && currentDay < 21) {
    solarTermIndex = 8; // Grain in Ear (Jun 5-20)
  } else if ((currentMonth === 6 && currentDay >= 21) || (currentMonth === 7 && currentDay < 6)) {
    solarTermIndex = 9; // Summer Solstice (Jun 21-Jul 5)
  } else if (currentMonth === 7 && currentDay >= 6 && currentDay < 22) {
    solarTermIndex = 10; // Minor Heat (Jul 6-21)
  } else if ((currentMonth === 7 && currentDay >= 22) || (currentMonth === 8 && currentDay < 7)) {
    solarTermIndex = 11; // Major Heat (Jul 22-Aug 6)
  } else if (currentMonth === 8 && currentDay >= 7 && currentDay < 23) {
    solarTermIndex = 12; // Beginning of Autumn (Aug 7-22)
  } else if ((currentMonth === 8 && currentDay >= 23) || (currentMonth === 9 && currentDay < 7)) {
    solarTermIndex = 13; // End of Heat (Aug 23-Sep 6)
  } else if (currentMonth === 9 && currentDay >= 7 && currentDay < 23) {
    solarTermIndex = 14; // White Dew (Sep 7-22)
  } else if ((currentMonth === 9 && currentDay >= 23) || (currentMonth === 10 && currentDay < 8)) {
    solarTermIndex = 15; // Autumn Equinox (Sep 23-Oct 7)
  } else if (currentMonth === 10 && currentDay >= 8 && currentDay < 23) {
    solarTermIndex = 16; // Cold Dew (Oct 8-22)
  } else if ((currentMonth === 10 && currentDay >= 23) || (currentMonth === 11 && currentDay < 7)) {
    solarTermIndex = 17; // Frost's Descent (Oct 23-Nov 6)
  } else if (currentMonth === 11 && currentDay >= 7 && currentDay < 22) {
    solarTermIndex = 18; // Beginning of Winter (Nov 7-21)
  } else if ((currentMonth === 11 && currentDay >= 22) || (currentMonth === 12 && currentDay < 7)) {
    solarTermIndex = 19; // Minor Snow (Nov 22-Dec 6)
  } else if (currentMonth === 12 && currentDay >= 7 && currentDay < 22) {
    solarTermIndex = 20; // Major Snow (Dec 7-21)
  } else if ((currentMonth === 12 && currentDay >= 22) || (currentMonth === 1 && currentDay < 5)) {
    solarTermIndex = 21; // Winter Solstice (Dec 22-Jan 4)
  } else if (currentMonth === 1 && currentDay >= 5 && currentDay < 20) {
    solarTermIndex = 22; // Minor Cold (Jan 5-19)
  } else if ((currentMonth === 1 && currentDay >= 20) || (currentMonth === 2 && currentDay < 3)) {
    solarTermIndex = 23; // Major Cold (Jan 20-Feb 2)
  } else {
    // Default to Beginning of Spring if calculation fails
    solarTermIndex = 0;
  }
  
  return solarTermsData[solarTermIndex];
};

export { getCurrentSolarTerm, solarTermsData };