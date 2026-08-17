# Design System Specification — Nền Tảng Kết Nối Gia Sư & Học Viên
## Phiên bản: 1.0 | Production-Ready | React + TypeScript + Tailwind CSS

---

# 1. Design Direction

### Tổng quan
Design System này được xây dựng cho một nền tảng EdTech hiện đại kết nối Gia sư và Học viên. Hướng thiết kế là **Modern SaaS + EdTech + Minimal UI** — sạch sẽ, chuyên nghiệp, đáng tin cậy nhưng vẫn thân thiện và dễ tiếp cận.

### Design Principles
1. **Clarity First**: Mọi yếu tố trực quan phải phục vụ việc hiểu nội dung và hành động.
2. **Progressive Disclosure**: Không hiển thị tất cả thông tin cùng lúc. Ưu tiên thông tin quan trọng.
3. **Consistent Feedback**: Ngườ dùng luôn biết hệ thống đang ở trạng thái nào.
4. **Mobile-First**: Thiết kế bắt đầu từ mobile và mở rộng lên desktop.
5. **Accessible by Default**: Không phải tính năng bổ sung, mà là yêu cầu bắt buộc.

### Lý do quyết định quan trọng
- **Không dùng Admin Template**: Nền tảng này phục vụ cả học viên và gia sư — không phải tool nội bộ. UI phải mang cảm giác "consumer app" chứ không phải "enterprise dashboard".
- **Màu chủ đạo Indigo-Teal**: Indigo truyền tải sự tin cậy và trí tuệ; Teal mang tính giáo dục, tươi mới nhưng không trẻ con như xanh lá hoặc cam.
- **Typography rõ ràng**: Ưu tiên khả năng đọc tiếng Việt (dấu rõ, khoảng cách hợp lý) với bộ font hiện đại có hinting tốt.
- **Animation có chủ đích**: Chỉ dùng animation để giải thích trạng thái hoặc tạo cảm giác mượt mà — không để trang trí.

---

# 2. Brand Identity

## Brand Direction

| Aspect | Proposal |
|--------|----------|
| **Brand Name Direction** | "Lia" / "Mentora" / "EduBridge" — ngắn gọn, dễ nhớ, mang hàm ý kết nối và hướng dẫn |
| **Visual Personality** | Warm Professional — chuyên nghiệp nhưng không lạnh lùng |
| **Brand Keywords** | Trust, Growth, Connection, Clarity, Guidance |
| **Logo Direction** | Logomark kết hợp hai hình tròn/chấm kết nối (tượng trưng gia sư-học viên) với đường cong mềm mại. Typography sans-serif geometric hiện đại. |
| **Icon Style** | Lucide-style: stroke 1.5-2px, rounded caps, consistent 24x24 grid. Không fill nặng. |
| **Illustration Style** | Abstract geometric shapes + soft gradients nhẹ. Tránh illustration "cartoon" quá mức. Ưu tiên photography authentic của gia sư và học viên thực. |
| **Photography** | Ảnh ngườ thật trong môi trường học tập tự nhiên. Ánh sáng tự nhiên, màu sắc ấm áp. Tránh stock photo generic. |

## Brand Essence
> **"Trust + Education + Connection + Growth"**

Mọi quyết định thiết kế phải phục vụ 4 giá trị này. Ví dụ:
- **Trust**: Verification badge rõ ràng, review system transparent, color palette ổn định.
- **Education**: Layout có hierarchy rõ ràng, typography dễ đọc, không gây mất tập trung.
- **Connection**: Avatar và profile nổi bật, messaging UI rõ ràng.
- **Growth**: Progress indicators, achievement badges, learning statistics.

---

# 3. Color System

## 3.1 Brand Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `color.primary` | `#4F46E5` | `#6366F1` | CTA chính, links, active states |
| `color.primary.hover` | `#4338CA` | `#818CF8` | Hover state của primary |
| `color.primary.active` | `#3730A3` | `#A5B4FC` | Active/pressed state |
| `color.primary.subtle` | `#EEF2FF` | `#1E1B4B` | Background nhẹ của primary elements |
| `color.secondary` | `#0D9488` | `#14B8A6` | Secondary actions, accent nhẹ |
| `color.secondary.hover` | `#0F766E` | `#2DD4BF` | Hover của secondary |
| `color.secondary.subtle` | `#F0FDFA` | `#042F2E` | Background nhẹ của secondary |
| `color.accent` | `#F59E0B` | `#FBBF24` | Highlight, stars, premium badges |
| `color.accent.subtle` | `#FFFBEB` | `#451A03` | Background nhẹ của accent |

## 3.2 Semantic Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `color.success` | `#10B981` | `#34D399` | Success states, verified badges |
| `color.success.subtle` | `#ECFDF5` | `#064E3B` | Success background |
| `color.warning` | `#F59E0B` | `#FBBF24` | Warnings, pending states |
| `color.warning.subtle` | `#FFFBEB` | `#451A03` | Warning background |
| `color.error` | `#EF4444` | `#F87171` | Errors, destructive actions |
| `color.error.subtle` | `#FEF2F2` | `#450A0A` | Error background |
| `color.info` | `#3B82F6` | `#60A5FA` | Information, tips |
| `color.info.subtle` | `#EFF6FF` | `#172554` | Info background |

## 3.3 Neutral Colors — Light Mode

| Token | HEX | Usage |
|-------|-----|-------|
| `color.background` | `#FFFFFF` | Page background |
| `color.surface` | `#FAFAFA` | Card background, sections |
| `color.surface.elevated` | `#FFFFFF` | Modal, dropdown, popover |
| `color.border` | `#E5E7EB` | Borders, dividers nhẹ |
| `color.border.strong` | `#D1D5DB` | Borders khi cần rõ hơn |
| `color.divider` | `#F3F4F6` | Section dividers |
| `color.text.primary` | `#111827` | Headings, primary text |
| `color.text.secondary` | `#4B5563` | Body text, descriptions |
| `color.text.muted` | `#9CA3AF` | Placeholders, timestamps |
| `color.text.disabled` | `#D1D5DB` | Disabled text |
| `color.text.inverse` | `#FFFFFF` | Text trên nền tối |

## 3.4 Neutral Colors — Dark Mode

| Token | HEX | Usage |
|-------|-----|-------|
| `color.background` | `#0F0F10` | Page background (không phải đen tuyệt đối) |
| `color.surface` | `#18181B` | Card background |
| `color.surface.elevated` | `#27272A` | Modal, dropdown, popover |
| `color.border` | `#3F3F46` | Borders |
| `color.border.strong` | `#52525B` | Strong borders |
| `color.divider` | `#27272A` | Section dividers |
| `color.text.primary` | `#FAFAFA` | Headings, primary text |
| `color.text.secondary` | `#A1A1AA` | Body text |
| `color.text.muted` | `#71717A` | Placeholders |
| `color.text.disabled` | `#52525B` | Disabled text |
| `color.text.inverse` | `#18181B` | Text trên nền sáng |

### Lý do chọn màu
- **Background dark không phải #000**: Giảm mỏi mắt, tạo chiều sâu, tránh contrast quá cao.
- **Primary Indigo**: Màu của sự tin cậy, phổ biến trong EdTech/SaaS, dễ phân biệt với Success (green) và Error (red).
- **Secondary Teal**: Bổ sung cho Indigo theo color theory (analogous), tạo cảm giác tươi mới, giáo dục.
- **Accent Amber**: Dùng ít, chỉ cho stars/ratings/premium — tạo điểm nhấn ấm áp.

---

# 4. Typography System

## 4.1 Font Family

| Role | Font | Fallback |
|------|------|----------|
| **Heading** | `Plus Jakarta Sans` | `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| **Body** | `Inter` | `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| **Monospace** | `JetBrains Mono` | `ui-monospace, SFMono-Regular, Menlo, Monaco, monospace` |

### Lý do chọn font
- **Plus Jakarta Sans**: Geometric sans-serif hiện đại, có Vietnamese subset, x-height cao, dễ đọc ở cỡ lớn.
- **Inter**: Font UI phổ biến nhất, hinting tuyệt vờ, dấu tiếng Việt rõ ràng, đọc tốt ở mọi cỡ.
- Cả hai đều có đầy đủ Vietnamese glyphs và variable font support.

