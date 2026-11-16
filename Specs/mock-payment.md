# Feature: Mock payment (classroom provider)

## 1. User goal
As a pet owner, I want to simulate paying for a service so I can see how a
payment outcome maps to a booking status.

## 2. Scope
POST /payments/mock/:serviceId simulates a payment against the same mock
catalogue as prepare-payment.md (data/mockServices.js).
No real money, no gateway integration, no database writes.

## 3. Request
POST /payments/mock/:serviceId
Optional JSON body field: testStatus.
Allowed values: APPROVED, PENDING, DECLINED (exact uppercase).
Omitted -> treated as PENDING.
The client cannot supply an amount. Price comes from the server catalogue.

## 4. Status mapping
APPROVED -> CONFIRMED
PENDING -> AWAITING_PAYMENT
DECLINED -> PAYMENT_FAILED

## 5. Successful response
HTTP 200 with exactly five JSON fields:
serviceId (number), providerPaymentId (string), merchantReference (string),
paymentStatus (string), bookingStatus (string).

## 6. Unsuccessful responses
Unknown service: HTTP 404 with {"error":"Service not found"}.
Invalid testStatus: HTTP 400 with
{"error":"Invalid testStatus. Use APPROVED, PENDING or DECLINED."}.
The provider is not called when validation fails.

## 7. Access
No login required for now, matching prepare-payment.md: both payment
routes are classroom mocks over a static catalogue with no personal data
and no database writes. The missing login check is a recorded known gap;
the decision is deferred until the L09/L10 materials are released. If
login is added later, that is its own spec update and its own commit.

## 8. Acceptance criteria
AC1: POST /payments/mock/1 with testStatus APPROVED -> 200,
     paymentStatus APPROVED, bookingStatus CONFIRMED.
AC2: testStatus PENDING, or omitted -> 200, bookingStatus AWAITING_PAYMENT.
AC3: testStatus DECLINED -> 200, bookingStatus PAYMENT_FAILED.
AC4: any other testStatus (for example BANANA or lowercase approved)
     -> 400 with the invalid-testStatus error; provider not called.
AC5: unknown service /999 -> 404 with the exact error object above.

## 9. Open questions
1. Lowercase testStatus values: normalise to uppercase or reject?
   Current decision: reject, to keep validation strict and simple.
2. Non-integer service ID: both endpoints return 404 today. The 400 rule
   in earlier spec drafts was an L05 slide example marked CLARIFY, never
   agreed, so it is not a requirement here either. Needs agreement before
   any code change (see prepare-payment.md open questions).
3. Login on payment routes: deferred to L09/L10 (see section 7).
