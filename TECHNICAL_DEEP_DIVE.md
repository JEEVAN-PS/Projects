# Hospital Management System - Technical Deep Dive

## 🔬 Advanced Concepts & Technical Details

---

## 1️⃣ JWT (JSON Web Token) - Deep Dive

### **What is JWT?**
JWT is a compact, self-contained token format for securely transmitting information between parties.

### **JWT Structure**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huQGhvc3BpdGFsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjkzMzAwMDAwLCJleHAiOjE2OTMzODY0MDB9.signature

┌─────────────────────────────────────────────────────────────────┐
│                      THREE PARTS (Dot Separated)                │
├─────────────────────────────────────────────────────────────────┤
│ 1. HEADER                                                       │
│    Encodes: { "alg": "HS256", "typ": "JWT" }                   │
│    Base64URL encoded                                            │
│                                                                 │
│ 2. PAYLOAD (Claims)                                             │
│    Encodes: { "sub": "john@hospital.com", "role": "USER" }     │
│    "sub" = subject (user email)                                 │
│    "role" = custom claim for authorization                      │
│    "iat" = issued at (timestamp)                                │
│    "exp" = expiration (timestamp)                               │
│    Base64URL encoded                                            │
│                                                                 │
│ 3. SIGNATURE                                                    │
│    HMACSHA256(BASE64(header) + "." + BASE64(payload), SECRET)   │
│    Ensures token hasn't been modified                           │
│    Only backend knows the SECRET                                │
└─────────────────────────────────────────────────────────────────┘
```

### **Why Use JWT?**
1. **Stateless** - No session storage needed
2. **Scalable** - Works across multiple servers
3. **Mobile-friendly** - Can be used in mobile apps
4. **Self-contained** - User info in token itself
5. **CORS compatible** - Works with cross-domain requests

### **JWT Flow in Your App**
```
1. User logs in → Backend validates → Generates token
2. Token = BASE64(header) + "." + BASE64(payload) + "." + SIGNATURE
3. Backend sends token to frontend
4. Frontend stores in localStorage
5. Frontend includes in every request: Authorization: Bearer <token>
6. Backend extracts token from header
7. Backend validates signature using SECRET_KEY
8. If valid → Allow request, extract email & role
9. If invalid → Return 401 Unauthorized
```

### **Security Considerations**
```
✅ Token is signed but NOT encrypted (readable but can't be modified)
✅ Never put sensitive data (passwords, credit cards) in token
✅ Always use HTTPS in production to prevent token interception
✅ Token should have short expiration (24 hours in your app)
✅ Use refresh tokens for longer sessions (not implemented)
⚠️ Current app doesn't implement refresh token - user needs to re-login after 24 hours
```

---

## 2️⃣ Password Hashing with BCrypt - Deep Dive

### **Why Hash Passwords?**
```
WRONG:
User password = "secure123"
Database: password = "secure123" ❌ (If DB is hacked, passwords are exposed)

RIGHT:
User password = "secure123"
Database: password = $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm ✅
          (Hashed using BCrypt)
```

### **How BCrypt Works**
```
1. User enters password: "secure123"
2. BCrypt generates random SALT (e.g., $2b$10$N9qo8uLOickgx2ZMRZoMye)
3. BCrypt hashes password multiple times with salt (cost factor = 10)
4. Result: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm
5. Store in database

During login:
1. User enters password: "secure123"
2. Extract salt from stored hash
3. Hash entered password with same salt
4. Compare with stored hash
5. If match → Login successful
```

### **BCrypt Strength**
- Each password gets unique salt
- Takes ~0.1 seconds to hash (brute force resistant)
- Cost factor = 10 means 2^10 = 1024 rounds of hashing
- Even if hacker gets database, can't reverse engineer passwords

### **Code in Your App**
```java
@Autowired
private PasswordEncoder passwordEncoder; // Spring's BCryptPasswordEncoder

// During registration:
String hashedPassword = passwordEncoder.encode(user.getPassword());
user.setPassword(hashedPassword);
userRepository.save(user);

// During login:
User dbUser = userRepository.findByEmail(email).get();
boolean isValid = passwordEncoder.matches(enteredPassword, dbUser.getPassword());
if (isValid) {
    // Generate JWT token
}
```

---

## 3️⃣ CORS (Cross-Origin Resource Sharing) - Deep Dive

### **The Problem**
```
Frontend at: http://localhost:3000
Backend at:  http://localhost:8080

When frontend tries to fetch from backend:
Browser: "Hold on! Different domain. This could be a security issue."
Browser blocks the request ❌
```

### **CORS Solution**
```
Backend sends headers:
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type

Browser sees these headers and allows the request ✅
```

### **Your CORS Configuration**
```java
@Configuration
public class SecurityConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Step 1: Allow these origins
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000"
        ));
        
        // Step 2: Allow these HTTP methods
        config.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));
        
        // Step 3: Allow these headers in requests
        config.setAllowedHeaders(Arrays.asList(
            "Authorization",      // For JWT token
            "Content-Type"        // For JSON
        ));
        
        // Step 4: Allow credentials (cookies/tokens) in requests
        config.setAllowCredentials(true);
        
        return config;
    }
}
```

### **CORS Request Flow**
```
1. Frontend makes request to backend
2. Browser automatically sends: Origin: http://localhost:3000
3. Backend's CORS filter checks:
   - Is origin in allowed list? YES
   - Is method allowed? YES
   - Is header allowed? YES