## 4.2 Type Scale

| Token | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|------|--------|-------------|----------------|-------|
| `text.display` | Plus Jakarta Sans | 48px (3rem) | 700 | 1.1 | -0.02em | Hero headings |
| `text.h1` | Plus Jakarta Sans | 36px (2.25rem) | 700 | 1.2 | -0.02em | Page titles |
| `text.h2` | Plus Jakarta Sans | 30px (1.875rem) | 600 | 1.25 | -0.01em | Section headings |
| `text.h3` | Plus Jakarta Sans | 24px (1.5rem) | 600 | 1.3 | -0.01em | Card titles, subsections |
| `text.h4` | Plus Jakarta Sans | 20px (1.25rem) | 600 | 1.35 | 0 | Widget titles |
| `text.body.large` | Inter | 18px (1.125rem) | 400 | 1.6 | 0 | Lead paragraphs |
| `text.body` | Inter | 16px (1rem) | 400 | 1.6 | 0 | Default body text |
| `text.body.small` | Inter | 14px (0.875rem) | 400 | 1.5 | 0 | Descriptions, metadata |
| `text.caption` | Inter | 12px (0.75rem) | 400 | 1.5 | 0.01em | Timestamps, labels nhỏ |
| `text.label` | Inter | 12px (0.75rem) | 500 | 1.4 | 0.02em | Form labels, badges |
| `text.button` | Inter | 14px (0.875rem) | 500 | 1 | 0.01em | Button text |
| `text.overline` | Inter | 11px (0.6875rem) | 600 | 1.2 | 0.05em | Uppercase labels |

### Responsive Typography (Mobile)

| Token | Mobile Size |
|-------|-------------|
| `text.display` | 32px |
| `text.h1` | 28px |
| `text.h2` | 24px |
| `text.h3` | 20px |
| `text.h4` | 18px |
| `text.body.large` | 16px |

---

# 5. Spacing System

## 5.1 Base Scale (4px grid)

| Token | Value | Usage |
|-------|-------|-------|
| `space.0` | 0px | — |
| `space.px` | 1px | Hairline borders |
| `space.0.5` | 2px | Micro adjustments |
| `space.1` | 4px | Icon gaps, tight padding |
| `space.2` | 8px | Small gaps, inline spacing |
| `space.3` | 12px | Button padding-y small |
| `space.4` | 16px | Default padding, card gap |
| `space.5` | 20px | Medium padding |
| `space.6` | 24px | Section gaps, card padding |
| `space.8` | 32px | Large gaps, section padding |
| `space.10` | 40px | Section spacing |
| `space.12` | 48px | Large section spacing |
| `space.16` | 64px | Page section gaps |
| `space.20` | 80px | Major section spacing |
| `space.24` | 96px | Hero spacing |
| `space.32` | 128px | Extra large spacing |

## 5.2 Component Spacing Rules

- **Button padding**: `space.3` (12px) vertical, `space.5` (20px) horizontal
- **Input padding**: `space.3` (12px) vertical, `space.4` (16px) horizontal
- **Card padding**: `space.6` (24px) default, `space.4` (16px) compact
- **Card gap (grid)**: `space.4` (16px) mobile, `space.6` (24px) desktop
- **Section gap**: `space.16` (64px) default
- **Page padding**: `space.4` (16px) mobile, `space.8` (32px) desktop

---

# 6. Layout & Grid

## 6.1 Container

| Breakpoint | Max Width | Padding |
|------------|-----------|---------|
| Mobile (<640px) | 100% | 16px |
| Tablet (640-1024px) | 100% | 24px |
| Laptop (1024-1280px) | 1024px | 32px |
| Desktop (1280-1536px) | 1200px | 32px |
| Large Desktop (>1536px) | 1400px | 32px |

## 6.2 Grid System

- **Columns**: 12-column grid
- **Gutter**: 24px (desktop), 16px (tablet), 12px (mobile)
- **Method**: CSS Grid with `grid-cols-12`

## 6.3 Breakpoints (Tailwind)

| Name | Width | Tailwind Prefix | Usage |
|------|-------|-----------------|-------|
| `sm` | 640px | `sm:` | Large phones |
| `md` | 768px | `md:` | Tablets |
| `lg` | 1024px | `lg:` | Laptops |
| `xl` | 1280px | `xl:` | Desktops |
| `2xl` | 1536px | `2xl:` | Large screens |

## 6.4 Layout Dimensions

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| **Header height** | 64px | 64px | 56px |
| **Sidebar width** | 260px | 0 (drawer) | 0 (drawer) |
| **Content max-width** | 1200px | 100% | 100% |
| **Page padding** | 32px | 24px | 16px |
| **Section spacing** | 64px | 48px | 40px |

## 6.5 Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `z.base` | 0 | Default |
| `z.dropdown` | 100 | Dropdowns |
| `z.sticky` | 200 | Sticky headers |
| `z.drawer` | 300 | Drawers |
| `z.modal` | 400 | Modals |
| `z.popover` | 500 | Popovers, tooltips |
| `z.toast` | 600 | Toasts |

---

# 7. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius.none` | 0px | Tables, data-heavy UI |
| `radius.xs` | 4px | Tags, small badges |
| `radius.sm` | 6px | Buttons, inputs, small cards |
| `radius.md` | 8px | Cards, modals, dropdowns |
| `radius.lg` | 12px | Large cards, feature sections |
| `radius.xl` | 16px | Hero cards, bento items |
| `radius.2xl` | 24px | Special containers, onboarding |
| `radius.full` | 9999px | Avatars, pills, badges |

### Radius Assignment by Component

| Component | Radius |
|-----------|--------|
| Button | `radius.sm` (6px) |
| Input | `radius.sm` (6px) |
| Card | `radius.md` (8px) |
| Modal | `radius.lg` (12px) |
| Dropdown | `radius.md` (8px) |
| Avatar | `radius.full` |
| Badge | `radius.full` |
| Toast | `radius.md` (8px) |
| Tooltip | `radius.sm` (6px) |

---

# 8. Shadow & Elevation

## 8.1 Shadow Tokens

| Token | Value (Light) | Value (Dark) | Usage |
|-------|---------------|--------------|-------|
| `shadow.none` | none | none | Flat elements |
| `shadow.subtle` | `0 1px 2px rgba(0,0,0,0.04)` | `0 1px 2px rgba(0,0,0,0.2)` | Subtle depth |
| `shadow.small` | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)` | `0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)` | Cards default |
| `shadow.medium` | `0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)` | `0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2)` | Hover cards, dropdowns |
| `shadow.large` | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)` | `0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.2)` | Modals, popovers |
| `shadow.floating` | `0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.04)` | `0 20px 25px -5px rgba(0,0,0,0.4), 0 10px 10px -5px rgba(0,0,0,0.2)` | Toasts, floating buttons |

## 8.2 Elevation Assignment

| Component | Shadow |
|-----------|--------|
| Card (default) | `shadow.small` |
| Card (hover) | `shadow.medium` |
| Dropdown | `shadow.large` |
| Modal | `shadow.large` |
| Popover | `shadow.large` |
| Navbar | `shadow.subtle` |
| Toast | `shadow.floating` |
| Floating Action Button | `shadow.floating` |

---

# 9. Motion & Animation System

## 9.1 Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `duration.instant` | 0ms | No animation |
| `duration.fast` | 150ms | Micro-interactions (hover, focus) |
| `duration.normal` | 200ms | Component transitions |
| `duration.slow` | 300ms | Major transitions (modal, drawer) |
| `duration.slower` | 500ms | Page transitions, complex animations |

## 9.2 Easing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `ease.default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default transitions |
| `ease.in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements exiting |
| `ease.out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering |
| `ease.in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric transitions |
| `ease.spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful interactions (buttons, badges) |

## 9.3 Interaction Animations

### Button
- **Hover**: `scale(1.02)`, background darken, `duration.fast`, `ease.out`
- **Press**: `scale(0.98)`, `duration.instant`
- **Focus**: Ring 2px `color.primary` with 2px offset, `duration.fast`
- **Loading**: Spinner replaces text, opacity 0.7, cursor not-allowed

