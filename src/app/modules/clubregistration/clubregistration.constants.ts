// Filterable fields for Clubregistration
export const clubregistrationFilterables = ['club', 'member', 'paymentStatus', 'isApprovedByClub', 'status', 'isCreatedByAdmin'];

// Searchable fields for Clubregistration
export const clubregistrationSearchableFields = [];

// Helper function for set comparison
export const isSetEqual = (setA: Set<string>, setB: Set<string>): boolean => {
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
};


export enum CLUB_REGISTRATION_STATUS {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  MANUAL = 'manual'
}