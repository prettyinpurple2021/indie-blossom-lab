
# Cyberpunk-Styled Modal/Dialog Component System

## Overview
Transform the existing Dialog, AlertDialog, and Sheet components with the "Cyberpunk Command Center" aesthetic, featuring glassmorphism, animated neon borders, hover effects, and a cohesive visual language matching the rest of the application.

## Current State Analysis
- The base `Dialog` and `AlertDialog` components use standard Radix UI styling with minimal customization
- The `NoteDialog` component already demonstrates the desired cyberpunk styling with `bg-black/95`, `backdrop-blur-xl`, and purple neon shadows
- The `Sheet` component lacks cyberpunk theming entirely
- The toast component has been successfully styled with glassmorphism and animated gradient borders

## Design Approach
Following the established patterns from the toast component and NoteDialog, the modals will feature:
- Glassmorphism backgrounds with `backdrop-blur-xl`
- Animated gradient border pseudo-elements
- Neon glow box-shadows in purple/cyan/pink
- Styled close buttons with hover glow effects
- Gradient text for titles
- Enhanced overlay with subtle purple tint

---

## Implementation Details

### 1. Update DialogOverlay
Add a subtle purple tint and enhanced blur effect to the backdrop:
- Background: Semi-transparent dark with purple undertone
- Enhanced blur for depth perception

### 2. Update DialogContent
Apply comprehensive cyberpunk styling:
- **Background**: `bg-background/80` with `backdrop-blur-xl` for glassmorphism
- **Border**: `border-primary/30` with neon purple accent
- **Shadow**: Multi-layered neon glow (`0 0 20px rgba(168,85,247,0.3), 0 0 40px rgba(168,85,247,0.1)`)
- **Animated border**: Add `before` pseudo-element with animated gradient border (similar to toast)
- **Hover enhancement**: Increase glow intensity on hover

### 3. Style Close Button
Transform the close button into a cyberpunk element:
- Rounded corners with `rounded-lg`
- Hover state with purple glow
- Background transition on hover
- Ring focus state matching primary color

### 4. Update DialogHeader
- Add subtle bottom border with gradient
- Spacing adjustments for visual hierarchy

### 5. Update DialogTitle
- Apply gradient text effect (`bg-clip-text bg-gradient-to-r from-foreground via-primary to-foreground`)
- Font display styling with `font-display` class
- Tracking adjustments for readability

### 6. Update DialogDescription
- Enhanced muted foreground with subtle transparency
- Consistent styling with toast description

### 7. Update DialogFooter
- Subtle top border separator
- Proper spacing for action buttons

### 8. Mirror Changes to AlertDialog
Apply identical styling to AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogOverlay, and action buttons

### 9. Update AlertDialogAction and AlertDialogCancel
- Action button: Add neon glow effect matching btn-led style
- Cancel button: Styled outline with primary border and hover glow

### 10. Update Sheet Component
Apply consistent cyberpunk styling:
- SheetOverlay: Purple-tinted backdrop
- SheetContent: Glassmorphism with neon border glow
- Animated border on the edge (left/right/top/bottom based on side)
- SheetTitle: Gradient text
- Close button styling matching Dialog

### 11. Add CSS Keyframes (if needed)
Add the `dialog-glow-pulse` animation for optional pulsing border effect on focused dialogs

---

## Technical Changes Summary

### File: `src/components/ui/dialog.tsx`
- Update DialogOverlay with purple-tinted backdrop
- Replace DialogContent styling with glassmorphism, neon shadows, and animated border pseudo-element
- Style the close button with hover glow
- Add gradient text to DialogTitle
- Enhance DialogDescription with adjusted opacity

### File: `src/components/ui/alert-dialog.tsx`
- Apply same DialogOverlay and DialogContent changes
- Style AlertDialogAction with neon glow button effect
- Style AlertDialogCancel with themed outline styling
- Add gradient text to AlertDialogTitle

### File: `src/components/ui/sheet.tsx`
- Update SheetOverlay with purple-tinted backdrop
- Add glassmorphism and side-specific neon border to sheetVariants
- Add neon glow shadow to SheetContent
- Style close button with hover effects
- Apply gradient text to SheetTitle

### File: `src/index.css` (optional enhancement)
- Add `.dialog-neon-border` utility class for reusable animated border effect
- Add keyframes for dialog-specific animations if needed

---

## Visual Outcome
After implementation, all modal/dialog components will feature:
1. Semi-transparent glassmorphism backgrounds that blur content behind
2. Glowing purple neon borders that pulse subtly
3. Animated gradient borders matching the toast component style
4. Hover states that intensify the neon glow
5. Close buttons with cyberpunk-themed interactions
6. Gradient text titles for visual hierarchy
7. Consistent styling across Dialog, AlertDialog, and Sheet components
