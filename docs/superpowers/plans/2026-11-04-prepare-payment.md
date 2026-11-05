# Prepare Payment Details — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `GET /payments/prepare/:serviceId` that returns service details as JSON before payment.

**Architecture:** One new route file and one new controller file, registered in `app.js`. The service catalogue is a hardcoded in-memory object in the controller — no model, no database, no new tables.

**Tech Stack:** Node.js, Express 5, no additional packages required.

## Global Constraints

- No login/auth middleware on this endpoint (spec: "No login required for this classroom mock")
- Do not accept a client-supplied payment amount — price comes from the server catalogue only
- Response currency is always lowercase `"sgd"`
- Response status is always `"READY FOR PAYMENT"` (space, not underscore)
- `serviceId` in the response body is a **number**, not a string
- Out of scope: charging money, gateway integration, transactions, new database tables, EJS pages, changes to existing features

---

### Task 1: Payment controller

**Files:**
- Create: `controllers/paymentController.js`

**Interfaces:**
- Produces: `preparePayment(req, res)` — Express route handler

- [ ] **Step 1: Create `controllers/paymentController.js` with the catalogue and handler**

```js
const CATALOGUE = {
  1: { serviceName: 'Vaccination', amount: 35 },
  2: { serviceName: 'Pet Grooming', amount: 50 },
  3: { serviceName: 'Boarding', amount: 80 }
};

function preparePayment(req, res) {
  const raw = req.params.serviceId;

  if (!/^\d+$/.test(raw)) {
    return res.status(400).json({ error: 'Invalid service ID' });
  }

  const id = parseInt(raw, 10);
  const service = CATALOGUE[id];

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.status(200).json({
    serviceId: id,
    serviceName: service.serviceName,
    amount: service.amount,
    currency: 'sgd',
    status: 'READY FOR PAYMENT'
  });
}

module.exports = { preparePayment };
```

- [ ] **Step 2: Manually verify the logic by reading it against the spec**

Check each rule in `specs/prepare-payment.md`:
- `/^\d+$/` rejects `"abc"`, `"1.5"`, `""`, `"-1"` → 400 ✓
- `CATALOGUE[999]` is `undefined` → 404 ✓
- Successful response has exactly five fields: `serviceId` (number), `serviceName` (string), `amount` (number), `currency: "sgd"`, `status: "READY FOR PAYMENT"` ✓
- `id` is `parseInt` result, so it is a number not a string ✓

---

### Task 2: Payment route

**Files:**
- Create: `routes/paymentRoutes.js`

**Interfaces:**
- Consumes: `paymentController.preparePayment` from Task 1
- Produces: Express router mounting `GET /payments/prepare/:serviceId`

- [ ] **Step 1: Create `routes/paymentRoutes.js`**

```js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/payments/prepare/:serviceId', paymentController.preparePayment);

module.exports = router;
```

No auth middleware — the spec explicitly requires no login for this endpoint.

---

### Task 3: Register route in app.js and smoke-test

**Files:**
- Modify: `app.js` (add one `app.use` line with the other routes)

**Interfaces:**
- Consumes: `routes/paymentRoutes.js` from Task 2

- [ ] **Step 1: Add the payment route in `app.js`**

Open `app.js`. Find the routes block (lines 22–26). Add the new line so it reads:

```js
// Routes
app.use(require('./routes/indexRoutes'));
app.use(require('./routes/authRoutes'));
app.use(require('./routes/adminRoutes'));
app.use(require('./routes/petRoutes'));
app.use(require('./routes/journalRoutes'));
app.use(require('./routes/paymentRoutes'));
```

- [ ] **Step 2: Start the server**

```
node app.js
```

Expected output: `App running on http://localhost:3000`

If you see a syntax error, check `paymentController.js` and `paymentRoutes.js` for missing semicolons or unclosed braces.

- [ ] **Step 3: AC1 — service 1 (Vaccination)**

```
curl http://localhost:3000/payments/prepare/1
```

Expected HTTP 200 and body:
```json
{"serviceId":1,"serviceName":"Vaccination","amount":35,"currency":"sgd","status":"READY FOR PAYMENT"}
```

- [ ] **Step 4: AC2 — service 2 (Pet Grooming)**

```
curl http://localhost:3000/payments/prepare/2
```

Expected HTTP 200 and body:
```json
{"serviceId":2,"serviceName":"Pet Grooming","amount":50,"currency":"sgd","status":"READY FOR PAYMENT"}
```

- [ ] **Step 5: AC3 — service 3 (Boarding)**

```
curl http://localhost:3000/payments/prepare/3
```

Expected HTTP 200 and body:
```json
{"serviceId":3,"serviceName":"Boarding","amount":80,"currency":"sgd","status":"READY FOR PAYMENT"}
```

- [ ] **Step 6: AC4 — unknown service ID**

```
curl -i http://localhost:3000/payments/prepare/999
```

Expected HTTP 404 and body:
```json
{"error":"Service not found"}
```

(`-i` prints the status line so you can confirm the 404.)

- [ ] **Step 7: AC6 — non-integer service ID**

```
curl -i http://localhost:3000/payments/prepare/abc
```

Expected HTTP 400 and body:
```json
{"error":"Invalid service ID"}
```

- [ ] **Step 8: AC5 — verify field types on a success response**

Look at the AC1 output. Confirm:
- `serviceId` is a JSON number (no quotes around `1`)
- `serviceName` is a string
- `amount` is a JSON number (no quotes around `35`)
- `currency` is exactly `"sgd"` (lowercase)
- `status` is exactly `"READY FOR PAYMENT"` (space, not underscore)
- There are exactly five fields (count them)
