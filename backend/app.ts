import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import helmet from 'helmet';
import * as http from 'node:http';
import { Server as SocketIOServer } from 'socket.io';

import authRoutes from './routes/auth.routes.ts';
import appointmentRoutes from './routes/appointment.route.ts';
import doctorRoutes from './routes/doctor.routes.ts';
import documentRoutes from './routes/document.routes.ts';
import meetingRoutes from './routes/meeting.route.ts';
import patientRoutes from './routes/patient.routes.ts';
import intakeformRoutes from './routes/intakeform.routes.ts';
import prescriptionRoutes from './routes/prescription.routes.ts';
import healthRecordsRoutes from './routes/health-records.routes.ts';
import fileRoutes from './routes/file.routes.ts';
import bioMarkerRoutes from './routes/bioMarker.routes.ts';
import chatRoutes from './routes/chat.routes.ts';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carebridge-md';

const allowedOrigins = (process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
  : ['https://app.yourdomain.com', 'https://admin.yourdomain.com', 'http://localhost:5173']);

const cspScriptSrc = ["'self'"];
const cspStyleSrc  = ["'self'"];
const cspImgSrc    = ["'self'", 'data:'];
const cspFontSrc   = ["'self'"];
const cspConnectSrc= ["'self'"];

const app = express();
const server = http.createServer(app);

app.disable('x-powered-by');

app.use(helmet.noSniff());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.referrerPolicy({ policy: 'no-referrer-when-downgrade' }));
app.use(helmet.contentSecurityPolicy({
  useDefaults: false,
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: cspScriptSrc,
    styleSrc:  cspStyleSrc,
    imgSrc:    cspImgSrc,
    fontSrc:   cspFontSrc,
    connectSrc:cspConnectSrc,
    objectSrc: ["'none'"],
    baseUri:   ["'self'"],
    frameAncestors: ["'none'"],
    upgradeInsecureRequests: []
  }
}));
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));
}
app.use((_, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(express.json());

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  maxAge: 600
};
app.use(cors(corsOptions));

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Middleware to parse JSON requests
app.use(express.json());

// CORS middleware
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

// MongoDB connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (_req, res) => {
  res.type('text/plain').send('CareBridge MD Backend');
});

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/documents', documentRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/intake-forms', intakeformRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/bio', bioMarkerRoutes);
app.use('/api/chat', chatRoutes);

// HealthRecords routes
app.use('/api/health-records', healthRecordsRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
