export interface AdMobConfig {
  publisherId: string;
  enabled: boolean;
  testMode: boolean;
  adUnits: {
    leaderboard: string;
    sidebar: string;
    inlineArticle: string;
    mobileSticky: string;
  };
}

export const DEFAULT_ADMOB_CONFIG: AdMobConfig = {
  publisherId: 'ca-pub-2011257851590169', // WingFuel.co AdMob/AdSense Publisher ID
  enabled: true,
  testMode: false,
  adUnits: {
    leaderboard: 'ca-pub-2011257851590169/leaderboard',
    sidebar: 'ca-pub-2011257851590169/sidebar',
    inlineArticle: 'ca-pub-2011257851590169/inline',
    mobileSticky: 'ca-pub-2011257851590169/mobile-anchor'
  }
};

const ADMOB_STORAGE_KEY = 'wingfuel_admob_config';

export function getAdMobConfig(): AdMobConfig {
  try {
    const stored = localStorage.getItem(ADMOB_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_ADMOB_CONFIG;
  } catch (e) {
    return DEFAULT_ADMOB_CONFIG;
  }
}

export function saveAdMobConfig(config: AdMobConfig) {
  try {
    localStorage.setItem(ADMOB_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save AdMob config to localStorage:', e);
  }
}
