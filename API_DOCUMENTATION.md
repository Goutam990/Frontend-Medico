# API Documentation for Patient Management & Booking Portal

This document outlines all the backend API endpoints required for the Patient Management & Booking Portal. You need to implement these endpoints in your ASP.NET Core Web API backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Register Patient
**POST** `/auth/register`

**Content-Type:** `multipart/form-data`

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "dob": "string (YYYY-MM-DD)",
  "address": "string (optional)",
  "gender": "string (optional)",
  "profilePic": "file (optional)"
}
```

**Response (201 Created):**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "dob": "string",
    "address": "string",
    "gender": "string",
    "profilePic": "string (URL)",
    "role": "Patient",
    "isBlocked": false,
    "createdAt": "string (ISO 8601)"
  }
}
```

---

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "dob": "string",
    "address": "string",
    "gender": "string",
    "profilePic": "string",
    "role": "Doctor | Patient",
    "isBlocked": false,
    "createdAt": "string"
  }
}
```

**Error Responses:**
- 400: Invalid credentials
- 403: Account is blocked

---

### 3. Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dob": "string",
  "address": "string",
  "gender": "string",
  "profilePic": "string",
  "role": "Doctor | Patient",
  "isBlocked": false,
  "createdAt": "string"
}
```

---

### 4. Logout
**POST** `/auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Patient Management Endpoints (Doctor Only)

### 5. Get All Patients
**GET** `/patients`

**Headers:** `Authorization: Bearer <token>` (Doctor role required)

**Query Parameters:**
- `page` (optional, default: 1)
- `pageSize` (optional, default: 10)
- `search` (optional, string)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "dob": "string",
      "address": "string",
      "gender": "string",
      "profilePic": "string",
      "role": "Patient",
      "isBlocked": false,
      "createdAt": "string"
    }
  ],
  "total": 100
}
```

---

### 6. Get Patient by ID
**GET** `/patients/{id}`

**Headers:** `Authorization: Bearer <token>` (Doctor role required)

**Response (200 OK):**
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dob": "string",
  "address": "string",
  "gender": "string",
  "profilePic": "string",
  "role": "Patient",
  "isBlocked": false,
  "createdAt": "string"
}
```

---

### 7. Update Patient Profile
**PUT** `/patients/{id}`

**Headers:** `Authorization: Bearer <token>` (Patient can only update own profile, Doctor can update any)

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "address": "string",
  "gender": "string"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dob": "string",
  "address": "string",
  "gender": "string",
  "profilePic": "string",
  "role": "Patient",
  "isBlocked": false,
  "createdAt": "string"
}
```

---

### 8. Block/Unblock Patient
**PATCH** `/patients/{id}/block`

**Headers:** `Authorization: Bearer <token>` (Doctor role required)

**Response (200 OK):**
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isBlocked": true,
  "message": "Patient blocked successfully"
}
```

**Note:** This endpoint toggles the `isBlocked` status. Blocked patients cannot log in or create bookings.

---

### 9. Get Patients with Bookings
**GET** `/patients/with-bookings`

**Headers:** `Authorization: Bearer <token>` (Doctor role required)

**Response (200 OK):**
```json
[
  {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "bookingCount": 5
  }
]
```

---

## Booking Management Endpoints

### 10. Create Booking
**POST** `/bookings`

**Headers:** `Authorization: Bearer <token>` (Patient role required)

**Content-Type:** `multipart/form-data`

**Request Body:**
```json
{
  "date": "string (YYYY-MM-DD)",
  "timeSlot": "string (HH:MM)",
  "notes": "string (optional)",
  "file": "file (optional)"
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "patientId": "string",
  "patientName": "string",
  "doctorId": "string",
  "date": "string",
  "timeSlot": "string",
  "status": "Booked",
  "notes": "string",
  "paymentStatus": "Pending",
  "fileUrl": "string",
  "createdAt": "string"
}
```

**Validation:**
- Check if the time slot is available (not already booked)
- Check if the time slot is within doctor's working hours
- Check if patient is not blocked

---

### 11. Get All Bookings
**GET** `/bookings`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status (Booked, Approved, Rejected, Complete, Cancelled)
- `patientId` (optional): Filter by patient ID
- `date` (optional): Filter by date (YYYY-MM-DD)
- `page` (optional, default: 1)
- `pageSize` (optional, default: 10)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "patientId": "string",
      "patientName": "string",
      "doctorId": "string",
      "date": "string",
      "timeSlot": "string",
      "status": "Booked | Approved | Rejected | Complete | Cancelled",
      "notes": "string",
      "rejectionReason": "string",
      "paymentStatus": "Pending | Paid | Refunded",
      "fileUrl": "string",
      "createdAt": "string"
    }
  ],
  "total": 50
}
```

