import {useState} from "react";
import {
    Calendar,
    Clock,
    Edit,
    FileArchive,
    FileText,
    Heart,
    Mail,
    NotepadText,
    Phone,
    Pill,
    PlusCircle,
    Shield,
    UserCheck,
} from "lucide-react";
import "./PatientInfo.css";
import {useDialog} from "../../utils/dialog/dialog.tsx";
import {PrescriptionForm} from "../../prescription/prescription.tsx";
import {PatientService} from "../../../../../shared-modules/src/api/patient.service.ts";
import {useParams} from "react-router-dom";
import {calculateAge, prettyAddress, prettyDate} from "../../utils/utils.ts";
import {Prescription} from "../../../../../shared-modules/src/api/prescription.service.ts";
import {PrescriptionGenerator} from "../../prescription/components/prescription-generator/prescription-generator.tsx";
import UploadFile from "../../prescription/components/upload-file/upload-file.tsx";
import {FileService} from "../../../../../shared-modules/src/api/file.service.ts";
import InitialsAvatar from "../../../components/avatar/avatar.tsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {BioMarkersService} from "../../../../../shared-modules/src/api/bio_markers.service.ts";
import {useQuery} from "@tanstack/react-query";
import type {PatientInformationResponseDto} from "shared-modules";
import {GetPatientAppointment} from "shared-modules";

export interface IBioMarkers {
    heartRate?: string;
    height?: string;
    weight?: number;
    bloodGroup?: string;
    allergies?: Array<string>;
    pastIllness?: string;
    patientId?: string;
}

export interface PatientInfo {
    address: {
        street: string; city: string; state: string; postalCode: string; country: string;
    };
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    patientId: string;
    __v: 0;
}