### Card
- **Hover**: `translateY(-2px)`, `shadow.medium`, `duration.normal`, `ease.out`
- **Press**: `scale(0.99)`, `duration.fast`

### Input
- **Focus**: Border color → `color.primary`, subtle shadow `0 0 0 3px color.primary.subtle`, `duration.fast`
- **Error**: Border color → `color.error`, shake animation (translateX ±4px, 3 cycles, 300ms)
- **Success**: Border color → `color.success`, checkmark icon fade in

### Dropdown
- **Open**: Opacity 0→1, translateY(-8px)→0, `duration.normal`, `ease.out`
- **Close**: Opacity 1→0, translateY(0)→(-8px), `duration.fast`, `ease.in`

### Modal
- **Open**: Backdrop opacity 0→0.5, content scale(0.95)→1 + opacity 0→1, `duration.slow`, `ease.out`
- **Close**: Reverse, `duration.normal`, `ease.in`

### Drawer (Sidebar Mobile)
- **Open**: Slide from left, `translateX(-100%)→0`, backdrop fade in, `duration.slow`, `ease.out`
- **Close**: Slide out, `duration.normal`, `ease.in`

### Toast
- **Enter**: Slide from right + fade in, `duration.normal`, `ease.spring`
- **Exit**: Slide right + fade out, `duration.normal`, `ease.in`
- **Auto-dismiss**: 5000ms default

### Tooltip
- **Show**: Opacity 0→1, translateY(4px)→0, `duration.fast`, `ease.out`
- **Hide**: Opacity 1→0, `duration.fast`, `ease.in`

### Page Transition
- **Enter**: Opacity 0→1, translateY(8px)→0, `duration.slow`, `ease.out`
- **Loading/Skeleton**: Shimmer animation (gradient sweep), 1.5s infinite

### Tab Switching
- **Active indicator**: Slide to new position, `duration.normal`, `ease.spring`
- **Content**: Cross-fade, `duration.normal`

### Navigation
- **Active link**: Underline scaleX(0)→1 from center, `duration.fast`
- **Mobile menu**: Hamburger → X morph, `duration.normal`

## 9.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# 10. Component Design System

## 10.1 Foundation Components

### Button

**Purpose**: Primary action trigger.

| Property | Value |
|----------|-------|
| **Height** | 40px (default), 36px (sm), 48px (lg) |
| **Padding** | 12px 20px (default), 8px 16px (sm), 16px 24px (lg) |
| **Border Radius** | 6px |
| **Font** | text.button (14px, weight 500) |
| **Gap** | 8px (icon + text) |

**Variants:**

| Variant | Background | Text | Border | Hover | Active |
|---------|-----------|------|--------|-------|--------|
| `primary` | `color.primary` | white | none | `color.primary.hover` | `color.primary.active` |
| `secondary` | `color.secondary` | white | none | `color.secondary.hover` | darken 10% |
| `outline` | transparent | `color.primary` | 1px `color.primary` | `color.primary.subtle` | `color.primary` + white text |
| `ghost` | transparent | `color.text.secondary` | none | `color.surface` | `color.border` |
| `danger` | `color.error` | white | none | darken 10% | darken 15% |

**States:**
- **Default**: As above
- **Hover**: Scale 1.02, shadow.small, background darken
- **Focus**: Ring 2px `color.primary` offset 2px
- **Active/Press**: Scale 0.98
- **Disabled**: Opacity 0.5, cursor not-allowed, no hover effects
- **Loading**: Spinner (16px) replaces or accompanies text, opacity 0.7

**Icon Button**: Square aspect ratio, same height rules, icon centered, radius 6px.

---

### Input

**Purpose**: Text data entry.

| Property | Value |
|----------|-------|
| **Height** | 44px (default), 36px (sm) |
| **Padding** | 12px 16px |
| **Border Radius** | 6px |
| **Border** | 1px `color.border` |
| **Background** | `color.surface` (light), `color.surface.elevated` (dark) |
| **Font** | text.body (16px) |
| **Placeholder** | `color.text.muted` |

**States:**
- **Default**: Border `color.border`, bg `color.surface`
- **Hover**: Border `color.border.strong`
- **Focus**: Border `color.primary`, ring 3px `color.primary.subtle`
- **Error**: Border `color.error`, ring 3px `color.error.subtle`, error icon right
- **Success**: Border `color.success`, checkmark icon right
- **Disabled**: Opacity 0.6, bg `color.surface`, cursor not-allowed
- **Read-only**: Border `color.border`, bg transparent

**With Icon**: Padding-left 44px if left icon, padding-right 44px if right icon/action.

---

### Textarea

Same as Input but:
- Min-height: 100px
- Resize: vertical only
- Padding: 12px 16px

---

### Select

- Same dimensions as Input
- Dropdown arrow icon right (16px, `color.text.muted`)
- Dropdown panel: `radius.md`, `shadow.large`, `color.surface.elevated`
- Option hover: `color.surface` background
- Option selected: `color.primary.subtle` bg, `color.primary` text, checkmark icon

---

### Checkbox

- Size: 18px × 18px
- Border radius: 4px
- Border: 2px `color.border`
- Checked: bg `color.primary`, border `color.primary`, white checkmark icon
- Indeterminate: horizontal line
- Focus: ring 2px `color.primary` offset 2px
- Label gap: 8px

---

### Radio

- Size: 18px × 18px
- Border radius: full
- Border: 2px `color.border`
- Checked: border 5px `color.primary` (inner dot style) OR bg `color.primary` with white dot
- Focus: ring 2px `color.primary`

---

### Switch

- Size: 44px × 24px (track)
- Border radius: full
- Track unchecked: `color.border`
- Track checked: `color.primary`
- Thumb: 20px circle, white, shadow.small
- Thumb position: 2px padding
- Transition: `duration.fast`
- Focus: ring 2px `color.primary`

---

### Label

- Font: text.label (12px, weight 500)
- Color: `color.text.secondary`
- Margin bottom: 6px
- Required indicator: `color.error` asterisk

---

### Badge

| Variant | Background | Text | Usage |
|---------|-----------|------|-------|
| `primary` | `color.primary.subtle` | `color.primary` | Default status |
| `secondary` | `color.secondary.subtle` | `color.secondary` | Secondary status |
| `success` | `color.success.subtle` | `color.success` | Verified, active |
| `warning` | `color.warning.subtle` | `color.warning` | Pending |
| `error` | `color.error.subtle` | `color.error` | Rejected, urgent |
| `neutral` | `color.surface` | `color.text.secondary` | Default |

- Padding: 4px 10px
- Border radius: full
- Font: text.label
- Can have dot indicator (6px circle) before text

---

### Avatar

| Size | Dimension | Usage |
|------|-----------|-------|
| `xs` | 24px | Inline mentions |
| `sm` | 32px | Lists, tables |
| `md` | 40px | Cards, navbars |
| `lg` | 56px | Profile headers |
| `xl` | 80px | Profile pages |
| `2xl` | 120px | Hero sections |

- Border radius: full
- Fallback: Initials with `color.primary.subtle` bg
- Border: 2px white + `shadow.small` for elevated avatars
- Online indicator: 10px green dot, bottom-right, 2px white border

---

### Tooltip

- Background: `color.text.primary` (light) / `color.surface.elevated` (dark)
- Text: `color.text.inverse` (light) / `color.text.primary` (dark)
- Padding: 8px 12px
- Border radius: 6px
- Font: text.caption
- Max-width: 240px
- Arrow: 6px triangle
- Delay: 300ms (hover), instant (focus)

---

### Divider

- Horizontal: 1px `color.divider`, full width
- Vertical: 1px `color.divider`, full height
- With text: padding 16px sides, text `color.text.muted`, text.label

---

## 10.2 Feedback Components

### Alert

- Border radius: 8px
- Padding: 16px
- Border-left: 4px semantic color
- Background: semantic subtle color
- Icon: 20px, semantic color, left
- Title: text.h4, semantic color
- Message: text.body.small, `color.text.secondary`
- Close button: top-right, ghost button

### Toast