4. Backend responds with CORS headers
5. Browser allows response to be read by frontend
```

### **CORS Preflight Request**
```
For complex requests (POST with custom headers), browser sends OPTIONS first:

OPTIONS /appointments
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Authorization

Backend responds:
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST

Then frontend sends actual POST request
```

---

## 4️⃣ Spring Security & Authorization - Deep Dive

### **Authentication vs Authorization**
```
AUTHENTICATION: "Are you who you claim to be?"
- Login with email & password
- Verify credentials
- Generate token

AUTHORIZATION: "Are you allowed to do this?"
- Check user's role
- Check access permissions
- Allow or deny action
```

### **Your Authorization Rules**
```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(auth -> auth
        // Public endpoints - anyone can access
        .requestMatchers("/user/auth/**").permitAll()
        .requestMatchers("/admin/auth/**").permitAll()
        .requestMatchers(HttpMethod.GET, "/doctors").permitAll()
        
        // Admin-only endpoints
        .requestMatchers(HttpMethod.POST, "/doctors").authenticated()
        .requestMatchers(HttpMethod.PUT, "/doctors/**").authenticated()
        
        // Everything else requires authentication
        .anyRequest().authenticated()
    );
}
```

### **@PreAuthorize Annotation**
```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/doctors")
public ResponseEntity<?> addDoctor(@RequestBody Doctor doctor) {
    // This method only executes if JWT token has ADMIN role
    // If USER tries to access: 403 Forbidden
}
```

### **How Authorization Works**
```
1. Request arrives at backend
2. JwtFilter extracts token from Authorization header
3. JwtFilter validates token signature & expiration
4. JwtFilter extracts email & role from token
5. Creates Authentication object with role
6. Spring Security checks @PreAuthorize rules
7. If role matches → Allow, Otherwise → 403 Forbidden
```

---

## 5️⃣ Spring Data JPA & Repositories - Deep Dive

### **What is JPA?**
JPA = Java Persistence API (standard for ORM in Java)

### **How Repositories Work**
```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

// JPA automatically implements:
save(user)           // INSERT
findById(id)         // SELECT WHERE id = ?
findAll()            // SELECT *
delete(user)         // DELETE
deleteById(id)       // DELETE WHERE id = ?

