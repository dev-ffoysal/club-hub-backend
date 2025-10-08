// Filterable fields for Event
export const eventFilterables = [
  'type',
  'isPublic',
  'isOnline',
  'createdBy',
  'organizedBy',
  'startDate',
  'endDate',
  'searchTerm'
];

// Searchable fields for Event
export const eventSearchableFields = [
  'title',
  'description',
  'slogan',
  'location',
  'tags'
];

// Helper function for set comparison
export const isSetEqual = (setA: Set<string>, setB: Set<string>): boolean => {
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
};