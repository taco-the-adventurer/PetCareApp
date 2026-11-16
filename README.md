# PetCareApp — C372 Payment Technologies CA1

Express + EJS + MySQL (MVC) pet-care app: pet journals, service booking with
pending payments saved in one transaction, admin dashboards, and classroom
mock-payment endpoints. Built lesson by lesson; see the lesson map below.

## Run it from a clean clone

Prerequisites: Node.js 18+ and MySQL 8 running locally.

1. `npm install`
2. Load the database — **order matters**, and `db.sql` drops and recreates
   the core tables, so never run it on a database you want to keep:
   1. `db.sql` (users, pets, journal + sample data)
   2. `db-lesson08-extension.sql` (services, service_bookings, payments + sample services)
3. Copy `config/db.example.js` to `config/db.js` and fill in your own MySQL
   username and password. `config/db.js` is gitignored and must never be committed.
4. Optional: set a session secret (otherwise a development fallback is used):
   - PowerShell: `$env:SESSION_SECRET = "your-secret"`
   - cmd: `set SESSION_SECRET=your-secret`
5. `node app.js` and open http://localhost:3000

## Test accounts (seeded by db.sql)

| Username | Password | Role |
| --- | --- | --- |
| admin1 | admin123 | admin |
| amy | user123 | customer |
| ben | user123 | customer |
| clara | user123 | customer |

## Lesson-to-commit map

| Lesson | Work | Commit(s) |
| --- | --- | --- |
| L1–2 (Wk 1) | Tool setup; traced the original single-file app | pre-repo, no commit |
| L3 (Wk 2) | MVC refactor: routes/controllers/models/middleware | `9f4e9e2` (archive-pre-ca1 branch) → `a17e067` |
| L5 (Wk 3) | `GET /payments/prepare/:serviceId` (spec-driven) | inside `a17e067`; refined in `1ec4bfc` |
| L6 (Wk 3) | `POST /payments/mock/:serviceId` + mock provider | inside `a17e067`; refined in `1ec4bfc` |
| L8 (Wk 4) | Service booking: schema, models, controller, views | `4c25dc3`, `8cef535`, `2560f07`, `c224000`, `df93856` |
| Wk 4 extras | Admin bookings dashboard, spending summary, partials, 404 | `90c8216` |
| Wk 5 | Spec recovery, mock-payment spec, testStatus validation, session secret hardening | `7acd87a`, `36ff7ef`, `e81c528`, `e83af6a` |

Honest cadence note: lessons 1–6 were committed as a single snapshot on
5 Nov (`a17e067`) after the work was done; Lesson 8 onwards has individual
commits with real dates.

## Specifications

Behaviour is spec-first; see `Specs/`:

- `prepare-payment.md` — L05 prepare-payment endpoint
- `mock-payment.md` — L06 mock-payment endpoint incl. the testStatus whitelist
- `service-booking.md` + `service-booking-implementation.md` — L08 booking feature
