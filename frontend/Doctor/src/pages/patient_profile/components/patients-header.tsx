import {Filter, Plus, X} from "lucide-react"
import {useState} from "react"
import {Button} from "./avatar/button"
import PatientRegister from "../patient_register/patient-register.tsx"

export default function PatientsHeader({onPatientAdded}:any) {
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    const openPopup = () => setIsPopupOpen(true)
    const closePopup = () => setIsPopupOpen(false)

    const handlePatientAdded = (newPatient:any) => {
        if (onPatientAdded) {
            onPatientAdded(newPatient)
        }
        closePopup()
    }

    return (<>
            <style>{`
        .carebridge-primary-btn {
          background-color: var(--color-primary);
        }
        
        .carebridge-primary-btn:hover {
          background-color: var(--color-hover);
        }
        
        .carebridge-outline-btn {
          border-color: var(--color-primary);
          color: var(--color-primary);
          border-width: 2px;
        }
        
        .carebridge-outline-btn:hover {
          background-color: #eff6ff;
        }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
        }

        .popup-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          max-width: 90vw;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          width: 100%;
          max-width: 800px;
        }

        .popup-header {
          position: sticky;
          top: 0;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 16px 16px 0 0;
          z-index: 10;
        }

        .popup-close-btn {
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .popup-close-btn:hover {
          background: #e5e7eb;
        }

        @media (max-width: 640px) {
          .popup-overlay {
            padding: 0.5rem;
          }
          
          .popup-content {
            max-width: 100%;
            max-height: 100%;
            border-radius: 12px;
          }
          
          .popup-header {
            padding: 16px 20px;
            border-radius: 12px 12px 0 0;
          }
        }
      `}</style>

            <div
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-8 border-b border-gray-100 bg-gray-50/50 gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Patients</h3>
                    <Button
                        size="default"
                        className="carebridge-primary-btn text-white font-semibold px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg lg:rounded-xl shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md text-sm lg:text-base hover:opacity-90"
                        onClick={openPopup}
                    >
                        <Plus size={16} className="mr-2"/>
                        Add new
                    </Button>
                </div>
                <Button
                    variant="outline"
                    size="default"
                    className="carebridge-outline-btn bg-white font-semibold px-4 lg:px-6 py-2 cursor-pointer lg:py-2.5 rounded-lg lg:rounded-xl transition-all duration-200 text-sm lg:text-base"
                >
                    <Filter size={16} className="mr-2"/>
                    Filter
                </Button>
            </div>

            {isPopupOpen && (<div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <div className="popup-header">
                            <h2 className="text-xl font-semibold text-gray-900">Add New Patient</h2>
                            <button className="popup-close-btn" onClick={closePopup}>
                                <X size={16} className="text-gray-600"/>
                            </button>
                        </div>
                        <div className="p-6">
                            <PatientRegister onClose={closePopup} onPatientAdded={handlePatientAdded}/>
                        </div>
                    </div>
                </div>)}
        </>)
}
