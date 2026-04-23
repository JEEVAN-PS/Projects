# Hospital Management System - Interview Cheat Sheet

## 🎯 30-Second Elevator Pitch
**"I've built a hospital management system where patients can book appointments with doctors. It's a full-stack application with React frontend and Spring Boot backend, using JWT for authentication. Admins can manage doctors, and the system handles queue management when appointments are cancelled."**

---

## 📱 Project Structure at a Glance

```
Frontend (React @ localhost:3000)          Backend (Spring Boot @ localhost:8080)       Database (MySQL)
├─ UserLogin.js                            ├─ UserAuthController                        ├─ users table
├─ UserRegister.js                         ├─ AdminAuthController                       ├─ doctor table
├─ AdminLogin.js                           ├─ DoctorController                          └─ appointment table
├─ Dashboard.js                            ├─ AppointmentController
├─ Appointments.js                         ├─ UserService
├─ Doctors.js                              ├─ DoctorService
├─ Admin.js                                ├─ AppointmentService
└─ api.js (Axios config)                   ├─ JwtUtil (Token generation)
                                           ├─ JwtFilter (Token validation)
                                           └─ SecurityConfig (Authorization)
```

---

## 🔑 KEY FLOWS (One-Line Summaries)

### **Registration & Login**
```
Register → Hash password (BCrypt) → Save to DB
         ↓
Login → Validate password → Generate JWT token → Store in localStorage
         ↓
All requests → Add Authorization: Bearer <token> → JwtFilter validates
```

### **Doctor Management**
```
Admin adds doctor → Validate token has ADMIN role → Save to doctor table → Return doctor with ID
```

### **Appointment Booking**
```
Patient books → Find doctor → Get max queue number → queue = max + 1 → Save appointment
```

### **Appointment Cancellation**
```
Cancel appointment (queue=2) → Mark as CANCELLED → Find appointments queue > 2 → Decrease queue by 1
```

---

## 💡 Core Concepts - Quick Answers

| Concept | One-Line Answer |
|---------|-----------------|
| **JWT** | Stateless token containing email & role, valid for 24 hours |
| **BCrypt** | Password hashing algorithm with salt; never store plain passwords |
| **CORS** | Allows frontend:3000 to access backend:8080 APIs |
| **@PreAuthorize** | Spring annotation to check user role before executing method |
| **Queue Management** | Assign queue = max + 1 for new bookings; decrement when cancelled |
| **Axios Interceptors** | Auto-add token to requests; handle 401 errors |
| **JPA Repositories** | Auto-implement CRUD using method names (e.g., findByEmail) |
| **REST API** | GET (read), POST (create), PUT (update), DELETE (remove) |
| **Role-Based Access** | USER can book appointments; ADMIN can add doctors |
| **Stateless Auth** | No session on server; everything in JWT token |

---

## 🔐 Authentication Flow - Quick Reference

```
                        ┌─ FRONTEND ─┐              ┌─ BACKEND ─┐
User registers/logs in → Sends email & password → UserAuthController
                                                       ↓
                                        Validates & encrypts password
                                                       ↓
                        ← Returns JWT token + role ← JwtUtil.generateToken()
                                ↓
                        Stores in localStorage
                                ↓
                        All future requests include Authorization header
                                ↓
                        JwtFilter validates token on each request
```

---

## 🎯 Important Code Snippets to Remember

### **JWT Generation**
```java
String token = Jwts.builder()
    .setSubject(email)
    .claim("role", role)
    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
    .signWith(SECRET_KEY)
    .compact();
```

### **Password Hashing**
```java
String hashedPassword = passwordEncoder.encode(user.getPassword());
boolean isValid = passwordEncoder.matches(enteredPassword, hashedPassword);
```

### **API Authorization**
```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/doctors")
public ResponseEntity<?> addDoctor(@RequestBody Doctor doctor)
```

### **Queue Assignment**
```java
int maxQueue = appointments.stream().mapToInt(a -> a.getQueue()).max().orElse(0);
newAppointment.setQueue(maxQueue + 1);
```

