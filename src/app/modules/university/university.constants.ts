// Filterable fields for University
export const universityFilterables = ['name', 'logo', 'description'];

// Searchable fields for University
export const universitySearchableFields = ['name', 'logo', 'description'];

// Helper function for set comparison
export const isSetEqual = (setA: Set<string>, setB: Set<string>): boolean => {
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
};