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

## Key JavaScript functions

| Function | Requirement it meets |
|----------|---------------------|
| `filterAndSortFeedback()` | Search, filtering and sorting |
| `calculateSummary()` | Calculation and status summarisation (average rating, counts) |
| `addFeedback()` | User action: submitting feedback |
| `updateStatus()` | User action: updating an item |
| `containsPersonalInfo()` | Privacy check used by form validation |

## Limitations

- No database, login or server. Feedback you submit is saved only in your own browser (localStorage), so other users cannot see it.
- The staff view is a demonstration toggle, not real authentication.
- Personal-information detection is basic and cannot catch every case.

## Team members and responsibilities

| Member | Responsibility |
|--------|----------------|
| Auma Joy Desire Cephas | HTML structure and accessibility, Deployment |
| Anguzu Jonathan | CSS, responsive layout |
| Yikii Aron | JavaScript search, filter, sort |
| Adroni Sam | JavaScript form validation and summary calculations |
| All the group members | Testing and README  |

## Contribution statements

## Auma Joy Desire Cephas.
I created a GitHub account for the project.
I prompted and reviewed the HTML structure accessibility features, tested keyboard navigation, validated and fixed errors were necessary and contributed to the report.
I committed our project to GitHub on behalf of my group members
I did the deployment

## Anguzu Jonathan
I prompted and reviewed the CSS responsive layout, tested it on mobile, tablet and desktop and confirmed the layout works. I validated and fixed the errors.

## Yikii Aaron
I prompted and reviewed the JavaScript form validation, privacy checks and summary calculations, and tested them and validated my codes to make sure there are no errors.

## Adroni Sam
I prompted and reviewed the JavaScript form validation, privacy checks and summary calculations and tested them
The Readme and testing were done jointly. Since only one person had a laptop, each member made their contribution but the commitment to GitHub was done by the Anchor.

## AI Use Acknowledgement

Meta AI was used to:
 Generate the initial code for index.html, style.css and script.js
 Explain concepts such as deployment, Git/GitHub, testing, and accessibility
 Help debug errors and suggest fixes

## The team members were responsible for:
 Giving the prompts and requirements to the AI
 Reviewing, testing and verifying the generated code
 Running the application on mobile, tablet and desktop
 Taking testing screenshots