- Position: bottom-right (desktop), top (mobile)
- Max-width: 400px
- Border radius: 8px
- Padding: 16px
- Background: `color.surface.elevated`
- Shadow: `shadow.floating`
- Icon: 20px, semantic color
- Progress bar: bottom, 4px height, semantic color, animates width 100%→0% over 5s

### Notification

- Similar to Toast but:
  - Can stack (max 5)
  - Swipe to dismiss on mobile
  - Action buttons supported

### Progress

- Height: 8px (default), 4px (thin)
- Border radius: full
- Background: `color.border`
- Fill: `color.primary` (default), semantic colors for status
- Animated: width transition `duration.slow`
- Indeterminate: shimmer animation

### Spinner

- Sizes: 16px (button), 24px (inline), 32px (page)
- Color: `color.primary` (default), white (on dark bg)
- Stroke: 2px, rounded caps
- Animation: rotate 360°, 0.8s linear infinite

### Skeleton

- Background: `color.border` (light) / `color.surface.elevated` (dark)
- Border radius: 4px
- Shimmer: linear-gradient sweep, 1.5s infinite
- Text skeleton: height = line-height, width 60-100%

### Empty State

- Icon: 48px, `color.text.muted`
- Title: text.h3, `color.text.primary`
- Description: text.body, `color.text.secondary`
- Action: Button primary or outline
- Centered, padding 48px

### Error State

- Icon: 48px, `color.error`
- Title: text.h3, `color.text.primary`
- Message: text.body, `color.text.secondary`
- Retry button: primary
- Can include error code in caption

---

## 10.3 Surface Components

### Card

- Background: `color.surface`
- Border: 1px `color.border` (optional, can be borderless)
- Border radius: 8px
- Padding: 24px (default), 16px (compact)
- Shadow: `shadow.small` (default), none (flat variant)
- Hover: `shadow.medium`, translateY(-2px)

**Card Parts:**
- Header: padding-bottom 16px, border-bottom 1px `color.divider` (optional)
- Content: default padding
- Footer: padding-top 16px, border-top 1px `color.divider` (optional)

### Dialog / Modal

- Overlay: bg black/50, backdrop-blur-sm
- Container: max-width 480px (default), 640px (lg), 960px (xl)
- Background: `color.surface.elevated`
- Border radius: 12px
- Shadow: `shadow.large`
- Padding: 24px
- Close button: top-right, ghost icon button

**Modal Sections:**
- Header: title (text.h3), close button
- Body: scrollable if overflow, padding-y 16px
- Footer: action buttons, right-aligned, gap 12px

### Drawer

- Width: 380px (default), 100% (mobile)
- Background: `color.surface.elevated`
- Shadow: `shadow.large`
- Overlay: same as Modal
- Position: right (default), left (sidebar)
- Header: padding 16px 24px, border-bottom
- Body: padding 24px, scrollable

### Popover

- Background: `color.surface.elevated`
- Border radius: 8px
- Shadow: `shadow.large`
- Padding: 16px
- Arrow: 8px, same background
- Max-width: 320px

### Dropdown Menu

- Background: `color.surface.elevated`
- Border radius: 8px
- Shadow: `shadow.large`
- Padding: 4px
- Item padding: 8px 12px
- Item hover: `color.surface`
- Item active: `color.primary.subtle`
- Separator: 1px `color.divider`, margin 4px 0
- Icon: 16px, `color.text.muted`, margin-right 12px

---

## 10.4 Navigation Components

### Header

- Height: 64px (desktop), 56px (mobile)
- Background: `color.background` / `color.surface` with blur
- Border-bottom: 1px `color.divider`
- Position: sticky, top 0, z-index 200
- Content: Logo left, nav center (desktop), actions right
- Mobile: hamburger menu left, logo center, actions right

### Sidebar (Desktop)

- Width: 260px
- Background: `color.surface`
- Border-right: 1px `color.divider`
- Padding: 16px 12px
- Item height: 40px
- Item padding: 0 12px
- Item radius: 6px
- Item hover: `color.surface.elevated`
- Item active: `color.primary.subtle`, text `color.primary`
- Icon: 20px, margin-right 12px
- Collapsible sections with chevron icon

### Sidebar (Mobile Drawer)

- Same styling but as Drawer component
- Width: 85% viewport, max 320px
- Overlay with close on tap

### Navbar (Bottom Mobile)

- Height: 64px
- Background: `color.surface.elevated` with blur
- Border-top: 1px `color.divider`
- Position: fixed, bottom 0
- Items: 3-5 icons with labels
- Active: `color.primary` icon + label
- Inactive: `color.text.muted`
- Safe area padding for notch devices

### Breadcrumb

- Font: text.body.small
- Color: `color.text.muted` (inactive), `color.text.primary` (active)
- Separator: `/` or chevron icon, `color.text.muted`
- Item hover: underline

### Tabs

- Height: 40px
- Background: transparent
- Border-bottom: 1px `color.divider` (container)
- Tab item: padding 0 16px, text.body, `color.text.secondary`
- Tab active: text `color.primary`, border-bottom 2px `color.primary`
- Tab hover: text `color.text.primary`
- Animated indicator: slides between tabs, `duration.normal`, `ease.spring`
- Variant: Pill tabs (radius full, bg `color.surface`, active bg `color.primary` + white text)

### Pagination

- Item size: 36px × 36px
- Border radius: 6px
- Font: text.body.small
- Default: bg transparent, text `color.text.secondary`
- Hover: bg `color.surface`
- Active: bg `color.primary`, text white
- Disabled: opacity 0.4
- Prev/Next: chevron icons

---

## 10.5 Data Display Components

### Table

- Width: 100%
- Header: bg `color.surface`, text text.label, uppercase, `color.text.muted`
- Header padding: 12px 16px
- Row: border-bottom 1px `color.divider`
- Cell padding: 14px 16px
- Row hover: bg `color.surface`
- Selected row: bg `color.primary.subtle`
- Sortable header: hover text `color.primary`, sort icon right
- Empty: Empty State component
- Loading: Skeleton rows (5 rows)
- Mobile: Card-based layout instead of table (stack rows as cards)

### List

- Item padding: 12px 16px
- Item gap: 0 (divided) or 8px (cards)
- Divided: border-bottom 1px `color.divider`
- Card variant: bg `color.surface`, radius 8px, shadow.small
- Hover: bg `color.surface` (divided) or shadow.medium (card)

### Statistic Card

- Layout: vertical (default) or horizontal
- Label: text.caption, `color.text.muted`, uppercase
- Value: text.h2 or text.h3, `color.text.primary`
- Change indicator: arrow + percentage, semantic color
- Icon: 24px, optional, in colored circle background
- Background: `color.surface`
- Border radius: 8px
- Padding: 20px
- Shadow: `shadow.small`

### Rating

- Star size: 16px (sm), 20px (default), 24px (lg)
- Filled: `color.accent`
- Empty: `color.border`
- Half: gradient or clipped star
- Hover: scale 1.1 individual star
- Read-only: no hover
- With count: "4.5 (128 reviews)", text.body.small

### Timeline

- Line: 2px, `color.border`, left-aligned
- Dot: 12px, `color.primary`, border 2px white
- Content: padding-left 24px
- Timestamp: text.caption, `color.text.muted`
- Title: text.body, weight 500
- Description: text.body.small, `color.text.secondary`

---

# 11. Tutor-Specific Components

### Tutor Card

```
+--------------------------------+
| [Avatar]  Name                 |
|           * 4.9 (120)          |
|                                |
| [Subject] [Subject]            |
|                                |
| 📍 Location | 💰 Rate          |
|                                |
| "Bio excerpt..."               |
|                                |
| [Verified] [Book Button]       |
+--------------------------------+
```

- Width: 100% (grid item)
- Background: `color.surface`
- Border radius: 8px
- Shadow: `shadow.small`
- Padding: 20px
- Hover: `shadow.medium`, translateY(-2px)

**Elements:**
- Avatar: 56px, top-left
- Name: text.h4, `color.text.primary`
- Rating: Star icon (16px, `color.accent`) + value + count
- Subject Badges: max 2 visible, "+N" overflow badge
- Location: MapPin icon + text.body.small
- Rate: text.h4, `color.primary`, "/giờ"
- Bio: 2 lines max, text.body.small, `color.text.secondary`, truncate with ellipsis
- Verified Badge: CheckCircle icon, `color.success`, tooltip "Đã xác minh"
- CTA: Button primary "Đặt lịch" full-width

