// Helper function to format currency in Pakistani Rupees
export const formatCurrency = (amount) => {
  return `Rs ${new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)}`;
};

// Helper to generate a unique ID (if needed, though Supabase handles UUIDs)
import { v4 as uuidv4 } from 'uuid';
export const generateUniqueId = () => uuidv4();
