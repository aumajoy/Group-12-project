# Anonymous Feedback and Issue Dashboard

**Course:** ITM 1131 Web Application Development, Muni University
**Project:** Group 12, Two-Week University Utility Web Applications
**Type:** Responsive front-end web application (HTML, CSS, JavaScript)

## Problem

Students and staff often hold back honest feedback about teaching, facilities, ICT or welfare because they fear being identified. Quality-assurance teams also lack one simple place to see what is open and what has been resolved.

## Intended users

Students, lecturers, administrative and library staff, quality-assurance teams and university management.

## Features

- Anonymised sample feedback shown as cards, grouped by **category**, **audience** and **status**.
- **Search and filter** by keyword, category, audience and status, plus sorting by date or rating. No personal information is shown.
- **Anonymous feedback form** with category, message and optional rating, with validation and visible error and success messages.
- The form **blocks emails, phone numbers and registration numbers** to protect anonymity.
- **Summary dashboard:** total feedback, average rating, and counts of open, under-review and resolved issues, plus a per-category table.
- **Staff view** toggle lets staff change an item's status (Open, Under review, Resolved).
- Empty, success and error states.
- Responsive for mobile, tablet and desktop using Flexbox and CSS Grid.
- Accessible: semantic HTML, labels, skip link, keyboard-friendly controls, focus styles, ARIA live regions.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure (three sections: Overview, Feedback board, Submit feedback) |
| `style.css` | Styles, global `box-sizing: border-box`, Flexbox/Grid layouts, media queries |
| `script.js` | Sample data, search/filter, calculations, form validation, status updates |

## Key JavaScript functions

| Function | Requirement it meets |
|----------|---------------------|
| `filterAndSortFeedback()` | Search, filtering and sorting |
| `calculateSummary()` | Calculation and status summarisation (average rating, counts) |
| `addFeedback()` | User action: submitting feedback |
| `updateStatus()` | User action: updating an item |
| `containsPersonalInfo()` | Privacy check used by form validation |

## How to run
Just open index.html, no server needed. full steps for GitHub pages included.

## Limitations

- No database, login or server. Feedback you submit is saved only in your own browser (localStorage), so other users cannot see it.
- The staff view is a demonstration toggle, not real authentication.
- Personal-information detection is basic and cannot catch every case.

## Testing evidence

Add screenshots here for the three required screen sizes:

- Mobile (about 375px wide)
- Tablet (about 768px wide)
- Desktop (1200px or wider)

Also record checks for: search, each filter, sorting, valid submission, invalid submission (empty fields, short message, email in message), status update, and keyboard-only navigation.

## Team members and responsibilities

| Member | Responsibility |
|--------|----------------|
| Member 1 (name) | HTML structure and accessibility |
| Member 2 (name) | CSS, responsive layout |
| Member 3 (name) | JavaScript search, filter, sort |
| Member 4 (name) | JavaScript form validation and summary calculations |
| Member 5 (name) | Testing, README, deployment |

## Contribution statements

Each member adds a short statement of what they personally did.
