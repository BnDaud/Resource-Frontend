import { Boxes, ClipboardList, LayoutDashboard, Quote, Settings, Tags, Users, type LucideIcon } from 'lucide-react'

export interface NavItem { to: string; label: string; icon: LucideIcon; end?: boolean; adminOnly?: boolean; badge?: 'inbox' }

/** Enquiries live inside "Quote requests" (a tab there), so they have no entry of their own. */
export const NAV: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Boxes },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/quotes', label: 'Quote requests', icon: ClipboardList, badge: 'inbox' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Quote },
  { to: '/admin/settings', label: 'Settings', icon: Settings, adminOnly: true },
  { to: '/admin/staff', label: 'Staff', icon: Users, adminOnly: true },
]
