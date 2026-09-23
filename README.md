# Product Admin Dashboard

A full-featured admin dashboard built with **Next.js 14**, **Tailwind CSS**, and **Axios** — backed by the [DummyJSON](https://dummyjson.com) API.

## Live Demo

> _Add Vercel/Netlify link here after deployment_

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| HTTP | Axios (shared interceptor instance) |
| State | React hooks only — no external state lib |
| Auth | JWT stored in localStorage + cookie (for middleware) |

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/Anwesha0425/product-admin-dashboard.git
cd product-admin-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Login credentials:**
- Username: `emilys`
- Password: `emilyspass`

---

## Features

- [x] Login with JWT, protected routes via Next.js middleware
- [x] Product list — table on desktop, cards on mobile
- [x] Pagination with page numbers, Prev/Next, page-size selector (10/20/50) and "Showing X–Y of Z"
- [x] Debounced search (400 ms) with race-condition protection via AbortController
- [x] Filter by category, sort by price / rating / title, toggle asc/desc
- [x] All filter/sort/page state stored in the URL
- [x] Product detail page `/products/[id]` with image gallery and reviews
- [x] 404 page for unknown product IDs or bad URL values
- [x] Add / Edit product form with validation
- [x] Delete with confirmation dialog
- [x] Optimistic CRUD (local state overrides API data)
- [x] Loading spinner, empty state, error state with Retry button
- [x] Double-submit guard on Login and Save buttons
- [x] Logout button

---

## Design Decisions

### Search vs Category Filter
The DummyJSON API cannot simultaneously search by keyword and filter by category. When a category is selected, the search field is disabled (and vice versa). A tooltip in the toolbar explains this constraint to the user.

### CRUD Persistence
DummyJSON does not persist writes. After a successful API call (add/edit/delete), the change is stored in a React state `overrides` map keyed by product ID. The list view merges this map on top of API data before rendering. A banner at the top of the page informs the user that changes reset on refresh.

### Race Conditions
Each data fetch creates an `AbortController`. When a new fetch fires (e.g. the user types fast), the previous controller is aborted. Additionally, a monotonically increasing `fetchId` ref ensures that even if an aborted request somehow resolves, its result is silently dropped.

---

## One Problem I Faced

**Challenge:** The `/products/[id]` page path contains square brackets which PowerShell treats as wildcard characters, making it impossible to write the file using standard `Set-Content`. Writing to `D:\app\products\[id]\page.tsx` kept failing with "path did not resolve to a file."

**Fix:** Used `[System.IO.File]::WriteAllText(...)` from .NET directly, which treats the path as a literal string and bypasses PowerShell's wildcard expansion.

---

## Where AI Helped

AI helped scaffold the initial folder structure and boilerplate (layout, types, API layer). All logic decisions — the AbortController race-condition fix, the search/category conflict approach, the optimistic override pattern, the cookie + localStorage dual-storage for middleware auth — were designed and understood manually. Every line was reviewed and the reasoning behind it is explainable.