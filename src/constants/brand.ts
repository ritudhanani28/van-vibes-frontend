/**
 * Brand Constants for Vaan Vibes Cafe & Restro.
 */
export { AppColors } from './tokens';

export interface CafeBrandMeta {
  id: string;
  name: string;
  hindiName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  currency: string;
  operatingHours: string;
}

export const CafeBrand: CafeBrandMeta = {
  id: 'van-vibes',
  name: 'Vaan Vibes Cafe & Restro',
  hindiName: 'वन VIBES',
  tagline: 'Cafe & Restro • Taste the Vibe',
  address: 'Main Promenade, Serenita Arts Quarter, Surat, Gujarat - 395007',
  phone: '+91 98765 43210',
  email: 'hello@vaanvibes.cafe',
  gstin: '24AAAAA0000A1Z5',
  currency: '₹',
  operatingHours: '10:00 AM - 11:30 PM',
};

export interface NavLink {
  label: string;
  href: string;
}

export const CafeQuickNavLinks: NavLink[] = [
  { label: 'Menu', href: '#menu' },
  { label: 'Beverages', href: '#beverages' },
  { label: 'Food', href: '#food' },
  { label: 'Desserts', href: '#desserts' },
];

/** @deprecated Retained for template backward compatibility */
export const AppNavLinks: NavLink[] = [
  { label: 'Menu', href: '#menu' },
  { label: 'About Us', href: '#about-us' },
  { label: 'Contact', href: '#contact' },
];

/** @deprecated Retained for template backward compatibility */
export const ProductNavLinks: NavLink[] = [];
