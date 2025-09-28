# Smart Medical System

A **web-based medical management platform** to efficiently handle patients, doctors, and appointments.  
It provides a **Dashboard** with real-time charts, patient/appointment management, and data export options.  

---

##  Features

-  **Dashboard**
  - Patient & Appointment statistics  
  - Doctor-wise appointment chart  
  - Status breakdown (Completed, Pending, Cancelled)  
  - Appointment trends per day  
  - Recent appointments table  
  - Top doctors leaderboard  
  - Export (CSV / PDF)  

-  **Patients**
  - Add & manage patient records  
  - Medical history tracking  

-  **Appointments**
  - Add & manage appointments  
  - Doctor assignment  
  - Status tracking  

- **Search & Filters**  
- **Export to CSV & PDF**  

---

##  Tech Stack

- **Frontend:** React, Bootstrap, Recharts, Framer Motion  
- **Backend:** Spring Boot (Java)  
- **Database:** MySQL  
- **Export:** jsPDF, jspdf-autotable, file-saver  

---

##  Project Structure

```
smart-medical-system/
 ├── backend/        # Spring Boot API
 ├── frontend/       # React frontend
 │   ├── src/
 │   │   ├── components/
 │   │   │   ├── AddAppointment.js
 │   │   │   ├── AddPatient.js
 │   │   │   ├── AppointmentBoard.js
 │   │   ├── pages/
 │   │   │   ├── Dashboard.jsx
 │   │   ├── App.js
 │   │   ├── index.js
 │   └── package.json
 └── README.md
```

---

##  Installation & Setup

###  Clone Repository
```bash
git clone https://github.com/your-username/smart-medical-system.git
cd smart-medical-system
```

###  Backend Setup
```bash
cd backend
./mvnw spring-boot:run    # Linux/Mac
mvnw.cmd spring-boot:run  # Windows
```
 Backend runs at: **http://localhost:8080**

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
 Frontend runs at: **http://localhost:3000**

---

## Database Configuration (MySQL)

```sql
CREATE DATABASE smart_medical;
CREATE USER 'sms_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON smart_medical.* TO 'sms_user'@'localhost';
FLUSH PRIVILEGES;
```

 Example `application.properties`  
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_medical?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=sms_user
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

---

##  Dependencies

### Frontend
```bash
npm install react-router-dom bootstrap recharts framer-motion jspdf jspdf-autotable file-saver
```

### Backend (Maven)
- Spring Boot Starter Web  
- Spring Boot Starter Data JPA  
- MySQL Connector  
- Lombok  

---

##  API Endpoints

| Endpoint                  | Method | Description              |
|----------------------------|--------|--------------------------|
| `/api/dashboard`           | GET    | Dashboard statistics     |
| `/api/patients`            | GET    | List all patients        |
| `/api/patients`            | POST   | Add a new patient        |
| `/api/appointments`        | GET    | List all appointments    |
| `/api/appointments`        | POST   | Add new appointment      |

---

##  Export Options

- **CSV Export** → Save appointments as `.csv`  
- **PDF Export** → Generate dashboard reports with summary + recent data  

---

## Screenshots

Upload screenshots to Google Drive and add your link here:  
`[Screenshots](https://drive.google.com/drive/folders/your-link-here)`

---

##  Database Schema (Sample)

```sql
-- patients table
CREATE TABLE patients (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT,
  email VARCHAR(255),
  phone VARCHAR(50),
  medical_history TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- appointments table
CREATE TABLE appointments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  patient_id BIGINT,
  doctor_name VARCHAR(255),
  appointment_time DATETIME,
  reason VARCHAR(1000),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
);
```

---

##  Troubleshooting

- **Public Key Retrieval error** → Add `allowPublicKeyRetrieval=true` in JDBC URL  
- **CORS error** → Add proxy in `frontend/package.json` or enable `@CrossOrigin` in Spring Boot  
- **npm start errors** → Run `npm install` again & check file paths  
- **400 Bad Request (Appointments)** → Ensure `patient.id` is valid & date format is `yyyy-MM-dd'T'HH:mm`  

---

##  Future Enhancements

-  Authentication (Doctor/Patient login)  
-  Email/SMS appointment reminders  
-  Advanced filters & analytics  
-  Role-based dashboards  

---

##  License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and share.  

---

##  Author

**Mann Sharma**  
 Email: [2023bcaaidsmann14707@poornima.edu.in](mailto:2023bcaaidsmann14707@poornima.edu.in)  
 LinkedIn: [Mann Sharma](https://www.linkedin.com/in/mann-sharma-5425b9290?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)  

---

## Tips

-  Forgot admin password? → Manually update it in DB with a BCrypt hash.  
-  Whitelabel error page? → Check logs, usually due to DB issues or missing templates.  
-  Debugging APIs? → Use **Postman** to test endpoints quickly.  
