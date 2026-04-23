# Invoice Management App

A professional, full-featured invoice management application built with React 19, Vite, and Tailwind CSS 4. This application allows users to create, view, edit, and manage invoices with a focus on premium UI/UX and accessibility.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/BenedictUmeozor/hng14-stage2-task
   cd hng14-stage2-task
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🏗️ Architecture

The project follows a modular and scalable architecture:

### 1. State Management
- **React Context API**: Used for global invoice state and filtering logic (`InvoiceProvider`).
- **Custom Hooks**: Business logic is encapsulated in hooks like `useInvoices`, which handles CRUD operations and data persistence.

### 2. Form Handling & Validation
- **React Hook Form**: Manages complex form states for creating and editing invoices.
- **Zod**: Provides schema-based validation, ensuring data integrity and providing clear error messages to users.

### 3. Styling & Design System
- **Tailwind CSS 4**: Utilizes the latest Tailwind features including CSS-variable-based themes and custom utilities.
- **Design Tokens**: Centralized theme configuration in `index.css` for consistent colors, typography (League Spartan), and spacing.
- **Dark Mode**: Native support for dark/light themes with a custom toggle component.

### 4. Layout & Routing
- **React Router 7**: Handles client-side navigation with scroll restoration and nested layouts.
- **App Shell**: A persistent `Sidebar` component that adjusts its position (top for mobile/tablet, left for desktop) to optimize screen real estate.

### 5. Responsive Design
- **Conditional Rendering**: Uses `react-responsive` hooks for complex layout shifts that CSS alone cannot handle efficiently.
- **Adaptive Layouts**: The application dynamically switches between grid and flex layouts based on screen size (Mobile < 768px, Tablet < 1024px, Desktop >= 1024px).

### 6. Components
- **Radix UI**: Leverages accessible primitives (like `Select`) for complex UI interactions.
- **Reusable UI Components**: Custom-built `Button`, `Input`, `DatePicker`, and `Modal` components designed for high reusability.

---

## ⚖️ Trade-offs

During development, several architectural decisions were made:

- **LocalStorage vs. Backend**: For the current scope, LocalStorage was chosen for persistence. 
  - *Pro*: Immediate "offline-first" experience and no backend setup required for reviewers.
  - *Con*: Data is limited to a single browser and storage capacity.
- **React Context vs. Redux/Zustand**: Given the application's size, React Context provides sufficient state management without the boilerplate of larger libraries.
- **Tailwind CSS 4**: Chose the latest version to leverage modern CSS features, though it requires a compatible environment (Vite/PostCSS).

---

## ♿ Accessibility

Accessibility was a core focus of the development process:

- **Semantic HTML**: Proper use of `<main>`, `<section>`, `<nav>`, and heading hierarchies.
- **ARIA Attributes**: Integrated ARIA labels and roles, especially in custom interactive elements.
- **Keyboard Navigation**: Full support for keyboard users, including focus trapping in modals and tab navigation.
- **Radix UI Primitives**: Complex components like Select menus use Radix UI to ensure they meet WAI-ARIA standards.
- **Screen Reader Support**: Included `.sr-only` utility classes to provide context to assistive technologies without affecting the visual design.
- **Contrast & Visibility**: Color palettes were chosen to ensure high contrast in both light and dark modes.

---

## 🛠️ Tech Stack
- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Icons**: Custom SVG icons
