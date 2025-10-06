# OurShopper - Design Guidelines

## Design Approach
**Selected Approach**: Design System (Utility-Focused)
**Primary Reference**: Linear + Modern Fintech Apps (Mint, YNAB)
**Justification**: Purchase tracking is a utility-focused, information-dense application where efficiency, scannability, and data clarity are paramount over visual flair.

## Core Design Principles
1. **Mobile-First**: Optimized for phone usage with thumb-friendly tap targets
2. **Scan-at-a-Glance**: Clear visual hierarchy for quick purchase review
3. **Minimal Friction**: Fast entry, instant sync, easy deletion
4. **Data Clarity**: Typography and spacing optimized for numerical data

---

## Color Palette

**Dark Mode (Primary)**
- Background: 220 15% 12%
- Surface: 220 13% 16%
- Surface Elevated: 220 12% 20%
- Border: 220 10% 28%
- Text Primary: 220 15% 95%
- Text Secondary: 220 10% 65%
- Primary Brand: 210 100% 58% (Vibrant blue for actions/accents)
- Success: 142 71% 45% (Confirmations)
- Danger: 0 72% 51% (Delete actions)
- Warning: 38 92% 50% (Alerts)

**Light Mode**
- Background: 220 20% 97%
- Surface: 0 0% 100%
- Border: 220 13% 88%
- Text Primary: 220 15% 15%
- Text Secondary: 220 10% 45%
- Primary Brand: 210 100% 48%

---

## Typography

**Font Family**: System font stack for optimal mobile performance
- Primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

**Scale**:
- Hero/Page Title: 28px, font-weight 700
- Section Headers: 20px, font-weight 600
- Purchase Item: 16px, font-weight 500
- Labels/Metadata: 14px, font-weight 400
- Small Text: 12px, font-weight 400

**Numeric Data**: Use tabular-nums for price alignment

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Consistent use of p-4 for cards, m-6 for section spacing, gap-2 for tight groups

**Container Strategy**:
- Max width: 640px (mobile-optimized)
- Page padding: px-4 (16px)
- Safe area consideration for mobile notches

**Grid/List Layout**:
- Single-column list on mobile
- Full-width cards with internal grid for data columns

---

## Component Library

### Navigation
- **Top Bar**: Sticky header with app name, total balance indicator, sync status icon
- **Bottom Navigation**: Floating action button (FAB) for quick add, fixed position
- Height: 56px for comfortable thumb reach

### Purchase List Item
- **Card Design**: Elevated surface with subtle shadow, rounded corners (12px)
- **Internal Layout**: 
  - Left: Date (small, secondary text) + Place (primary, bold)
  - Right: Price (large, tabular, primary color)
  - Below: Category badge + Payment type badge (pill-shaped, subtle backgrounds)
- **Delete Button**: Icon-only, positioned top-right, red on hover
- **Spacing**: mb-3 between cards, p-4 internal padding

### Input Form (Add Purchase)
- **Modal/Sheet**: Slide up from bottom (mobile pattern)
- **Field Layout**: Stack vertically with labels above inputs
- **Input Fields**: 
  - Date: Native date picker
  - Place: Text input with recent suggestions
  - Category: Segmented button group or dropdown
  - Payment Type: Dropdown with conditional check number field
  - Price: Numeric input with currency symbol prefix
- **Actions**: Primary "Add Purchase" button (full-width), Secondary "Cancel" (text button)

### Category Badges
- Pill-shaped, 6px border-radius
- Background: Category-specific subtle colors at 10% opacity
- Text: Category color at full saturation
- Grocery: Green theme
- Restaurant: Orange theme
- Clothing: Purple theme
- Gas: Blue theme
- Medication: Red theme
- Entertainment: Pink theme
- Babysitter: Teal theme
- Gift: Gold theme
- Misc: Gray theme

### Sync Indicator
- **Real-time Status**: Small icon in header
- Synced: Green checkmark
- Syncing: Animated spinner
- Offline: Gray cloud with slash

### Empty State
- Centered illustration placeholder
- "No purchases yet" heading
- "Tap + to add your first purchase" subtext

---

## Animations

**Minimal & Purposeful**:
- List item delete: Slide out + fade (300ms ease-out)
- Modal entry: Slide up from bottom (250ms ease-out)
- Sync status: Gentle pulse when syncing
- NO decorative animations

---

## Responsive Behavior

**Mobile (Primary)**:
- Full-width cards
- Stacked form fields
- Thumb-zone optimized FAB (bottom-right, 16px from edges)

**Tablet/Desktop** (if accessed):
- Max 640px centered container
- Maintain mobile-like experience for consistency

---

## Accessibility

- Minimum touch target: 44x44px
- Color contrast: WCAG AA compliant (4.5:1 for text)
- Dark mode implementation across all components
- Clear focus states for keyboard navigation
- Semantic HTML for screen readers

---

## Images

**No hero images required** - This is a utility app focused on data entry and viewing. Any imagery should be:
- App icon/logo in header (simple "OS" monogram or shopping bag icon)
- Empty state illustration (minimal, line-art style)