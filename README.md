# Invoice App — HNG Stage 2

A simple invoice management app for creating, tracking, and managing invoice payments.

---

## Setup Instructions

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open in your browser:
http://localhost:3000

Other commands:

```bash
npm run build   # production build
npm run start   # run production build
npm run lint    # check code quality
```

---

## Architecture

The app follows a simple client-side structure.

```
src/
├─ app/                 # pages and routing
├─ components/          # reusable UI components
├─ lib/
│  ├─ store.ts          # global state (invoices)
│  ├─ invoices.ts       # mock data and helpers
│  ├─ invoice-schema.ts # form validation rules
│  └─ utils.ts          # helper functions
```

### State Management

- All invoice data lives in a single global store  
- Data persists in the browser using localStorage  

Available actions:
- Add invoice  
- Update invoice  
- Delete invoice  
- Mark invoice as paid  

### Data Flow

- Form → validation → store update  
- Store update → UI re-renders  
- Changes persist automatically  

### Routing

- `/` → list of invoices  
- `/invoices/[id]` → invoice details and actions  

---

## Trade-offs

- No backend  
  - Faster to build  
  - Not suitable for real-world usage  

- Client-side state only  
  - Simple structure  
  - No multi-device support  

- LocalStorage persistence  
  - Data survives refresh  
  - No external backup  

- Client-rendered pages  
  - Easier state handling  
  - Reduced server-side performance benefits  

---

## Accessibility Notes

- All inputs are paired with labels  
- Validation errors are clearly displayed  
- Inputs use `aria-invalid` for error states  
- Buttons include descriptive labels where needed  
- Keyboard navigation works across forms and dialogs  
- Status is shown with both color and text  
- Theme preference persists for user comfort  

Known issue:
- Some light mode text contrast is slightly below WCAG recommendations  

---

## Improvements Beyond Requirements

- Add backend for persistent data storage  
- Add authentication for user-specific data  
- Sync filters with URL for shareable views  
- Improve UI animations for better feedback  
- Expand validation for draft handling  
- Add export feature (PDF or download)  

---

## Summary

This project focuses on:

- Clean UI  
- Simple state management  
- Core CRUD functionality  

Built as a frontend-focused solution for learning and demonstration.