// Method name conventions:
findBy + FieldName = generates query
findByEmail → SELECT * FROM users WHERE email = ?
findByEmailAndRole → SELECT * FROM users WHERE email = ? AND role = ?
findByNameContaining → SELECT * FROM users WHERE name LIKE %?%
```

### **Entity Mapping**
```java
@Entity                    // Maps to database table
@Table(name = "doctor")    // Table name
public class Doctor {
    @Id                    // Primary key
    @GeneratedValue        // Auto-increment
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;   // NOT NULL constraint
}

// Maps to:
CREATE TABLE doctor (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);
```

### **Relationships**
```java
// In Appointment.java:
@ManyToOne                 // Many appointments to one doctor
@JoinColumn(name = "doctor_id")
private Doctor doctor;     // Foreign key reference

// Maps to:
ALTER TABLE appointment ADD FOREIGN KEY (doctor_id) REFERENCES doctor(id);
```

---

## 6️⃣ Queue Management Logic - Deep Dive

### **Scenario: 4 Patients Booked with Dr. X**
```
DOCTOR: Dr. X has queue positions: 1, 2, 3, 4

Patient booking sequence:
1. John books → queue = 1
2. Raj books → queue = 2
3. Priya books → queue = 3
4. Amit books → queue = 4
```

### **When Priya Cancels (queue = 3)**
```
AppointmentService.cancelAppointment(priyaId) {
    1. Find Priya's appointment
       - doctor_id = X
       - queue = 3
    
    2. Mark as CANCELLED
       UPDATE appointment SET status = "CANCELLED" WHERE id = priya_id
    
    3. Find all appointments for doctor X where queue > 3
       SELECT * FROM appointment 
       WHERE doctor_id = X AND queue > 3 AND status = "BOOKED"
       Result: Amit (queue = 4)
    
    4. Decrease queue by 1
       Amit's queue: 4 → 3
       UPDATE appointment SET queue = 3 WHERE id = amit_id
}

After cancellation:
Queue 1: John
Queue 2: Raj
Queue 3: Amit (moved up from 4)
Priya: CANCELLED (no queue)
```

### **Code Implementation**
```java
public Appointment cancelAppointment(Long appointmentId) {
    // Step 1: Get the appointment
    Appointment appt = appointmentRepository.findById(appointmentId)
        .orElseThrow(() -> new RuntimeException("Not found"));
    
    Long doctorId = appt.getDoctor().getId();
    int cancelledQueue = appt.getQueue();
    
    // Step 2: Mark as cancelled
    appt.setStatus("CANCELLED");
    appointmentRepository.save(appt);
    
    // Step 3: Find all appointments after this queue
    List<Appointment> followingAppointments = appointmentRepository
        .findByDoctor_IdAndQueueGreaterThanAndStatus(
            doctorId,           // For this doctor
            cancelledQueue,     // With queue > cancelled queue
            "BOOKED"           // That are booked
        );
    
    // Step 4: Resequence (decrease queue by 1)
    for (Appointment a : followingAppointments) {
        a.setQueue(a.getQueue() - 1);
        appointmentRepository.save(a);
    }
    
    return appt;
}
```

### **Edge Cases**
```
❓ What if last patient in queue cancels?
→ No following appointments, so nothing to resequence. Just mark cancelled.

❓ What if someone cancels and another books same time?
→ Database transaction ensures consistency. New booking gets new queue position.

