// Filterable fields for Advertisement
export const advertisementFilterables = [
  'title',
  'type',
  'status',
  'club',
  'startDate',
  'endDate',
  'advertiserName',
  'position',
  'universities',
  'departments',
  'tags'
];

// Searchable fields for Advertisement
export const advertisementSearchableFields = [
  'title',
  'description',
  'advertiserName',
  'callToAction',
  'tags',
  'notes'
];

// Default advertisement positions
export const ADVERTISEMENT_POSITIONS = {
  BANNER: 'banner',
  SIDEBAR: 'sidebar',
  FEED: 'feed',
  POPUP: 'popup'
} as const;

// Default priority levels
export const PRIORITY_LEVELS = {
  LOW: 1,
  MEDIUM: 5,
  HIGH: 10,
  URGENT: 20
} as const;

// Helper function for set comparison
export const isSetEqual = (setA: Set<string>, setB: Set<string>): boolean => {
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
};

// Helper function to check if advertisement is currently active
export const isAdvertisementActive = (startDate: Date, endDate: Date): boolean => {
  const now = new Date();
  return startDate <= now && endDate >= now;
};

// Helper function to calculate CTR (Click Through Rate)
export const calculateCTR = (clicks: number, impressions: number): number => {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
};