### Tutor Profile Header

- Background: `color.surface` or subtle gradient
- Padding: 32px
- Avatar: 120px, centered or left
- Name: text.h1
- Title: text.body.large, `color.text.secondary`
- Stats row: Rating | Lessons | Students | Response rate
- Actions: "Book Now" primary, "Message" outline

### Tutor Verification Badge

- Icon: ShieldCheck or BadgeCheck
- Verified: `color.success`
- Pending: `color.warning`
- Unverified: `color.text.muted`
- Tooltip: Explain verification level

### Subject Badge

- Background: `color.primary.subtle`
- Text: `color.primary`
- Border radius: full
- Padding: 4px 12px
- Font: text.label

### Experience Badge

- Icon: Briefcase or Award
- Text: "5+ năm kinh nghiệm"
- Style: ghost badge, `color.text.secondary`

### Tutor Availability

- Calendar grid: 7 columns (Mon-Sun)
- Time slots: pill buttons
- Available: bg `color.success.subtle`, text `color.success`, border `color.success`
- Booked: bg `color.surface`, text `color.text.muted`, opacity 0.5
- Selected: bg `color.primary`, text white
- Hover available: bg `color.primary.subtle`

### Tutor Schedule

- Timeline view or calendar view
- Lesson blocks: colored by status
  - Confirmed: `color.primary`
  - Pending: `color.warning`
  - Completed: `color.success`
  - Cancelled: `color.error`
- Block shows: Time, Student name, Subject

### Tutor Review Card

- Avatar + Name: 40px
- Rating: 5 stars
- Date: text.caption
- Content: text.body, 3-4 lines
- Subject tag: what the review is for
- Helpful button: thumbs up + count

### Tutor Statistics

- Grid of Statistic Cards
- Metrics: Total lessons, Active students, Rating, Response rate, Earnings (if applicable)

---

# 12. Student-Specific Components

### Student Profile

- Similar structure to Tutor Profile but:
  - Show learning goals instead of subjects
  - Display enrolled/completed subjects
  - Learning streak indicator

### Learning Progress

- Circular progress: 64px diameter, stroke 6px
- Color: `color.primary`
- Center: percentage text
- Label below: subject name
- Multiple: horizontal scroll row

### Progress Card

- Subject name: text.h4
- Progress bar: 8px height
- Percentage: text.body.small, right
- Lessons completed: "12/20 bài học"
- Next lesson: text.caption

### Course/Subject Card

- Thumbnail image: 16:9 ratio, radius top 8px
- Content padding: 16px
- Title: text.h4
- Tutor: Avatar (24px) + Name
- Progress bar if enrolled
- Status badge: "Đang học", "Đã hoàn thành", "Chưa bắt đầu"

### Upcoming Lesson

- Background: `color.primary.subtle`
- Border radius: 12px
- Padding: 20px
- Time: text.h3, `color.primary`
- Date: text.body
- Tutor: Avatar + Name
- Subject: text.body.small
- Actions: "Join" button (if online) or "View Details"
- Countdown: text.caption if < 24h

### Booking Card

- Tutor info: Avatar + Name
- Subject: badge
- Schedule: date + time
- Status: badge (pending, confirmed, completed, cancelled)
- Actions based on status:
  - Pending: "Cancel" outline
  - Confirmed: "Reschedule" outline + "Join" primary
  - Completed: "Review" primary
  - Cancelled: "Book again" outline

### Learning Goal

- Icon: Target or Flag
- Title: text.body, weight 500
- Deadline: text.caption, `color.text.muted`
- Progress: thin progress bar
- Checkbox: mark complete

### Recommended Tutor

- Horizontal scroll card
- Compact Tutor Card variant
- "Recommended for you" label
- Reason: "Dạy môn bạn đang quan tâm"

---

# 13. Booking System UI

## 13.1 Search & Filter

### Search Bar

- Height: 48px
- Border radius: 8px or full (pill)
- Background: `color.surface`
- Border: 1px `color.border`
- Icon: Search, left, 20px
- Placeholder: "Tìm gia sư theo môn học, tên..."
- Focus: border `color.primary`, ring
- Clear button: X icon appears when has value
- Width: 100%, max-width 640px

### Filter Panel

- Collapsible on mobile (drawer)
- Checkboxes for subjects
- Price range: dual slider
- Rating: radio buttons (4+, 3+, etc.)
- Location: select or autocomplete
- Availability: day picker
- Apply button: primary, full-width
- Reset button: ghost

### Sort

- Select dropdown
- Options: "Phổ biến", "Đánh giá cao", "Giá thấp đến cao", "Giá cao đến thấp"

## 13.2 Booking Flow

### Step 1: Search Results
- Grid: 1 col (mobile), 2 col (tablet), 3 col (desktop), 4 col (xl)
- Tutor Card components
- Pagination or infinite scroll

### Step 2: Tutor Profile
- Profile header
- About section (expandable)
- Subjects & rates
- Availability calendar
- Reviews section (tab)
- Sticky CTA bar mobile: "Đặt lịch ngay"

### Step 3: Select Schedule
- Calendar component (month view)
- Available time slots grid
- Duration selector: 60min, 90min, 120min
- Selected slot highlight

### Step 4: Booking Summary
- Tutor info
- Selected time
- Duration
- Price calculation
- Notes textarea
- Policies checkbox

### Step 5: Confirmation
- Success illustration/icon
- Booking details summary card
- Add to calendar button
- "View my bookings" CTA
- Share option

### Booking Status

| Status | Badge Color | Icon | Actions |
|--------|-------------|------|---------|
| Pending | warning | Clock | Cancel |
| Confirmed | success | CheckCircle | Reschedule, Join |
| Completed | primary | CheckCircle2 | Review, Book again |
| Cancelled | error | XCircle | Book again |
| Rescheduled | info | RefreshCw | View new time |

---

# 14. Review & Rating System

### Star Rating Input

- 5 stars, 32px each
- Hover: fill up to hovered star
- Selected: `color.accent`
- Unselected: `color.border`
- Half-star support if needed

### Review Card

- Border: 1px `color.divider`
- Border radius: 8px
- Padding: 20px
- Header: Avatar (40px) + Name + Date
- Rating: 5 stars display
- Subject: badge "Toán học"
- Content: text.body
- Helpful: ThumbsUp button + count
- Report: dropdown

### Review Summary

- Average: text.display, `color.text.primary`
- Stars: large star display
- Total count: text.body
- "X% khuyến nghị gia sư này"

### Rating Distribution

- 5 rows (5★ to 1★)
- Label: "5 sao"
- Bar: progress bar, `color.accent`
- Count: text.caption

### Write Review Form

- Star rating input (required)
- Subject select (which subject)
- Textarea: "Chia sẻ trải nghiệm..." (min 50 chars)
- Anonymous checkbox
- Submit button
- Guidelines: "Đánh giá trung thực và xây dựng"

### Verified Review Indicator

- Badge: "Đã xác minh" with CheckCircle
- Tooltip: "Học viên đã hoàn thành buổi học"
- Color: `color.success`

---

# 15. Dashboard Design

## 15.1 Student Dashboard

### Layout
- Sidebar (desktop) / Bottom nav (mobile)
- Header: sticky
- Content: max-width 1200px, centered

### Sections (Top to Bottom)

1. **Welcome Section**
   - "Chào [Name]" text.h2
   - Date: text.body, `color.text.secondary`
   - Quick stats row: 3-4 Statistic Cards (bento grid)

2. **Upcoming Lesson** (priority)
   - If has upcoming: Upcoming Lesson component (highlighted)
   - If empty: "Bạn chưa có lịch học sắp tới" + CTA "Tìm gia sư"

3. **Learning Progress**
   - Horizontal scroll of Progress Cards
   - Or grid if few items

4. **Recommended Tutors**
   - Horizontal scroll
   - Compact Tutor Cards
   - "Xem tất cả" link

5. **Recent Bookings**
   - Table (desktop) / Cards (mobile)
   - Last 5 bookings
   - "Xem lịch sử" link