❓ What if database crashes during resequencing?
→ Transaction rollback ensures partial updates don't corrupt data.
```

---

## 7️⃣ Axios Interceptors - Deep Dive

### **What are Interceptors?**
Functions that run before every request and after every response.

### **Your Request Interceptor**
```javascript
api.interceptors.request.use(
    // Success handler
    (config) => {
        // Before every request:
        const token = localStorage.getItem('token');
        
        if (token) {
            // Add Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    // Error handler
    (error) => {
        return Promise.reject(error);
    }
);
```

### **Request Flow**
```
1. Frontend calls: api.get('/doctors')
2. Request interceptor runs:
   - Get token from localStorage
   - Add to header: { Authorization: 'Bearer <token>' }
3. Request sent to backend with header
4. Backend receives request with Authorization header
5. JwtFilter validates token
6. Response sent back
```

### **Your Response Interceptor**
```javascript
api.interceptors.response.use(
    // Success handler
    (response) => {
        return response;
    },
    // Error handler
    (error) => {
        // If server returns 401 Unauthorized:
        if (error.response?.status === 401) {
            // Clear stored credentials
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            
            // Redirect to login
            window.location.href = '/user/login';
        }
        
        return Promise.reject(error);
    }
);
```

### **Common Scenarios**
```
✅ Token valid → Request succeeds
❌ Token invalid → 401 → localStorage cleared → Redirect to login
❌ Token expired → 401 → localStorage cleared → Redirect to login
❌ Network error → Error logged → Message shown
```

---

## 8️⃣ React Hooks & State Management - Deep Dive

### **useState Hook**
```javascript
// In Appointments.js:
const [appointments, setAppointments] = useState([]);
const [doctors, setDoctors] = useState([]);
const [formData, setFormData] = useState({
    patientName: "",
    doctorId: "",
    appointmentDate: ""
});

// Initial state is empty
// When API returns data:
setAppointments(res.data);  // Update state
// React re-renders component with new data
```

### **useEffect Hook**
```javascript
useEffect(() => {
    loadDoctors();
    loadAppointments();
    
    // Auto-refresh every 2 seconds
    const interval = setInterval(() => {
        loadAppointments();
    }, 2000);
    
    // Cleanup: stop interval when component unmounts
    return () => clearInterval(interval);
}, []);  // Empty dependency array = run once on mount
```

### **Auto-Refresh Implementation**
```
Component mounts (appears on screen)
    ↓
useEffect runs
    ↓
loadAppointments() fetches data
    ↓
setAppointments(data) updates state
    ↓
Component re-renders with new data
    ↓
setInterval starts 2-second timer
    ↓
Every 2 seconds: loadAppointments() runs again
    ↓
Component mounts (disappears)
    ↓
useEffect cleanup runs
    ↓
clearInterval stops the timer
```

---

## 9️⃣ Role-Based Access Control (RBAC) - Deep Dive

### **Three-Layer RBAC in Your App**

#### **Layer 1: Database**
```sql
-- User has role
SELECT * FROM users WHERE email = 'admin@hospital.com';
-- Result: { id: 1, email: 'admin@hospital.com', role: 'ADMIN' }
```

#### **Layer 2: Token**
```json
// JWT token contains role
{
  "sub": "admin@hospital.com",
  "role": "ADMIN",
  "exp": 1693386400
}
```

#### **Layer 3: Frontend & Backend**
```
Frontend:
- localStorage contains role
- Check before showing admin buttons
- Still protected by backend authorization

Backend:
- @PreAuthorize("hasRole('ADMIN')")
- Even if frontend bypassed, backend checks
- Returns 403 Forbidden if role doesn't match
```

### **Access Control Matrix**
```
                    USER    ADMIN
View Doctors        ✅      ✅
Book Appointment    ✅      ✅
View Appointments   ✅      ✅
Cancel Appointment  ✅      ✅
Add Doctor          ❌      ✅
Edit Doctor         ❌      ✅
Delete Doctor       ❌      ✅
```

---

## 🔟 Error Handling & HTTP Status Codes - Deep Dive

### **HTTP Status Codes Used**

| Code | Meaning | Scenario |
|------|---------|----------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid input (missing fields) |
| 401 | Unauthorized | Invalid credentials or expired token |
| 403 | Forbidden | Valid token but wrong role (e.g., USER trying to add doctor) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Unexpected backend error |

### **Your Error Handling**
```java
// In UserAuthController.java:
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User user) {
    try {
        // Validation
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            return ResponseEntity.badRequest()     // 400
                .body("Email is required");
        }
        
        // Find user
        User dbUser = userRepository.findByEmail(user.getEmail())
            .orElse(null);
        
        if (dbUser == null) {
            return ResponseEntity.status(401)      // 401
                .body("Invalid credentials");
        }
        
        // Success
        return ResponseEntity.ok()                 // 200
            .body(new LoginResponse(token, role));
            
    } catch (Exception e) {
        return ResponseEntity.status(500)          // 500
            .body("Server error");
    }
}
```

### **Frontend Error Handling**
```javascript
try {
    const res = await api.post('/appointments', appointmentData);
    setSuccess('Appointment booked!');
} catch (err) {
    // Extract error message from different response formats
    const message = 
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        'Something went wrong';
    
    setError(message);
}
```

---

## 1️⃣1️⃣ Transaction & Data Consistency - Deep Dive

### **Problem: Race Condition**
```
Scenario: Two patients book simultaneously with same doctor