export default function PatientInfo() {
    const [activeTab, setActiveTab] = useState("upcoming");
    const baseURL = "https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api";
    const appointmentApi = new GetPatientAppointment(baseURL);
    const [files, setFiles] = useState<{ files: any }>({files: []});
    const {id} = useParams();
    const [patient, setPatient] = useState<PatientInfo>();
    const [prescriptions, setPrescriptions] = useState<{ prescriptions: any }>({
        prescriptions: [],
    });
    const [bioMarker, setBioMarker] = useState<IBioMarkers>({});
    const [pastVisits, setPastVisits] = useState<any[]>([]);
    const [upcomingVisits, setUpcomingVisits] = useState<any[]>([]);
    const {showDialog, closeDialog} = useDialog();

    const getPatientInfo = async () => {
        const api = new PatientService(baseURL);
        return await api.getPatient(id ?? "");
    };

    const getPrescriptions = async (patientId: string) => {
        const api = new Prescription(baseURL);
        return api.list(patientId);
    };

    const getFiles = async (patientId: string) => {
        const api = new FileService(baseURL);
        return api.getFilesByPatient(patientId);
    };

    const fetchBioMarker = async (patientId: string) => {
        const api = new BioMarkersService(baseURL);
        const res = await api.getBioMarkerByPatientId(patientId);
        return res.result;
    };

    const fetchAppointments = async (patientId: string) => {
        const dto: PatientInformationResponseDto = await appointmentApi.getAllPatientAppointment(patientId);
        const all = dto.appointments ?? [];
        const now = new Date();
        const past = all
            .filter((a) => new Date(a.appointmentDate) < now)
            .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
        const upcoming = all
            .filter((a) => new Date(a.appointmentDate) >= now)
            .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
        const mapVisit = (a) => {
            const dt = new Date(a.appointmentDate);
            return {
                id: a._id,
                date: dt.toLocaleDateString(undefined, {
                    day: "2-digit", month: "short", year: "numeric",
                }),
                time: dt.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}),
                service: a.doctor?.specialization ?? "Consultation",
                doctor: `${a.doctor?.firstName ?? ""} ${a.doctor?.lastName ?? ""}`.trim(),
                status: a.status,
            };
        };
        setPastVisits(past.map(mapVisit));
        setUpcomingVisits(upcoming.map(mapVisit));
    };

    const fetchData = async () => {
        const p = await getPatientInfo();
        setPatient(p);
        await Promise.all([fetchAppointments(p.patientId), getPrescriptions(p._id).then((r) => setPrescriptions(r)), getFiles(p._id).then((r) => setFiles(r)), fetchBioMarker(p._id).then((r) => setBioMarker(r)),]);
    };

    const {isPending} = useQuery({queryKey: ["patient"], queryFn: fetchData});

    const showPrescriptionForm = () => {
        showDialog({
            template: PrescriptionForm, params: {
                isBarrierDismissible: true, onClose: closeDialog, background: "rgba(0,0,0,0.5)",
            }, componentProps: {patient},
        });
    };

    const showPrescription = (prescription) => {
        showDialog({
            template: PrescriptionGenerator, params: {
                isBarrierDismissible: true, onClose: closeDialog, background: "rgba(0,0,0,0.5)",
            }, componentProps: {prescription},
        });
    };

    const showUploadDialog = () => {
        showDialog({
            template: UploadFile, params: {
                isBarrierDismissible: true, onClose: closeDialog, background: "rgba(0,0,0,0.5)",
            }, componentProps: {patient},
        });
    };

    const showFile = (file) => {
        showDialog({
            template: ({file}) => (<div style={{width: "100%", height: "100%"}}>
                    <iframe
                        style={{width: "50vw", height: "50vh"}}
                        src={`https://carebridge-assets.s3.ca-central-1.amazonaws.com/${file.key}`}
                    />
                </div>), params: {
                isBarrierDismissible: true, onClose: closeDialog, background: "rgba(0,0,0,0.5)",
            }, componentProps: {file},
        });
    };

    return (<div className="content-wrapper">
            <div className="page-header">
                <div className="page-title-section">
                    <h2 className="page-title">Patient Profile</h2>
                </div>
            </div>

            <div className="patient-profile-section">
                <div className="patient-card">
                    <div className="patient-header">
                        <div className="patient-avatar">
                            {isPending ? (<Skeleton width={90} height={90}/>) : (<InitialsAvatar
                                    firstName={patient.firstName}
                                    lastName={patient.lastName}
                                    name={`${patient.firstName} ${patient.lastName}`}
                                    size={100}
                                />)}
                        </div>
                        <div className="patient-basic-info">
                            {isPending ? (<Skeleton width={200} height={30}/>) : (<h3 className="patient-name">
                                    {patient.firstName} {patient.lastName}
                                </h3>)}
                            <div className="contact-info">
                                <div className="contact-item">
                                    {isPending ? (<Skeleton width={14} height={14}/>) : (<>
                                            <Phone size={14}/>
                                            <span>{patient.phone}</span>
                                        </>)}
                                </div>
                                <div className="contact-item">
                                    {isPending ? (<Skeleton width={14} height={14}/>) : (<>
                                            <Mail size={14}/>
                                            <span>{patient.email}</span>
                                        </>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content-grid">
                <div className="info-card general-info">
                    <h4 className="card-title">General Information</h4>
                    <div className="info-grid">
                        <div className="info-item">
                            {isPending ? (<Skeleton count={2} width={140} height={20}/>) : (<>
                                    <span className="info-label">Date of birth:</span>
                                    <span className="info-value">
                    {prettyDate(patient.dateOfBirth)}
                  </span>
                                </>)}
                        </div>
                        <div className="info-item">
                            {isPending ? (<Skeleton count={2} width={140} height={20}/>) : (<>
                                    <span className="info-label">Age:</span>
                                    <span className="info-value">
                    {calculateAge(patient.dateOfBirth)}
                  </span>
                                </>)}
                        </div>
                        <div className="info-item">
                            {isPending ? (<Skeleton count={2} width={140} height={20}/>) : (<>
                                    <span className="info-label">Gender:</span>
                                    <span className="info-value">{patient.gender}</span>
                                </>)}
                        </div>
                        <div className="info-item full-width">
                            {isPending ? (<Skeleton count={2} width={140} height={20}/>) : (<>
                                    <span className="info-label">Address:</span>
                                    <span className="info-value">
                    {prettyAddress(patient.address)}
                  </span>
                                </>)}
                        </div>
                        <div className="info-item">
                            {isPending ? (<Skeleton count={2} width={140} height={20}/>) : (<>
                                    <span className="info-label">Emergency Contact:</span>
                                    <span className="info-value">N/A</span>
                                </>)}
                        </div>
                    </div>
                </div>

                <div className="info-card medical-info">
                    <h4 className="card-title">Medical Information</h4>
                    <div className="medical-grid">
                        <div className="medical-item">
                            {isPending ? (<Skeleton count={2} width={140} height={20}/>) : (<>
                                    <div className="medical-icon">
                                        <Shield size={16}/>
                                    </div>
                                    <div className="medical-content">
                                        <span className="medical-label">Allergies:</span>
                                        <span className="medical-value">
                      {(bioMarker?.allergies ?? ["None"])
                          .map((item) => item[0].toUpperCase() + item.slice(1).toLowerCase())
                          .join(", ")}
                    </span>
                                    </div>
                                </>)}
                        </div>
                        <div className="medical-item">
                            {isPending ? (<Skeleton count={2} width={140} height={20}/>) : (<>
                                    <div className="medical-icon">
                                        <Pill size={16}/>
                                    </div>
                                    <div className="medical-content">
                                        <span className="medical-label">Height:</span>
                                        <span className="medical-value">
                      {bioMarker?.height ?? "N/A"}
                    </span>
                                    </div>
                                </>)}
                        </div>
                        <div className="medical-item">
                            {isPending ? (<Skeleton count={2} width={140} height={20}/>) : (<>
                                    <div className="medical-icon">
                                        <Pill size={16}/>
                                    </div>
                                    <div className="medical-content">
                                        <span className="medical-label">Weight:</span>
                                        <span className="medical-value">
                      {bioMarker?.weight ?? "N/A"}
                    </span>
                                    </div>
                                </>)}
                        </div>
                        <div className="medical-item">
                            {isPending ? (<Skeleton count={2} width={140} height={20}/>) : (<>
                                    <div className="medical-icon">
                                        <Heart size={16}/>
                                    </div>
                                    <div className="medical-content">
                                        <span className="medical-label">Blood Group:</span>
                                        <span className="medical-value">
                      {bioMarker?.bloodGroup ?? "N/A"}
                    </span>
                                    </div>
                                </>)}
                        </div>
                        <div className="medical-item">
                            {isPending ? (<Skeleton count={2} width={140} height={20}/>) : (<>
                                    <div className="medical-icon">
                                        <FileText size={16}/>
                                    </div>
                                    <div className="medical-content">
                                        <span className="medical-label">Heart Rate:</span>
                                        <span className="medical-value">
                      {bioMarker?.heartRate ?? "N/A"}
                    </span>
                                    </div>
                                </>)}
                        </div>
                        <div className="medical-item">
                            {isPending ? (<Skeleton count={2} width={140} height={20}/>) : (<>
                                    <div className="medical-icon">
                                        <UserCheck size={16}/>
                                    </div>
                                    <div className="medical-content">
                                        <span className="medical-label">Past Illness:</span>
                                        <span className="medical-value">
                      {bioMarker?.pastIllness ?? "N/A"}
                    </span>
                                    </div>
                                </>)}
                        </div>
                    </div>
                </div>

                <div className="info-card tabbed-card">
                    <div className="tab-header">
                        <button
                            className={`tab-button ${activeTab === "upcoming" ? "active" : ""}`}
                            onClick={() => setActiveTab("upcoming")}
                        >
                            Upcoming Visits ({upcomingVisits.length})
                        </button>
                        <button
                            className={`tab-button ${activeTab === "past" ? "active" : ""}`}
                            onClick={() => setActiveTab("past")}
                        >
                            Past Visits ({pastVisits.length})
                        </button>
                        <button
                            className={`tab-button ${activeTab === "prescriptions" ? "active" : ""}`}
                            onClick={() => setActiveTab("prescriptions")}
                        >
                            Prescriptions
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === "upcoming" && (<div className="visits-content">
                                <div className="visits-list">
                                    {upcomingVisits.map((visit) => (<div key={visit.id} className="visit-item">
                                            <div className="visit-icon">
                                                <Calendar size={20}/>
                                            </div>
                                            <div className="visit-details">
                                                <div className="visit-service">{visit.service}</div>
                                                <div className="visit-datetime">
                                                    {visit.date} • {visit.time}
                                                </div>
                                                <div className="visit-doctor">
                                                    Doctor: {visit.doctor}
                                                </div>
                                            </div>
                                        </div>))}
                                    {upcomingVisits.length === 0 && (<div className="no-prescriptions">
                                            <span>No upcoming visits</span>
                                        </div>)}
                                </div>
                            </div>)}

                        {activeTab === "past" && (<div className="visits-content">
                                <div className="visits-list">
                                    {pastVisits.map((visit) => (<div key={visit.id} className="visit-item">
                                            <div className="visit-icon">
                                                <Clock size={20}/>
                                            </div>
                                            <div className="visit-details">
                                                <div className="visit-service">{visit.service}</div>
                                                <div className="visit-datetime">
                                                    {visit.date} • {visit.time}
                                                </div>
                                                <div className="visit-doctor">
                                                    Doctor: {visit.doctor}
                                                </div>
                                            </div>
                                        </div>))}
                                    {pastVisits.length === 0 && (<div className="no-prescriptions">
                                            <span>No past visits</span>
                                        </div>)}
                                </div>
                            </div>)}

                        {activeTab === "prescriptions" && (<div className="prescription-content">
                                <div className="prescription-list">
                                    <button
                                        className="action-btn edit-btn"
                                        onClick={showPrescriptionForm}
                                    >
                                        <Edit size={16}/>
                                        <span>New Prescription</span>
                                    </button>
                                    {prescriptions.prescriptions.map((prescription) => (<div
                                            key={prescription._id}
                                            className="prescription-item"
                                            onClick={() => showPrescription(prescription)}
                                            style={{cursor: "pointer"}}
                                        >
                                            <div className="prescription-icon">
                                                <Pill size={20}/>
                                            </div>
                                            <div className="prescription-details">
                                                <div className="prescription-name">
                                                    {new Date(prescription.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="prescription-dosage">
                                                    {prescription.medications[0].name}
                                                    {prescription.medications.length - 1 > 0 ? ` & ${prescription.medications.length - 1} others` : ""}
                                                </div>
                                            </div>
                                        </div>))}
                                    {prescriptions.prescriptions.length === 0 && (<div className="no-prescriptions">
                                            <div className="no-prescriptions-icon">
                                                <NotepadText size={20}/>
                                                <span>
                          No Prescriptions for the patient.
                          <a onClick={showPrescriptionForm}> Create a new one</a>
                        </span>
                                            </div>
                                        </div>)}
                                </div>
                            </div>)}
                    </div>
                </div>

                <div className="info-card files-card">
          <span className="card-header">
            <h4 className="card-title">Medical Documents</h4>
            <button className="action-btn" onClick={showUploadDialog}>
              <PlusCircle size={16}/>
              <span>Upload File</span>
            </button>
          </span>
                    <div className="files-list">
                        {files.files.map((file, index) => (<div key={index} className="file-item">
                                <div className="file-info" onClick={() => showFile(file)}>
                  <span className="file-link">
                    <FileText size={20} color="var(--color-primary)"/>
                    <span className="file-name">{file.name}</span>
                  </span>
                                    <div className="file-details">
                    <span className="file-size">
                      {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                                    </div>
                                </div>
                            </div>))}
                        {files.files.length === 0 && (<div className="no-files-icon">
                                <FileArchive size={36}/>
                                <span>No files uploaded for this patient</span>
                            </div>)}
                    </div>
                </div>
            </div>
        </div>);
}