6. **Recent Reviews**
   - Review cards or list
   - "Viết đánh giá" for completed lessons pending review

7. **Quick Actions**
   - Button group: "Tìm gia sư", "Lịch học", "Tin nhắn", "Cài đặt"

### Bento Grid Areas
- Use 2×2 or 3×2 grid for stats
- Each cell: Statistic Card
- Gap: 16px

## 15.2 Tutor Dashboard

### Sections

1. **Overview Stats**
   - Bento grid: 4 cells
   - Metrics: Buổi dạy tháng này, Học viên đang dạy, Đánh giá trung bình, Thu nhập tháng

2. **Upcoming Lessons**
   - Timeline view for today + next 3 days
   - Or list with time blocks

3. **Booking Requests**
   - List of pending bookings
   - Actions: Accept / Decline
   - Highlight new requests

4. **Student List**
   - Compact list with avatars
   - Last lesson date
   - Quick message button

5. **Schedule Overview**
   - Mini calendar (current week)
   - Click to full schedule

6. **Earnings Chart** (if applicable)
   - Simple bar chart: last 7 days or 4 weeks
   - Total this month

7. **Recent Reviews**
   - Last 3 reviews
   - Average rating

8. **Quick Actions**
   - "Cập nhật lịch", "Chỉnh sửa hồ sơ", "Tin nhắn"

---

# 16. Authentication UI

### Layout
- Centered card, max-width 420px
- Full viewport height, vertically centered
- Background: subtle gradient or pattern (optional, very light)
- Logo top center, 40px height

### Login
- Title: "Đăng nhập" text.h2
- Subtitle: "Chào mừng trở lại" text.body
- Email input
- Password input with toggle visibility
- "Quên mật khẩu?" link
- "Đăng nhập" button (primary, full-width)
- Divider: "hoặc"
- Social login: Google, Facebook (outline buttons)
- Footer: "Chưa có tài khoản? Đăng ký"

### Student Register
- Title: "Tạo tài khoản học viên"
- Fields: Họ tên, Email, Số điện thoại, Mật khẩu, Xác nhận mật khẩu
- Checkbox: "Tôi đồng ý với điều khoản"
- "Đăng ký" button
- Link: "Đăng ký làm gia sư"

### Tutor Register
- Multi-step form indicator (stepper)
- Step 1: Account info (same as student)
- Step 2: Profile info (subjects, experience, bio)
- Step 3: Verification (ID, certificates)
- Navigation: "Tiếp tục" / "Quay lại"

### Forgot Password
- Email input
- "Gửi link đặt lại" button
- Success: "Kiểm tra email của bạn"

### Reset Password
- New password
- Confirm password
- "Đặt lại mật khẩu" button

### Verification
- OTP input: 6 boxes, auto-focus next
- Resend countdown: 60s
- "Xác minh" button

### States
- **Loading**: Button shows spinner, disabled
- **Error**: Inline error message below field, red border
- **Success**: Green checkmark, redirect after 2s
- **Field error**: Shake animation, error message, red border

---

# 17. Responsive Design Rules

## 17.1 Global Rules

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Container padding | 16px | 24px | 32px |
| Grid columns | 1-2 | 2-3 | 3-4 |
| Section spacing | 40px | 48px | 64px |
| Typography scale | -20% | -10% | 100% |

## 17.2 Component Behaviors

### Sidebar
- **Desktop**: Fixed left, 260px, always visible
- **Tablet**: Collapsible, icon-only (72px) or hidden
- **Mobile**: Hidden, triggered by hamburger → Drawer from left

### Header
- **Desktop**: Horizontal nav links, search bar, user menu
- **Tablet**: Condensed nav, search icon → expand
- **Mobile**: Hamburger, logo centered, minimal actions

### Tables
- **Desktop**: Full table with all columns
- **Tablet**: Hide less important columns, horizontal scroll
- **Mobile**: Card-based layout (each row becomes a card)

### Cards (Tutor Listing)
- **Mobile**: 1 column, full width
- **Tablet**: 2 columns
- **Desktop**: 3 columns
- **Large**: 4 columns

### Booking Calendar
- **Desktop**: Full week view, side panel for details
- **Tablet**: Week view, modal for details
- **Mobile**: Day view swipeable, bottom sheet for details

### Dashboard
- **Desktop**: Sidebar + main content, bento grids
- **Tablet**: Collapsible sidebar, simplified grids
- **Mobile**: Bottom nav, single column, cards stack vertically

### Forms
- **Desktop**: Multi-column if related fields (name, phone)
- **Mobile**: Single column, full-width inputs
- **Actions**: Full-width buttons on mobile

### Modals
- **Desktop**: Centered, max-width 480px
- **Mobile**: Bottom sheet (slide up from bottom), full-width

---

# 18. Accessibility

## 18.1 WCAG Compliance
- Target: WCAG 2.1 Level AA
- Color contrast: minimum 4.5:1 for text, 3:1 for UI components
- All interactive elements: minimum 44×44px touch target

## 18.2 Keyboard Navigation
- All interactive elements focusable
- Tab order: logical, top-to-bottom, left-to-right
- Focus visible: ring 2px `color.primary`, offset 2px
- Escape: close modals, dropdowns, drawers
- Enter/Space: activate buttons, links
- Arrow keys: navigate radio groups, tabs, dropdown items
- Home/End: jump to first/last item in lists

## 18.3 Screen Reader
- Semantic HTML: `<nav>`, `<main>`, `<aside>`, `<header>`
- Headings hierarchy: h1→h2→h3, không skip
- Images: meaningful alt text
- Icons: aria-hidden="true", hoặc aria-label nếu standalone
- Live regions: `aria-live="polite"` cho toasts, alerts
- Form labels: explicitly associated with `htmlFor`
- Error messages: `aria-describedby` linking to input

## 18.4 ARIA Patterns
- Modal: `role="dialog"`, `aria-modal="true"`, focus trap
- Tabs: `role="tablist"`, `role="tab"`, `role="tabpanel"`
- Accordion: `role="region"`, `aria-expanded`
- Dropdown: `role="menu"`, `aria-haspopup`, `aria-expanded`
- Toast: `role="status"` hoặc `role="alert"`

## 18.5 Touch Targets
- Minimum: 44×44px
- Buttons: 40px height minimum (48px preferred on mobile)
- Spacing between touch targets: minimum 8px

## 18.6 Reduced Motion
- Respect `prefers-reduced-motion`
- Disable parallax, auto-playing animations
- Instant transitions for users who prefer

---

# 19. Tailwind CSS Implementation Mapping

## 19.1 Color Tokens (tailwind.config.ts)

```typescript
colors: {
  primary: {
    DEFAULT: '#4F46E5',
    hover: '#4338CA',
    active: '#3730A3',
    subtle: '#EEF2FF',
  },
  secondary: {
    DEFAULT: '#0D9488',
    hover: '#0F766E',
    subtle: '#F0FDFA',
  },
  accent: {
    DEFAULT: '#F59E0B',
    subtle: '#FFFBEB',
  },
  success: {
    DEFAULT: '#10B981',
    subtle: '#ECFDF5',
  },
  warning: {
    DEFAULT: '#F59E0B',
    subtle: '#FFFBEB',
  },
  error: {
    DEFAULT: '#EF4444',
    subtle: '#FEF2F2',
  },
  info: {
    DEFAULT: '#3B82F6',
    subtle: '#EFF6FF',
  },
  background: '#FFFFFF',
  surface: {
    DEFAULT: '#FAFAFA',
    elevated: '#FFFFFF',
  },
  border: {
    DEFAULT: '#E5E7EB',
    strong: '#D1D5DB',
  },
  divider: '#F3F4F6',
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    muted: '#9CA3AF',
    disabled: '#D1D5DB',
    inverse: '#FFFFFF',
  },
}
```

## 19.2 Dark Mode Tokens

```typescript
darkMode: 'class',
// Trong component hoặc CSS variable:
colors: {
  background: '#0F0F10',
  surface: {
    DEFAULT: '#18181B',
    elevated: '#27272A',
  },
  border: {
    DEFAULT: '#3F3F46',
    strong: '#52525B',
  },
  divider: '#27272A',
  text: {
    primary: '#FAFAFA',
    secondary: '#A1A1AA',
    muted: '#71717A',
    disabled: '#52525B',
    inverse: '#18181B',
  },
  primary: {
    DEFAULT: '#6366F1',
    hover: '#818CF8',
    active: '#A5B4FC',
    subtle: '#1E1B4B',
  },
  // ... other semantic colors adjusted
}
```

