import {useState} from "react"
import {Calendar, Download, FileText, Pill, Printer, Stethoscope, User} from "lucide-react"
import "./prescriptions.css"
import {Prescription} from "../../../../shared-modules/src/api/prescription.service.ts";
import {getCurrentUser} from "../../../../shared-modules/src/user_auth/user_auth.ts";
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from "react-loading-skeleton";
import {useQuery} from "@tanstack/react-query";

const PrescriptionManager = () => {
    const [selectedPrescription, setSelectedPrescription] = useState<any>()
    const [isMobileViewerOpen, setIsMobileViewerOpen] = useState(false);

    const baseURL = "https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api";
    const prescriptionService = new Prescription(baseURL);

    const user = getCurrentUser();

    const fetchPrescriptions = async () => {
        const res = await prescriptionService.list(user.id ?? "");
        return res;
    }


    const {data, isPending} = useQuery({
        queryKey: ["fetchPrescriptions"], queryFn: fetchPrescriptions
    });



    const handlePrescriptionClick = (prescription: any) => {
        setSelectedPrescription(prescription)
        setIsMobileViewerOpen(true)
    }

    const formatDate = (dateString: any) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
        })
    }

    const formatDateShort = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
        })
    }

    const handlePrint = () => {
        window.print()
    }

    return (<div className="prescription-manager-container">
        {/* Header */}
        <header className="prescription-header">
            <h1 className="prescription-title">Prescription Management</h1>
        </header>

        {/* Main Content */}
        <div className="prescription-content">
            {/* Left Panel - Prescription List */}
            <div className={`prescription-list-panel ${isMobileViewerOpen ? "mobile-hidden" : ""}`}>
                <div className="prescription-list">
                    {isPending ? (<>
                        <div
                            className={`prescription-card`}>
                            <div className="prescription-card-header">
                                <div className="prescription-icon">
                                    <Skeleton count={1} height={20}/>
                                </div>
                                <div className="prescription-number"><Skeleton count={1} width={200} height={20}/></div>
                            </div>
                            <Skeleton count={4} height={20}/>
                        </div>
                        <div
                            className={`prescription-card`}>
                            <div className="prescription-card-header">
                                <div className="prescription-icon">
                                    <Skeleton count={1} height={20}/>
                                </div>
                                <div className="prescription-number"><Skeleton count={1} width={200} height={20}/></div>
                            </div>
                            <Skeleton count={4} height={20}/>
                        </div>
                        <div
                            className={`prescription-card`}>
                            <div className="prescription-card-header">
                                <div className="prescription-icon">
                                    <Skeleton count={1} height={20}/>
                                </div>
                                <div className="prescription-number"><Skeleton count={1} width={200} height={20}/></div>
                            </div>
                            <Skeleton count={4} height={20}/>
                        </div>

                    </>) : (<>
                        {data.prescriptions.length === 0 && (<div className="no-prescription">
                            <FileText size={48} className="no-prescription-icon"/>
                            <p>No prescriptions found</p>

                        </div>)}
                        {data.prescriptions.map((prescription: any) => {

                            return (<div
                                key={prescription._id}
                                className={`prescription-card ${selectedPrescription?._id === prescription._id ? "selected" : ""}`}
                                onClick={() => handlePrescriptionClick(prescription)}
                            >
                                <div className="prescription-card-header">
                                    <div className="prescription-icon">
                                        <Pill size={20}/>
                                    </div>
                                    <div className="prescription-number">{prescription.prescriptionNumber}</div>
                                </div>

                                <div className="prescription-card-content">
                                    <div className="prescription-info">
                                        <div className="info-item">
                                            <User size={14}/>
                                            <span>{prescription.doctor.name}</span>
                                        </div>
                                        <div className="info-item">
                                            <Stethoscope size={14}/>
                                            <span>{prescription.doctor.specialization}</span>
                                        </div>
                                        <div className="info-item">
                                            <Calendar size={14}/>
                                            <span>{formatDateShort(prescription.createdAt)}</span>
                                        </div>
                                    </div>

                                    <div className="medication-count">
                                        {prescription.medications.length} medication{prescription.medications.length !== 1 ? "s" : ""}
                                    </div>
                                </div>
                            </div>);
                        })}
                    </>)
                    }
                </div>
            </div>

            {/* Right Panel - Prescription Pad */}
            <div className={`prescription-pad-panel ${isMobileViewerOpen ? "mobile-visible" : ""}`}>
                {isMobileViewerOpen && (<div className="mobile-viewer-header">
                    <button className="back-button" onClick={() => setIsMobileViewerOpen(false)}>
                        ← Back to List
                    </button>
                    <div className="viewer-actions">
                        <button className="action-btn print-btn" onClick={handlePrint} title="Print">
                            <Printer size={16}/>
                        </button>
                        <button className="action-btn" onClick={handlePrint}
                                title="Download PDF">
                            <Download size={16}/>
                        </button>
                    </div>
                </div>)}

                <div className="prescription-pad">
                    {selectedPrescription ? (<>
                        {/* Prescription Header */}
                        <div className="prescription-pad-header">
                            <div className="pad-title-section">
                                <h2 className="pad-main-title">PRESCRIPTION PAD</h2>
                                <div className="rx-symbol">
                                    <span className="rx-text">RX</span>
                                    <div className="file-icons">
                                        <div className="file-icon word-icon">W</div>
                                        <div className="file-icon pdf-icon">PDF</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Clinic Information */}
                        <div className="clinic-section">
                            <h3 className="clinic-name">{selectedPrescription.doctor.name}</h3>

                            <div className="clinic-info-grid">
                                <div className="clinic-info-left">
                                    <div className="info-row">
                                        <span>
                                            <p>
                                                Email: <b>{selectedPrescription.doctor.email}</b><br></br>
                                                Phone: <b>{selectedPrescription.doctor.phone}</b><br></br>
                                            </p>

                                        </span>
                                    </div>

                                </div>
                                <div className="clinic-info-right">
                                    <div className="info-row">
                                        <span>Date: {formatDate(selectedPrescription.createdAt)}</span>
                                    </div>
                                    <div className="info-row">
                                        <span>{selectedPrescription.doctor.email}</span>
                                    </div>
                                    <div className="info-row">
                                        <span>License No.: {selectedPrescription.doctor.licenseNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Patient Information */}
                        <div className="patient-section">
                            <h4 className="section-title">PATIENT INFORMATION</h4>
                            <div className="patient-info-grid">
                                <div className="patient-row">
                                    <div className="patient-field">
                                        <label>Patient Name</label>
                                        <div className="field-value">{selectedPrescription.patient.name}</div>
                                    </div>
                                    <div className="patient-field">
                                        <label>Date of Birth</label>
                                        <div
                                            className="field-value">{formatDateShort(selectedPrescription.patient.dateOfBirth)}</div>
                                    </div>
                                    <div className="patient-field">
                                        <label>Sex</label>
                                        <div className="field-value">{selectedPrescription.patient.gender}</div>
                                    </div>
                                </div>
                                <div className="patient-row">
                                    <div className="patient-field">
                                        <label>Phone Number</label>
                                        <div className="field-value">{selectedPrescription.patient.phone}</div>
                                    </div>
                                    <div className="patient-field wide">
                                        <label>Address</label>
                                        <div
                                            className="field-value">{selectedPrescription.patient.address}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Prescription Details */}
                        <div className="prescription-details-section">
                            <h4 className="section-title">PRESCRIPTION DETAILS</h4>
                            <table className="prescription-table">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Medication Name</th>
                                    <th>Strength</th>
                                    <th>Dosage Instructions</th>
                                    <th>Quantity</th>
                                    <th>Refills</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedPrescription.medications.map((medication: any, index: any) => (
                                    <tr key={medication._id}>
                                        <td>{index + 1}</td>
                                        <td>{medication.name}</td>
                                        <td>{medication.dosage}</td>
                                        <td>{medication.frequency}</td>
                                        <td>{medication.quantity}</td>
                                        <td>{medication.refills}</td>
                                    </tr>))}
                                {/* Empty rows to match the design */}
                                {Array.from({length: Math.max(0, 7 - selectedPrescription.medications.length)}, (_, index) => (
                                    <tr key={`empty-${index}`}>
                                        <td>{selectedPrescription.medications.length + index + 1}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>))}
                                </tbody>
                            </table>
                        </div>

                        {/* Notes Section */}
                        {selectedPrescription.notes && (<div className="notes-section">
                            <h4 className="section-title">NOTES</h4>
                            <div className="notes-content">{selectedPrescription.notes}</div>
                        </div>)}

                        {/* Desktop Actions */}
                        <div className="desktop-actions">
                            <button className="action-btn print-btn" onClick={handlePrint}>
                                <Printer size={16}/>
                                Print
                            </button>
                            <button className="action-btn download-btn" onClick={handlePrint}>
                                <Download size={16}/>
                                Download PDF
                            </button>
                        </div>
                    </>) : (<div className="no-prescription">
                        <FileText size={48} className="no-prescription-icon"/>
                        <p>Select a prescription to view</p>
                    </div>)}
                </div>
            </div>
        </div>
    </div>)
}

export default PrescriptionManager
