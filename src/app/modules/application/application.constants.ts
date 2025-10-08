// Filterable fields for Application
export const applicationFilterables = ['clubName', 'university', 'clubPurpose', 'description', 'clubPhone', 'clubEmail', 'applicantName', 'applicantEmail'];

// Searchable fields for Application
export const applicationSearchableFields = ['clubName', 'university', 'clubPurpose', 'description', 'clubPhone', 'clubEmail', 'applicantName', 'applicantEmail'];

// Helper function for set comparison
export const isSetEqual = (setA: Set<string>, setB: Set<string>): boolean => {
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
};