# CareBridge

<p align="center">
  <!-- tech stack icons -->
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="React" height="50" style="margin-right: 20px;"/>
  <img src="https://www.svgrepo.com/show/374118/tailwind.svg" alt="Tailwind CSS" height="50" style="margin-right: 20px;"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="Node.js" height="50" style="margin-right: 20px;"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="Express.js" height="50" style="margin-right: 20px;"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="MongoDB" height="50"/>
</p>

**CareBridge** is a full‑stack telehealth platform that connects **doctors** and **patients**.  It provides features such as appointment scheduling, electronic health records (EHR), prescriptions, secure file upload, messaging, and real‑time video consultations.  The project is divided into a **backend** service written in Node.js/Express with MongoDB and a **frontend** consisting of two React applications (Doctor and Patient) built with Vite and TypeScript.  Video meetings are powered by VideoSDK.

## Features

### Core functionality

- **User authentication & authorisation** – secure sign‑in and registration endpoints using JWT tokens (handled in the backend).
- **Role‑based interfaces** – separate React applications for doctors and patients with tailored navigation and pages.
- **Appointment management** – doctors can schedule, edit and view appointments; patients can request and see upcoming appointments.  Appointment routes are registered in the backend (`/api/appointments`).
- **Real‑time video calls** – VideoSDK is used to create rooms and tokens for doctor–patient video consultations.  The backend exposes a meeting controller that generates a VideoSDK token and creates a room using the VideoSDK API; the doctor and patient UIs use `@videosdk.live/react‑sdk` for the front‑end experience.
- **Secure messaging & socket support** – Socket.IO is configured on the server for real‑time features such as chat and live status updates.  Client‑side pages include messaging modules.
- **Electronic health records** – doctors can view and update patient health records, and patients can view their EHR (handled under `/api/health‑records` routes).
- **Intake & medical forms** – patients can submit intake forms; doctors can review them.
- **Prescriptions** – doctors can create and manage prescriptions for patients; patients can view their prescriptions.
- **File uploads** – files such as medical documents and prescriptions can be uploaded and stored (AWS S3 client is included in the doctor app dependencies).
- **Dashboards** – both doctor and patient apps include dashboards with overviews (appointments, messages, records etc.).
- **Charts & analytics** – the patient app uses Recharts for interactive charts.

## Tech stack

### Backend

- **Node.js & Express.js** – REST API server for authentication, appointments, health records, prescriptions, meetings and other endpoints.
- **MongoDB (Mongoose)** – primary database for users, appointments, meetings and EHRs, with a default connection to a `carebridge-md` database.
- **Socket.IO** – WebSocket server for real‑time features such as chat and live updates.
- **VideoSDK token generation** – tokens are generated using a JWT secret and VideoSDK API key.
- **Other libraries** – Nodemailer (email), Multer (file uploads), BcryptJS (password hashing), Axios (HTTP requests to VideoSDK), Jest (testing) and more.

### Frontend

- **React with TypeScript** – two Vite‑based apps (`Doctor` and `Patient`).
- **Tailwind CSS** – utility‑first styling and responsive design.
- **TanStack React‑Query** – data fetching and caching.
- **VideoSDK React SDK** – components for video calls.
- **Formik & Yup** – form management and validation.
- **React Router DOM** – client‑side routing.
- **Other tools** – AWS SDK (S3) for storage, Lucide React icons, React Player for video playback, Recharts for charts in the patient app.

## Repository structure

```
CareBridge/
├── backend/                # Node.js/Express API (TypeScript)
│   ├── app.ts             # Entry point and route registration
│   ├── controllers/       # Business logic (appointments, meetings, auth, etc.)
│   ├── models/            # Mongoose models
│   ├── routes/            # Express route definitions
│   ├── utils/             # Helpers (videosdkToken.ts, socket.ts, etc.)
│   └── package.json       # Backend dependencies and scripts
│
└── frontend/
    ├── Doctor/            # Doctor portal (React + Vite)
    │   ├── src/
    │   │   ├── pages/     # Pages (appointments, dashboard, video-chat, patient profile, etc.)
    │   │   ├── components/# Reusable components
    │   │   └── hooks/     # Custom React hooks
    │   ├── public/
    │   ├── README.md      # Vite/React template description
    │   └── package.json   # Doctor app dependencies
    │
    ├── Patient/           # Patient portal (React + Vite)
    │   ├── src/
    │   │   ├── pages/     # Pages (dashboard, EHR, intake-form, video-call, etc.)
    │   │   ├── components/
    │   │   └── hooks/
    │   ├── public/
    │   ├── README.md      # Vite/React template description
    │   └── package.json   # Patient app dependencies
    │
    └── shared-modules/    # Shared modules/components used across Doctor & Patient
```

## Getting started

### Prerequisites