Timeline:
T1: Patient A reads max queue = 3
T2: Patient B reads max queue = 3
T3: Patient A calculates new queue = 4, saves
T4: Patient B calculates new queue = 4, saves
Result: Both get queue = 4 ❌ (Duplicate queue!)
```

### **Solution: Database Transactions**
```java
@Transactional  // Spring annotation for transaction
public Appointment bookAppointment(Appointment appointment) {
    // Begin transaction
    
    Doctor doctor = doctorRepository.findById(docId);
    
    // SELECT FOR UPDATE (locks row)
    List<Appointment> existing = appointmentRepository
        .findByDoctor_IdAndStatus(docId, "BOOKED");
    
    int maxQueue = existing.stream()
        .mapToInt(a -> a.getQueue())
        .max()
        .orElse(0);
    
    appointment.setQueue(maxQueue + 1);
    appointmentRepository.save(appointment);
    
    // Commit transaction
    return appointment;
}
```

### **How It Works**
```
Transaction 1:
Lock doctor_id = 1 records
Read queue positions: 1, 2, 3
Calculate new queue: 4
Insert new appointment
Release lock

Transaction 2 (waits for lock):
Lock doctor_id = 1 records (now available)
Read queue positions: 1, 2, 3, 4
Calculate new queue: 5
Insert new appointment
Release lock

Result: Correct queues 1,2,3,4,5 ✅
```

---

## 1️⃣2️⃣ Performance Optimization Tips - Deep Dive

### **Database Optimization**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_doctor_id ON appointment(doctor_id);
CREATE INDEX idx_email ON users(email);  -- For login query
CREATE INDEX idx_status ON appointment(status);

-- These prevent full table scans
```

### **Frontend Optimization**
```javascript
// Instead of:
const interval = setInterval(loadAppointments, 2000);  // Every 2 seconds!

// Better:
const interval = setInterval(loadAppointments, 5000);  // Every 5 seconds (reduces server load)

// Or implement smart polling:
let shouldPoll = true;
const poll = async () => {
    if (shouldPoll) {
        await loadAppointments();
    }
    setTimeout(poll, 5000);
};
```

### **API Optimization**
```java
// Add pagination
@GetMapping("/appointments")
public Page<Appointment> getAppointments(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
) {
    return appointmentRepository.findAll(PageRequest.of(page, size));
}

// Instead of fetching all 10,000 appointments,
// fetch only 10 per page
```

---

## 1️⃣3️⃣ Potential Security Issues & Fixes - Deep Dive

### **Issue 1: JWT Secret Hardcoded**
```java
// ❌ WRONG - In source code!
private final String SECRET = "hospital_secret_key_123456";

// ✅ RIGHT - Use environment variable
@Value("${jwt.secret}")
private String SECRET;

// application.properties:
jwt.secret=${JWT_SECRET}  // Read from environment
```

### **Issue 2: CORS Too Permissive**
```java
// ❌ WRONG - Allows from everywhere
configuration.setAllowedOrigins(Arrays.asList("*"));

// ✅ RIGHT - Specific domains only
configuration.setAllowedOrigins(Arrays.asList(
    "https://hospital.com",
    "https://www.hospital.com"
));
```

### **Issue 3: Sensitive Data in Logs**
```java
// ❌ WRONG
System.out.println("Password: " + user.getPassword());

// ✅ RIGHT
logger.info("User logged in: {}", user.getEmail());  // Never log passwords!
```