### **Axios Interceptor**
```javascript
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

---

## 📊 API Endpoints Cheat Sheet

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| /user/auth/register | POST | No | Register patient |
| /user/auth/login | POST | No | Patient login |
| /admin/auth/register | POST | No | Register admin |
| /admin/auth/login | POST | No | Admin login |
| /doctors | GET | No | List all doctors |
| /doctors | POST | ADMIN | Add doctor |
| /doctors/{id} | PUT | ADMIN | Edit doctor |
| /doctors/{id} | DELETE | ADMIN | Delete doctor |
| /appointments | GET | No | List all appointments |
| /appointments | POST | No | Book appointment |
| /appointments/{id} | PUT | No | Cancel appointment |
| /appointments/{id} | DELETE | No | Delete appointment |

---

## 🚀 Quick Answers to Common Questions

**Q: What's the tech stack?**
- Backend: Spring Boot 4.0.4, Java 11, MySQL, JWT
- Frontend: React 19, React Router, Axios

**Q: How is data secured?**
- Passwords: BCrypt hashing
- Communication: JWT tokens, HTTPS ready
- Authorization: Role-based access control

**Q: What happens when token expires?**
- Response interceptor catches 401
- Clears localStorage
- Redirects to login

**Q: How do you prevent duplicate queue positions?**
- Find max queue for doctor
- Assign new queue = max + 1
- When cancelled, decrement all following queues

**Q: Can users see other users' appointments?**
- Currently yes (GET /appointments is public)
- Could be improved with user filtering

**Q: How does admin know token has admin role?**
- Role claim stored in JWT token
- JwtFilter extracts role from token
- @PreAuthorize checks role before method execution

---

## 📋 Database Schema - Visual

```
┌──────────────────────┐         ┌──────────────────────┐
│  users               │         │  doctor              │
├──────────────────────┤         ├──────────────────────┤
│ id (PK)              │         │ id (PK)              │
│ email                │         │ name                 │
│ password (BCrypt)    │         │ specialization       │
│ username             │         │ experience           │
│ role (USER/ADMIN)    │         │ available_day        │
└──────────────────────┘         │ start_time           │
                                 │ end_time             │
                                 └──────────────────────┘
                                          ▲
                                          │ (Foreign Key)
                                          │
                                 ┌──────────────────────┐
                                 │  appointment         │
                                 ├──────────────────────┤
                                 │ id (PK)              │
                                 │ patient_name         │
                                 │ doctor_id (FK)       │
                                 │ queue                │
                                 │ status (BOOKED/..)   │
                                 │ cancelled            │
                                 └──────────────────────┘
```

---

## 🎓 Practice Scenarios for Live Coding

**Scenario 1: Write appointment booking logic**
- Validate doctor exists
- Find max queue for doctor
- Assign new queue position
- Save and return

**Scenario 2: Write queue resequencing logic**
- Find all appointments after cancelled position
- Decrease queue by 1 for each
- Save all changes

**Scenario 3: Write JWT validation**
- Extract token from Authorization header
- Validate signature
- Check expiration
- Extract email & role

**Scenario 4: Write doctor authorization**
- Check if user has ADMIN role
- Return 403 if not
- Allow if admin

**Scenario 5: Write Axios interceptor**
- Add token to all requests
- Handle 401 errors
- Redirect to login on unauthorized

---

## ⚠️ Potential Follow-up Questions & Answers

**Q: What if two users book simultaneously?**
A: Database handles with transaction locks. Could add optimistic locking for better performance.

**Q: How to prevent one user cancelling another's appointment?**
A: Add userId to appointment table. Check if current user owns appointment before cancelling.

**Q: How to handle doctor unavailability?**
A: Check if appointment date is in doctor's available_day. Validate time within start_time:end_time.

**Q: Can passwords be recovered?**
A: No, BCrypt is one-way. Would need to send reset link via email with temporary token.

**Q: How to scale to multiple servers?**
A: Use Redis for JWT validation cache. Store sessions in distributed cache. Use load balancer.

**Q: What about appointment confirmation emails?**
A: EmailService can be implemented using Spring Mail. Send confirmation after booking.

---

## 💪 Confidence Boosters

Before interview, remember:
- ✅ You know the architecture completely
- ✅ You understand authentication flow
- ✅ You can explain database relationships
- ✅ You know all API endpoints
- ✅ You can explain queue management
- ✅ You understand security measures
- ✅ You have improvements ideas
- ✅ You can explain trade-offs

---

## 📝 Interview Day Checklist

- [ ] Review this cheat sheet 10 minutes before
- [ ] Keep INTERVIEW_REPORT.md open on second monitor
- [ ] Have project running locally (backend & frontend)
- [ ] Know project folder structure
- [ ] Remember key file locations
- [ ] Practice explaining JWT flow
- [ ] Practice queue management explanation
- [ ] Think of 2-3 improvements
- [ ] Be ready to show code
- [ ] Ask questions about their tech stack

---

## 🎯 Golden Phrases to Use

1. **"The key architectural decision..."** - Shows thoughtfulness
2. **"For scalability, we could..."** - Shows future thinking
3. **"In terms of security..."** - Shows security awareness
4. **"The trade-off here is..."** - Shows systems thinking
5. **"Based on requirements..."** - Shows requirements analysis
6. **"Let me walk you through the flow..."** - Shows clarity

---

**Good Luck! 🚀 You've got this! 💪**