---

### 12. Get Booking by ID
**GET** `/bookings/{id}`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "id": "string",
  "patientId": "string",
  "patientName": "string",
  "doctorId": "string",
  "date": "string",
  "timeSlot": "string",
  "status": "string",
  "notes": "string",
  "rejectionReason": "string",
  "paymentStatus": "string",
  "fileUrl": "string",
  "createdAt": "string"
}
```

---

### 13. Get My Bookings
**GET** `/bookings/my-bookings`

**Headers:** `Authorization: Bearer <token>` (Patient role required)

**Response (200 OK):**
```json
[
  {
    "id": "string",
    "patientId": "string",
    "patientName": "string",
    "doctorId": "string",
    "date": "string",
    "timeSlot": "string",
    "status": "string",
    "notes": "string",
    "rejectionReason": "string",
    "paymentStatus": "string",
    "fileUrl": "string",
    "createdAt": "string"
  }
]
```

---

### 14. Update Booking Status
**PATCH** `/bookings/{id}/status`

**Headers:** `Authorization: Bearer <token>` (Doctor role required)

**Request Body:**
```json
{
  "status": "Approved | Rejected | Complete",
  "rejectionReason": "string (required if status is Rejected)",
  "timeSlot": "string (optional, for changing time when approving)",
  "notes": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "status": "string",
  "rejectionReason": "string",
  "message": "Booking status updated successfully"
}
```

---

### 15. Cancel Booking
**PATCH** `/bookings/{id}/cancel`

**Headers:** `Authorization: Bearer <token>` (Patient role required)

**Response (200 OK):**
```json
{
  "id": "string",
  "status": "Cancelled",
  "message": "Booking cancelled successfully"
}
```

**Note:** Only bookings with status "Booked" can be cancelled by patients.

---

### 16. Get Calendar Bookings
**GET** `/bookings/calendar`

**Headers:** `Authorization: Bearer <token>` (Doctor role required)

**Query Parameters:**
- `start` (optional): Start date (YYYY-MM-DD)
- `end` (optional): End date (YYYY-MM-DD)

**Response (200 OK):**
```json
[
  {
    "id": "string",
    "patientId": "string",
    "patientName": "string",
    "date": "string",
    "timeSlot": "string",
    "status": "string",
    "notes": "string",
    "paymentStatus": "string"
  }
]
```

---

## Settings Endpoints (Doctor Only)

### 17. Get Working Hours
**GET** `/settings/working-hours`

**Headers:** `Authorization: Bearer <token>` (Doctor role required)

**Response (200 OK):**
```json
[
  {
    "day": "Monday",
    "isAvailable": true,
    "startTime": "09:00",
    "endTime": "17:00",
    "slotDuration": 30
  },
  {
    "day": "Tuesday",
    "isAvailable": true,
    "startTime": "09:00",
    "endTime": "17:00",
    "slotDuration": 30
  }
]
```

---

### 18. Update Working Hours
**PUT** `/settings/working-hours`

**Headers:** `Authorization: Bearer <token>` (Doctor role required)

**Request Body:**
```json
{
  "hours": [
    {
      "day": "Monday",
      "isAvailable": true,
      "startTime": "09:00",
      "endTime": "17:00",
      "slotDuration": 30
    }
  ]
}
```

**Response (200 OK):**
```json
[
  {
    "day": "Monday",
    "isAvailable": true,
    "startTime": "09:00",
    "endTime": "17:00",
    "slotDuration": 30
  }
]
```

---

### 19. Get Available Slots
**GET** `/settings/available-slots`

**Query Parameters:**
- `date` (required): Date (YYYY-MM-DD)

**Response (200 OK):**
```json
[
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30"
]
```

**Logic:**
- Generate slots based on doctor's working hours for that day
- Exclude already booked slots
- Consider slot duration from settings

---

## Dashboard Endpoints (Doctor Only)

### 20. Get Dashboard Stats
**GET** `/reports/stats`

**Headers:** `Authorization: Bearer <token>` (Doctor role required)

**Response (200 OK):**
```json
{
  "totalPatients": 150,
  "todaysBookings": 8,
  "pendingApprovals": 5,
  "completedToday": 3
}
```

---

## Payment Endpoints

### 21. Create Payment Intent
**POST** `/payments/stripe-intent`

**Headers:** `Authorization: Bearer <token>` (Patient role required)

**Request Body:**
```json
{
  "bookingId": "string",
  "amount": 100
}
```

**Response (200 OK):**
```json
{
  "clientSecret": "string",
  "paymentIntentId": "string"
}
```

**Note:** This should create a Stripe Payment Intent and return the client secret for frontend processing.

---

### 22. Confirm Payment
**POST** `/payments/confirm`

**Headers:** `Authorization: Bearer <token>` (Patient role required)

**Request Body:**
```json
{
  "paymentIntentId": "string",
  "bookingId": "string"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "bookingId": "string",
  "amount": 100,
  "currency": "usd",
  "stripePaymentIntentId": "string",
  "status": "Paid",
  "createdAt": "string"
}
```

---

## Database Seeding

### Required Seed Data:

1. **Doctor User (Admin)**
   - Email: `doctor@example.com` (configurable via environment variable)
   - Password: `Doctor@123` (configurable via environment variable)
   - Role: `Doctor`
   - IsBlocked: `false`

2. **Roles**
   - `Doctor`
   - `Patient`

3. **Sample Patients** (Optional, for demo)
   - Create 3-5 sample patient accounts with various booking statuses

4. **Sample Bookings** (Optional, for demo)
   - Create sample bookings with different statuses: Booked, Approved, Rejected, Complete, Cancelled

---

## Error Response Format

All error responses should follow this format:

```json
{
  "message": "Error message here",
  "errors": {
    "fieldName": ["Error detail 1", "Error detail 2"]
  },
  "statusCode": 400
}
```

---

## Status Codes

- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions or blocked account
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Important Notes

1. **JWT Authentication**: Use ASP.NET Core Identity with JWT tokens for authentication
2. **Role-Based Authorization**: Use `[Authorize(Roles = "Doctor")]` and `[Authorize(Roles = "Patient")]` attributes
3. **File Upload**: Store profile pictures and booking files in a secure location (e.g., Azure Blob Storage or local file system)
4. **Stripe Integration**: Use Stripe.NET library for payment processing in test mode
5. **Validation**: Implement server-side validation for all inputs
6. **Blocking Logic**: Blocked patients should not be able to log in or create bookings
7. **Slot Validation**: Validate that time slots are within working hours and not already booked
8. **CORS**: Configure CORS to allow requests from your React frontend

---

## Environment Variables

Create an `appsettings.json` or use environment variables for:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=PatientManagement;Trusted_Connection=True;"
  },
  "Jwt": {
    "Key": "your-secret-key-here-min-32-characters",
    "Issuer": "PatientManagementAPI",
    "Audience": "PatientManagementClient",
    "ExpirationInHours": 24
  },
  "Stripe": {
    "SecretKey": "sk_test_your_stripe_secret_key",
    "PublishableKey": "pk_test_your_stripe_publishable_key"
  },
  "SeedData": {
    "DoctorEmail": "doctor@example.com",
    "DoctorPassword": "Doctor@123"
  }
}
```

---

## Frontend Environment Variables

Create a `.env` file in your React project:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

---

This completes the API documentation. Implement these endpoints in your ASP.NET Core backend with proper validation, authentication, and authorization.