## 19.3 Typography Tokens

```typescript
fontFamily: {
  heading: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
  body: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
},
fontSize: {
  display: ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
  h1: ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
  h2: ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
  h3: ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
  h4: ['1.25rem', { lineHeight: '1.35', fontWeight: '600' }],
  'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
  body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
  'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
  caption: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
  label: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
  overline: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '600' }],
},
```

## 19.4 Spacing Tokens

Tailwind mặc định đã có spacing scale 4px-based. Custom nếu cần:

```typescript
spacing: {
  // Tailwind default đã đủ: 0, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32
  // Chỉ cần thêm nếu thiếu:
  '18': '4.5rem',   // 72px
  '22': '5.5rem',   // 88px
  '28': '7rem',     // 112px
}
```

## 19.5 Border Radius Tokens

```typescript
borderRadius: {
  none: '0px',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
}
```

## 19.6 Shadow Tokens

```typescript
boxShadow: {
  none: 'none',
  subtle: '0 1px 2px rgba(0,0,0,0.04)',
  small: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
  medium: '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)',
  large: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)',
  floating: '0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.04)',
}
```

## 19.7 Animation Tokens

```typescript
transitionDuration: {
  instant: '0ms',
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
},
transitionTimingFunction: {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
}
```

## 19.8 Breakpoints

Tailwind defaults (đã đủ):
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 19.9 Z-Index Tokens

```typescript
zIndex: {
  base: '0',
  dropdown: '100',
  sticky: '200',
  drawer: '300',
  modal: '400',
  popover: '500',
  toast: '600',
}
```

## 19.10 Example Component Class Mapping

### Button Primary
```tsx
<button className="
  h-10 px-5
  bg-primary text-white
  rounded-sm
  font-body text-sm font-medium
  transition-all duration-fast ease-out
  hover:bg-primary-hover hover:scale-[1.02] hover:shadow-small
  active:scale-[0.98]
  focus:ring-2 focus:ring-primary focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
">
```

### Card
```tsx
<div className="
  bg-surface
  rounded-md
  p-6
  shadow-small
  transition-all duration-normal ease-out
  hover:shadow-medium hover:-translate-y-0.5
">
```

### Input
```tsx
<input className="
  h-11 px-4
  bg-surface
  border border-border rounded-sm
  font-body text-base
  placeholder:text-text-muted
  transition-all duration-fast
  hover:border-border-strong
  focus:border-primary focus:ring-[3px] focus:ring-primary-subtle
  disabled:opacity-60 disabled:cursor-not-allowed
  aria-invalid:border-error aria-invalid:ring-error-subtle
">
```

---

# 20. Component States

Đối với mọi component tương tác, phải thiết kế đầy đủ các state:

| State | Mô tả | Visual Indicator |
|-------|-------|------------------|
| **Default** | Trạng thái ban đầu | Theo design token |
| **Hover** | Chuột hover qua | Background darken, scale 1.02, shadow tăng |
| **Focus** | Tab/click focus | Ring 2px primary, offset 2px |
| **Active** | Đang nhấn giữ | Scale 0.98, background darker |
| **Disabled** | Không khả dụng | Opacity 0.5, cursor not-allowed, no interaction |
| **Loading** | Đang xử lý | Spinner, opacity 0.7, disabled interactions |
| **Error** | Có lỗi | Border red, error icon, shake animation |
| **Success** | Thành công | Border green, checkmark icon |
| **Selected** | Được chọn | Primary bg hoặc border, checkmark |
| **Empty** | Không có dữ liệu | Empty State component |
| **Read-only** | Chỉ đọc | No border change, no focus ring |
| **Checked** | Đã check (checkbox/radio) | Fill primary, white checkmark |
| **Indeterminate** | Trạng thái giữa (checkbox) | Horizontal line |
| **Expanded** | Đang mở rộng | Rotate chevron 180°, show content |
| **Collapsed** | Đang thu gọn | Rotate chevron 0°, hide content |

---

# 21. Design Tokens — Complete Reference

## 21.1 Color Tokens

| Token | Light Value | Dark Value | Purpose |
|-------|-------------|------------|---------|
| `color.primary` | `#4F46E5` | `#6366F1` | Primary actions, links |
| `color.primary.hover` | `#4338CA` | `#818CF8` | Primary hover state |
| `color.primary.active` | `#3730A3` | `#A5B4FC` | Primary active state |
| `color.primary.subtle` | `#EEF2FF` | `#1E1B4B` | Primary backgrounds |
| `color.secondary` | `#0D9488` | `#14B8A6` | Secondary actions |
| `color.secondary.hover` | `#0F766E` | `#2DD4BF` | Secondary hover |
| `color.secondary.subtle` | `#F0FDFA` | `#042F2E` | Secondary backgrounds |
| `color.accent` | `#F59E0B` | `#FBBF24` | Ratings, highlights |
| `color.accent.subtle` | `#FFFBEB` | `#451A03` | Accent backgrounds |
| `color.success` | `#10B981` | `#34D399` | Success states |
| `color.success.subtle` | `#ECFDF5` | `#064E3B` | Success backgrounds |
| `color.warning` | `#F59E0B` | `#FBBF24` | Warning states |
| `color.warning.subtle` | `#FFFBEB` | `#451A03` | Warning backgrounds |
| `color.error` | `#EF4444` | `#F87171` | Error states |
| `color.error.subtle` | `#FEF2F2` | `#450A0A` | Error backgrounds |
| `color.info` | `#3B82F6` | `#60A5FA` | Info states |
| `color.info.subtle` | `#EFF6FF` | `#172554` | Info backgrounds |
| `color.background` | `#FFFFFF` | `#0F0F10` | Page background |
| `color.surface` | `#FAFAFA` | `#18181B` | Card/section background |
| `color.surface.elevated` | `#FFFFFF` | `#27272A` | Modal/dropdown background |
| `color.border` | `#E5E7EB` | `#3F3F46` | Default borders |
| `color.border.strong` | `#D1D5DB` | `#52525B` | Strong borders |
| `color.divider` | `#F3F4F6` | `#27272A` | Dividers |
| `color.text.primary` | `#111827` | `#FAFAFA` | Primary text |
| `color.text.secondary` | `#4B5563` | `#A1A1AA` | Secondary text |
| `color.text.muted` | `#9CA3AF` | `#71717A` | Muted text |
| `color.text.disabled` | `#D1D5DB` | `#52525B` | Disabled text |
| `color.text.inverse` | `#FFFFFF` | `#18181B` | Text on dark/light |

## 21.2 Typography Tokens

| Token | Font | Size | Weight | Line Height | Letter Spacing |
|-------|------|------|--------|-------------|----------------|
| `typography.display` | Plus Jakarta Sans | 48px | 700 | 1.1 | -0.02em |
| `typography.h1` | Plus Jakarta Sans | 36px | 700 | 1.2 | -0.02em |
| `typography.h2` | Plus Jakarta Sans | 30px | 600 | 1.25 | -0.01em |
| `typography.h3` | Plus Jakarta Sans | 24px | 600 | 1.3 | -0.01em |
| `typography.h4` | Plus Jakarta Sans | 20px | 600 | 1.35 | 0 |
| `typography.body.large` | Inter | 18px | 400 | 1.6 | 0 |
| `typography.body` | Inter | 16px | 400 | 1.6 | 0 |
| `typography.body.small` | Inter | 14px | 400 | 1.5 | 0 |
| `typography.caption` | Inter | 12px | 400 | 1.5 | 0.01em |
| `typography.label` | Inter | 12px | 500 | 1.4 | 0.02em |
| `typography.button` | Inter | 14px | 500 | 1 | 0.01em |
| `typography.overline` | Inter | 11px | 600 | 1.2 | 0.05em |

## 21.3 Spacing Tokens

