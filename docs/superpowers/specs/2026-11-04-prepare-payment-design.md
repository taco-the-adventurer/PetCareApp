# Design: Prepare Payment Details

**Spec:** `specs/prepare-payment.md`
**Date:** 2026-11-04

## What we're building

A single JSON endpoint `GET /payments/prepare/:serviceId` that returns service details before payment. No charging, no gateway, no login required.

## Architecture

Follows the existing MVC pattern: one route file, one controller file, registered in `app.js`. No model file — the catalogue is 3 hardcoded rows, and the spec rules out a new database table.

## Components

**`controllers/paymentController.js`**
- Inline catalogue object: `{ 1: { serviceName, amount }, 2: ..., 3: ... }`
- `preparePayment(req, res)`:
  - Parse `:serviceId`; if not an integer → 400 `{"error":"Invalid service ID"}`
  - Look up in catalogue; if missing → 404 `{"error":"Service not found"}`
  - Return 200 JSON with exactly: `serviceId`, `serviceName`, `amount`, `currency: "sgd"`, `status: "READY FOR PAYMENT"`

**`routes/paymentRoutes.js`**
- `GET /payments/prepare/:serviceId` → `paymentController.preparePayment`
- No auth middleware (spec: no login required)

**`app.js`**
- `app.use(require('./routes/paymentRoutes'))` added with other routes

## Error responses

| Condition | Status | Body |
|---|---|---|
| Non-integer `:serviceId` | 400 | `{"error":"Invalid service ID"}` |
| Integer but not in catalogue | 404 | `{"error":"Service not found"}` |
