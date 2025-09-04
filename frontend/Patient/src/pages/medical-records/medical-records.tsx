import {useEffect, useState} from "react"
import {ChevronDown, Download, Eye, File, FileText, ImageIcon, Printer} from "lucide-react"
import "./medical-records.css"
import {FileService} from "../../../../shared-modules/src/api/file.service.ts";
import {getCurrentUser} from "shared-modules/src/user_auth/user_auth";


export interface IFile {
    "_id": "688834d613f86c19f7044c41",
    "name": "DCNYC25-7JYEV-1-mobile_pdf.pdf",
    "bucket": "carebridge-assets",
    "key": "documents/17537568815233507513763076.045.pdf",
    "patientId": "6887afd4517fe54521acbee8",
    "doctorId": "6887ad274595b6f277eda72e",
    "note": "Test Report",
    "fileType": "Surgical Report",
    "createdAt": "2025-07-29T02:41:26.857Z",
    "updatedAt": "2025-07-29T02:41:26.857Z",
    "__v": 0
}

const filterOptions = [{value: "all", label: "All Records"}, {
    value: "history", label: "History and Physical"
}, {value: "cardiology", label: "Cardiology"}, {value: "radiology", label: "Radiology"},]

const MedicalRecords = () => {
    const [selectedRecord, setSelectedRecord] = useState<IFile>()
    const [filterBy, setFilterBy] = useState("all")
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isMobileViewerOpen, setIsMobileViewerOpen] = useState(false);

    const user = getCurrentUser();

    const [files, setFiles] = useState<{ files: Array<IFile> }>({files: []});


    const filteredRecords = files.files.filter((record) => {
        if (filterBy === "all") return true
        // if (filterBy === "history") return record.noteType.includes("History")
        // if (filterBy === "cardiology") return record.noteType.includes("Cardiology")
        // if (filterBy === "radiology") return record.noteType.includes("Radiology")
        return true
    })

    const handleRecordClick = (record: any) => {
        setSelectedRecord(record)
        setIsMobileViewerOpen(true)
    }

    const handleDownload = (record: any, e: any) => {
        e.stopPropagation()
        // Simulate download
        const link = document.createElement("a")
        link.href = record.fileUrl
        link.download = record.fileName
        link.click()
    }

    const handlePrint = (_: any, e: any) => {
        e.stopPropagation()
        window.print()
    }
    const baseURL = "https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api";


    const getFiles = async (patientId: string) => {
        const api = new FileService(baseURL);
        return api.getFilesByPatient(patientId);
    }

    useEffect(() => {
        getFiles(user.id).then((files) => {
            debugger;
            setFiles(files);
        });
    }, []);

    const getFileIcon = (fileType: any) => {
        switch (fileType) {
            case "pdf":
                return <FileText size={16} className="file-icon pdf"/>
            case "jpeg":
            case "png":
                return <ImageIcon size={16} className="file-icon image"/>
            default:
                return <File size={16} className="file-icon default"/>
        }
    }

    const generateFileUrl = (key: string) => {
        return `https://carebridge-assets.s3.amazonaws.com/${key}`
    }

    const renderDocumentViewer = () => {
        if (!selectedRecord) {
            return (<div className="no-document">
                <FileText size={48} className="no-document-icon"/>
                <p>Select a document to view</p>
            </div>)
        }

        if (selectedRecord.key.includes(".jpeg") || selectedRecord.key.includes(".png") || selectedRecord.key.includes(".jpg")) {
            return (<div className="image-viewer">
                <img
                    src={generateFileUrl(selectedRecord.key)}
                    alt={selectedRecord.name}
                    className="document-image"
                />
            </div>)
        }

        return (<embed src={generateFileUrl(selectedRecord.key)} type="application/pdf" className="document-iframe"
                       title={selectedRecord.name}/>)
    }

    return (<div className="medical-records-container">
        {/* Header */}
        <header className="records-header">
            <h1 className="records-title">Medical Records</h1>
            <div className="filter-container">
                <span className="filter-label">Filter by</span>
                <div className="filter-dropdown">
                    <button className="filter-button" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                        {filterOptions.find((opt) => opt.value === filterBy)?.label}
                        <ChevronDown size={16} className={`filter-chevron ${isFilterOpen ? "open" : ""}`}/>
                    </button>
                    {isFilterOpen && (<div className="filter-options">
                        {filterOptions.map((option) => (<button
                            key={option.value}
                            className={`filter-option ${filterBy === option.value ? "active" : ""}`}
                            onClick={() => {
                                setFilterBy(option.value)
                                setIsFilterOpen(false)
                            }}
                        >
                            {option.label}
                        </button>))}
                    </div>)}
                </div>
            </div>
        </header>

        {/* Main Content */}
        <div className="records-content">
            <div className={`records-list-panel ${isMobileViewerOpen ? "mobile-hidden" : ""}`}>
                <div className="records-table-container">
                    <table className="records-table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Note</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRecords.map((record) => (<tr
                            key={record._id}
                            className={`record-row ${selectedRecord?._id === record._id ? "selected" : ""}`}
                            onClick={() => handleRecordClick(record)}
                        >
                            <td className="date-cell">{new Date(record.createdAt).toLocaleDateString()}</td>
                            <td className="name-cell">
                                <div className="name-with-icon">
                                    {getFileIcon(record.key.split(".").pop() ?? "")}
                                    {record.fileType}
                                </div>
                            </td>
                            <td className="note-type-cell">{record.note}</td>
                            <td className="updated-cell">{new Date(record.updatedAt).toLocaleDateString()}</td>
                            <td className="actions-cell">
                                <div className="action-buttons">
                                    <button
                                        className="action-btn view-btn"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRecordClick(record)
                                        }}
                                        title="View"
                                    >
                                        <Eye size={16}/>
                                    </button>
                                    <button
                                        className="action-btn download-btn"
                                        onClick={(e) => handleDownload(record, e)}
                                        title="Download"
                                    >
                                        <Download size={16}/>
                                    </button>
                                    <button className="action-btn print-btn"
                                            onClick={(e) => handlePrint(record, e)} title="Print">
                                        <Printer size={16}/>
                                    </button>
                                </div>
                            </td>
                        </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right Panel - Document Viewer */}
            <div className={`document-viewer-panel ${isMobileViewerOpen ? "mobile-visible" : ""}`}>
                {isMobileViewerOpen && (<div className="mobile-viewer-header">
                    <button className="back-button" onClick={() => setIsMobileViewerOpen(false)}>
                        ← Back to List
                    </button>
                    <h3 className="viewer-title">{selectedRecord?.name}</h3>
                </div>)}
                <div className="document-viewer">{renderDocumentViewer()}</div>
            </div>
        </div>
    </div>)
}

export default MedicalRecords