| Token | Value | Purpose |
|-------|-------|---------|
| `spacing.0` | 0px | Zero spacing |
| `spacing.px` | 1px | Hairline |
| `spacing.0.5` | 2px | Micro |
| `spacing.1` | 4px | Tight |
| `spacing.2` | 8px | Small |
| `spacing.3` | 12px | Compact |
| `spacing.4` | 16px | Default |
| `spacing.5` | 20px | Medium |
| `spacing.6` | 24px | Comfortable |
| `spacing.8` | 32px | Large |
| `spacing.10` | 40px | XLarge |
| `spacing.12` | 48px | XXLarge |
| `spacing.16` | 64px | Section |
| `spacing.20` | 80px | Major section |
| `spacing.24` | 96px | Hero |
| `spacing.32` | 128px | Extra large |

## 21.4 Radius Tokens

| Token | Value | Purpose |
|-------|-------|---------|
| `radius.none` | 0px | Tables, data |
| `radius.xs` | 4px | Tags, badges |
| `radius.sm` | 6px | Buttons, inputs |
| `radius.md` | 8px | Cards, modals |
| `radius.lg` | 12px | Large cards |
| `radius.xl` | 16px | Hero cards |
| `radius.2xl` | 24px | Special |
| `radius.full` | 9999px | Avatars, pills |

## 21.5 Shadow Tokens

| Token | Value | Purpose |
|-------|-------|---------|
| `shadow.none` | none | Flat |
| `shadow.subtle` | `0 1px 2px rgba(0,0,0,0.04)` | Subtle depth |
| `shadow.small` | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)` | Cards |
| `shadow.medium` | `0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)` | Hover |
| `shadow.large` | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)` | Modals |
| `shadow.floating` | `0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.04)` | Toasts |

## 21.6 Motion Tokens

| Token | Value | Purpose |
|-------|-------|---------|
| `duration.instant` | 0ms | No animation |
| `duration.fast` | 150ms | Micro-interactions |
| `duration.normal` | 200ms | Component transitions |
| `duration.slow` | 300ms | Major transitions |
| `duration.slower` | 500ms | Page transitions |
| `ease.default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default |
| `ease.in` | `cubic-bezier(0.4, 0, 1, 1)` | Exiting |
| `ease.out` | `cubic-bezier(0, 0, 0.2, 1)` | Entering |
| `ease.spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful |

## 21.7 Layout Tokens

| Token | Value | Purpose |
|-------|-------|---------|
| `layout.container.sm` | 640px | Small container |
| `layout.container.md` | 768px | Medium container |
| `layout.container.lg` | 1024px | Large container |
| `layout.container.xl` | 1200px | Extra large |
| `layout.container.2xl` | 1400px | Max width |
| `layout.header.height` | 64px | Header height |
| `layout.header.height.mobile` | 56px | Mobile header |
| `layout.sidebar.width` | 260px | Sidebar width |
| `layout.page.padding` | 32px | Page padding |
| `layout.page.padding.mobile` | 16px | Mobile padding |
| `layout.section.gap` | 64px | Section spacing |
| `layout.grid.gutter` | 24px | Grid gutter |

---

# 22. Figma Structure

```
📁 01 — Cover
   └── Cover page with brand name, version, date

📁 02 — Foundations
   └── Design principles, glossary, changelog

📁 03 — Colors
   ├── Light Mode Palette
   ├── Dark Mode Palette
   ├── Semantic Colors
   └── Usage Guidelines

📁 04 — Typography
   ├── Font Families
   ├── Type Scale
   ├── Line Heights
   └── Text Styles

📁 05 — Spacing
   ├── Spacing Scale
   └── Component Spacing

📁 06 — Grid
   ├── Breakpoints
   ├── Grid System
   └── Responsive Behavior

📁 07 — Icons
   ├── Icon Library (24x24)
   ├── Icon Sizes
   └── Usage Rules

📁 08 — Components
   ├── Foundation
   │   ├── Button
   │   ├── Input
   │   ├── Select
   │   ├── Checkbox
   │   ├── Radio
   │   ├── Switch
   │   ├── Badge
   │   ├── Avatar
   │   ├── Tooltip
   │   └── Divider
   ├── Feedback
   │   ├── Alert
   │   ├── Toast
   │   ├── Progress
   │   ├── Spinner
   │   ├── Skeleton
   │   ├── Empty State
   │   └── Error State
   ├── Surface
   │   ├── Card
   │   ├── Modal
   │   ├── Drawer
   │   ├── Popover
   │   └── Dropdown
   ├── Navigation
   │   ├── Header
   │   ├── Sidebar
   │   ├── Tabs
   │   ├── Breadcrumb
   │   └── Pagination
   └── Data Display
       ├── Table
       ├── List
       ├── Statistic Card
       ├── Rating
       └── Timeline

📁 09 — Patterns
   ├── Search & Filter
   ├── Booking Flow
   ├── Review Flow
   ├── Auth Flow
   └── Form Patterns

📁 10 — Student Screens
   ├── Student Dashboard
   ├── Tutor Search
   ├── Tutor Profile
   ├── Booking Calendar
   ├── Booking Confirmation
   ├── My Bookings
   ├── My Progress
   └── Settings

📁 11 — Tutor Screens
   ├── Tutor Dashboard
   ├── Tutor Profile Edit
   ├── Schedule Management
   ├── Booking Requests
   ├── Student List
   ├── Earnings
   └── Settings

📁 12 — Responsive
   ├── Mobile (320-639px)
   ├── Tablet (640-1023px)
   └── Desktop (1024px+)

📁 13 — Prototype
   ├── User Flows
   ├── Interactions
   └── Micro-interactions
```

---

# 23. Implementation Checklist

## Cho Frontend Developer / AI Coding Agent

- [ ] Cài đặt font: Plus Jakarta Sans, Inter, JetBrains Mono
- [ ] Cấu hình Tailwind với toàn bộ design tokens ở trên
- [ ] Thiết lập dark mode (`class` strategy)
- [ ] Tạo CSS variables hoặc extend Tailwind theme
- [ ] Implement base components (Button, Input, Card, Modal)
- [ ] Implement feedback components (Toast, Alert, Skeleton)
- [ ] Implement navigation (Header, Sidebar, Tabs)
- [ ] Implement data display (Table, Rating, Timeline)
- [ ] Implement Tutor Card và Tutor Profile
- [ ] Implement Student Dashboard và Tutor Dashboard
- [ ] Implement Booking Flow (Search → Profile → Schedule → Confirm)
- [ ] Implement Review & Rating system
- [ ] Implement Auth screens (Login, Register, Forgot Password)
- [ ] Thêm animation theo Motion System
- [ ] Kiểm tra responsive trên tất cả breakpoints
- [ ] Kiểm tra accessibility (keyboard, screen reader, contrast)
- [ ] Thêm `prefers-reduced-motion` support
- [ ] Kiểm tra touch targets trên mobile

---

# 24. Tóm tắt Quyết định Thiết kế Chính

| Quyết định | Lý do |
|------------|-------|
| **Indigo + Teal palette** | Tin cậy + giáo dục, phân biệt rõ semantic colors |
| **Plus Jakarta Sans + Inter** | Hiện đại, hỗ trợ Vietnamese tốt, đọc dễ |
| **4px spacing grid** | Consistency, dễ implement với Tailwind |
| **6px radius cho buttons/inputs** | Modern nhưng không quá rounded (không trẻ con) |
| **8px radius cho cards** | Distinct, friendly, consistent |
| **150-300ms animations** | Nhanh, mượt, không gây khó chịu |
| **Spring easing cho tabs/buttons** | Cảm giác "premium", responsive |
| **Bento grid cho dashboard stats** | Hiện đại, tận dụng không gian, không lạm dụng |
| **Card-based mobile tables** | UX mobile tốt hơn horizontal scroll |
| **Bottom sheet modals trên mobile** | Dễ reach bằng thumb, pattern quen thuộc |
| **Dark mode không đảo màu máy móc** | Giảm mỏi mắt, giữ chiều sâu UI |
| **WCAG AA compliance** | Accessible by default, mở rộng audience |

---

*Document Version: 1.0*
*Last Updated: 2026-08-10*
*For: React + TypeScript + Tailwind CSS Implementation*
