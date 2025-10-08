// Filterable fields for Engagement
export const engagementFilterables = [
  'user',
  'event', 
  'voteType',
  'startDate',
  'endDate',
  'searchTerm'
];

// Searchable fields for Engagement
export const engagementSearchableFields = [
  'voteType'
];

// Helper function for set comparison
export const isSetEqual = (setA: Set<string>, setB: Set<string>): boolean => {
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
};