### **Issue 4: SQL Injection**
```java
// ❌ WRONG
String query = "SELECT * FROM users WHERE email = '" + email + "'";

// ✅ RIGHT - Using JPA (parameterized query)
userRepository.findByEmail(email);  // Prevents SQL injection
```

---

## 1️⃣4️⃣ Deployment Considerations - Deep Dive

### **Production Checklist**
```
Database:
✅ Use cloud database (AWS RDS, Azure SQL)
✅ Enable SSL for database connections
✅ Regular backups
✅ Read replicas for scaling

Backend:
✅ Hide error details (no stack traces to client)
✅ Enable HTTPS (SSL certificate)
✅ Use environment variables for secrets
✅ Enable logging & monitoring
✅ Use load balancer
✅ Horizontal scaling (multiple instances)

Frontend:
✅ Build optimized version (npm run build)
✅ Deploy to CDN (AWS CloudFront, Azure CDN)
✅ Enable caching
✅ Minify & compress assets

Security:
✅ Enable WAF (Web Application Firewall)
✅ Rate limiting
✅ DDoS protection
✅ Regular security audits
```

---

## 1️⃣5️⃣ Monitoring & Troubleshooting - Deep Dive

### **Backend Monitoring**
```java
// Add logging
@Slf4j
@RestController
public class AppointmentController {
    @GetMapping
    public ResponseEntity<?> getAppointments() {
        log.info("Fetching all appointments");
        List<AppointmentResponse> data = appointmentService.getAllAppointments();
        log.info("Found {} appointments", data.size());
        return ResponseEntity.ok(data);
    }
}

// Check logs:
// ✅ Request volume
// ❌ Errors
// ⏱️ Response time
```

### **Frontend Monitoring**
```javascript
// Track console errors
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Send to error tracking service (Sentry, LogRocket)
});

// Monitor API calls
api.interceptors.response.use(
    (response) => {
        console.log(`API ${response.config.method.toUpperCase()} ${response.config.url} took ${Date.now() - startTime}ms`);
        return response;
    }
);
```

### **Common Issues & Solutions**
```
Issue: 401 Unauthorized on all requests
→ Check if token in localStorage
→ Check if token expired
→ Check if Authorization header being sent

Issue: 403 Forbidden on adding doctor
→ Check if user has ADMIN role
→ Check if JWT token contains correct role
→ Check @PreAuthorize annotation

Issue: Queue numbers incorrect
→ Check database for duplicate queues
→ Check resequencing logic
→ Verify transaction isolation level

Issue: Dashboard not updating
→ Check if API returning data
→ Check if setInterval is running
→ Check if state updates triggering re-render
```

---

## 🎓 Advanced Interview Questions

**Q: How would you implement email notifications?**
```java
// Inject EmailService
@Autowired private EmailService emailService;

// After booking appointment:
emailService.sendBookingConfirmation(
    appointment.getPatient(),
    appointment.getDoctor(),
    appointment.getQueue()
);

// Implementation uses Spring Mail
```

**Q: How to prevent double booking?**
```
Solution: Implement appointment slots
- Add appointment_slot table with doctor_id, date, time
- Mark slot as BOOKED when appointment created
- Prevent booking if slot already BOOKED
```

**Q: How to scale to million users?**
```
1. Horizontal scaling: Multiple backend servers
2. Load balancer: Distribute requests
3. Caching: Redis for frequently accessed doctors
4. Database: Master-slave replication, sharding
5. CDN: Cache static assets
6. Message queue: Async processing for emails
```

**Q: How to implement appointment rescheduling?**
```
Before: queue = 3 with doctor X
After: queue = ? with doctor Y

Logic:
1. Get old queue, mark as cancelled
2. Resequence old doctor's appointments
3. Find new queue for new doctor
4. Create new appointment
5. Send notification
```

---

**This deep dive should prepare you for advanced technical questions! 🎓**