- **Node.js** (v18+ recommended) and **npm**.
- **MongoDB** running locally or accessible via URI.
- VideoSDK API credentials (API key and secret) for generating meeting tokens.
- (Optional) AWS S3 credentials if you intend to enable file uploads.

### Backend setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/DhRuva-1509/CareBridge.git
   cd CareBridge/backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create an `.env` file** (use `.env.example` as a reference if present) and set the following variables:

   ```bash
   MONGODB_URI=mongodb://localhost:27017/carebridge-md
   PORT=3000
   JWT_SECRET=your_jwt_secret
   VIDEOSDK_API_KEY=your_videosdk_api_key
   VIDEOSDK_SECRET_KEY=your_videosdk_secret
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

   The API will start on the configured `PORT` (default 3000) and will automatically connect to MongoDB and initialise Socket.IO.

### Frontend setup (Doctor & Patient)

The doctor and patient applications are separate; you can run one or both depending on your role.

1. **Doctor app**:

   ```bash
   cd CareBridge/frontend/Doctor
   npm install
   npm run dev
   ```

   The doctor dashboard will start at `http://localhost:5173` (or another Vite‑assigned port).  Set up a `.env` file if the app uses environment variables (e.g., `VITE_API_URL` for backend base URL).

2. **Patient app**:

   ```bash
   cd CareBridge/frontend/Patient
   npm install
   npm run dev
   ```

   The patient portal will start at `http://localhost:5174` (or another Vite port).  Similarly, create a `.env` file to configure API endpoints.

3. **Shared modules**: if you modify the `shared-modules` package, rebuild or reinstall it in both apps.

### Building for production

For each application (backend, Doctor, Patient), run the appropriate build script:

```bash
# Backend build (compiles TypeScript)
cd backend && npm run build

# Doctor app build
cd frontend/Doctor && npm run build

# Patient app build
cd frontend/Patient && npm run build
```

Built front‑end assets can then be served via a static hosting service or integrated with the backend.

## Environment variables

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string (e.g., `mongodb://localhost:27017/carebridge-md`) |
| `PORT` | Port for the Express server (default `3000`)|
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `VIDEOSDK_API_KEY` | API key from VideoSDK for meeting rooms|
| `VIDEOSDK_SECRET_KEY` | Secret key from VideoSDK used to sign JWT tokens|
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | AWS credentials for file uploads (if using S3 in the doctor app) |
| `VITE_API_URL` | (Frontend) base URL for the backend API |



## Contributing

1. **Fork** the repository and create a feature branch.
2. **Commit** your changes with clear messages.
3. **Push** to your fork and create a **pull request**.
4. For major features or design changes, please open an issue for discussion first.

## Contributors

This project was developed by the following team members:

- **Dhruva Patil**
- **Mohammed Hashim Ihthisham ul Haq**
- **Jeonghyeon Lee**
- **Shubhang Tiwari**
- **Manpinder Singh**

## Security Analysis

### OWASP ZAP Security Report

A comprehensive security analysis was performed using OWASP ZAP (Zed Attack Proxy) to identify potential vulnerabilities
in the CareBridge application. The analysis covered various security aspects including:

- Cross-Site Scripting (XSS)
- SQL Injection
- Authentication Issues
- Session Management
- Access Control
- Input Validation
- Security Headers
- SSL/TLS Issues

#### Summary Report Screenshot

![OWASP ZAP Report Summary](path_to_report_screenshot.png)

#### Detailed Analysis

For a complete detailed analysis, you can view the full HTML report here:

[Complete OWASP ZAP Security Report - Before](https://carebridge-assets.s3.ca-central-1.amazonaws.com/reports/Initial-CareBridge-.html)

[Complete OWASP ZAP Security Report - After](https://carebridge-assets.s3.ca-central-1.amazonaws.com/reports/Final-CareBridge-ZAP-.html)

## Lighthouse Performance Report

A comprehensive performance analysis was conducted using Chrome's Lighthouse tool, evaluating various aspects of the
application's performance and accessibility. The results were impressive across all measured metrics:

- **Accessibility**: 13/15 - Excellent accessibility features and compliance
- **Performance**: 4/4 - Optimal loading and runtime performance
- **Best Practices**: 5/5 - Following all recommended web development practices
- **SEO**: 4/5 - Strong search engine optimization implementation


1. [Report 1](https://carebridge-assets.s3.ca-central-1.amazonaws.com/reports/1.png)
2. [Report 2](https://carebridge-assets.s3.ca-central-1.amazonaws.com/reports/2.png)
3. [Report 3](https://carebridge-assets.s3.ca-central-1.amazonaws.com/reports/3.png)


## License

This repository does not currently include a license file.  Unless otherwise specified by the project maintainers, all rights are reserved.  Please contact the contributors if you wish to use any part of this project.
