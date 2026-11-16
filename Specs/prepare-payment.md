# Feature: Prepare payment details

## 1. User goal
As a pet owner, i want to make payment for a pet service
## 2. Scope
Review selected service and amount before payment
Catalogue (ID, name, numeric price):
1, Vaccination, 35
2, Pet Grooming, 50
3, Boarding, 80
Use the server catalogue price. Do not accept a client-supplied payment amount.
## 3. Request
GET /payments/prepare/:serviceId
## 4. Service catalogue
id, service name, price
1, Vaccination, 35
2, Pet Grooming, 50
3, Boarding, 80
## 5. Successful response
HTTP 200 with exactly five JSON fields:
serviceId (number), serviceName (string), amount (number), currency (string, “sgd”), status (string, “READY_FOR_PAYMENT”).
## 6. Unsuccessful response
Unknown service: HTTP 404 with {"error":"Service not found"}.
Non-integer service ID: currently also HTTP 404 (falls through to
"Service not found"). See open questions.
## 7. Acceptance criteria
AC1: /1 -> 200; Vaccination; amount 35; serviceId 1.
AC2: /2 -> 200; Pet Grooming; amount 50; serviceId 2.
AC3: /3 -> 200; Boarding; amount 80; serviceId 3.
AC4: /999 -> 404; the exact error object above.
AC5: Each success has exactly the five agreed fields, correct types, catalogue values, “sgd” and “READY_FOR_PAYMENT”.
AC6: removed (was an unagreed 400-for-malformed-ID rule; see open questions).
Access: No login required for this classroom mock.
Out of scope: charging money, gateway integration, transactions, new database tables, E0S pages or changes to existing features.
## 8. Open questions
Malformed (non-integer) service ID handling: "return 400 with
{"error":"Invalid service ID"}" came from an L05 slide example AI
suggestion marked CLARIFY and was copied into this spec without being
agreed, so it is not a requirement. The code returns 404 today. A new
validation rule needs agreement first; decide with the lecturer
(L09/L10 may cover it).
