import {CreditCard, Stethoscope} from "lucide-react"
import {Badge} from "./avatar/badge"
import {useNavigate} from "react-router-dom";

interface Patient {
    id: number
    name: string
    mobile: string
    email: string
    photo: string
    paymentStatus: string
}


export default function PatientsMobileCards({patients}) {

    const navigate = useNavigate();

    const handlePatientClick = (patientId: string) => {
        navigate(`/a/patientsInfo/${patientId}`);
    }

    const handleOperationClick = (e: React.MouseEvent, operation: string) => {
        e.stopPropagation()
        console.log(`${operation} clicked`)
    }

    return (<>
        <style>{`
        .patient-card {
          cursor: pointer;
          transition: all 0.3s ease-in-out;
        }

        .patient-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-color: rgba(59, 130, 246, 0.3);
          background-color: rgba(59, 130, 246, 0.02);
        }

        .patient-card:active {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .operation-button {
          transition: all 0.2s ease-in-out;
        }

        .operation-button:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }
      `}</style>

        <div className="md:hidden p-4 space-y-4">
            {patients.map((patient) => (<div
                key={patient.id}
                className="patient-card bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                onClick={() => handlePatientClick(patient.id)}
            >
                <div className="flex items-start gap-4 mb-4">
                    {/*<Avatar className="h-12 w-12 ring-2 ring-gray-100">*/}
                    {/*    <AvatarImage*/}
                    {/*        src={patient.photo || `https://images.unsplash.com/photo-${1500000000000 + patient.id}?w=150&h=150&fit=crop&crop=face`}*/}
                    {/*        className="h-12 w-12"*/}
                    {/*        alt={patient.name}*/}
                    {/*    />*/}
                    {/*    <AvatarFallback*/}
                    {/*        className="text-white font-semibold"*/}
                    {/*        style={{background: "linear-gradient(135deg, #60a5fa, var(--color-primary))"}}*/}
                    {/*    >*/}
                    {/*        {patient.name.charAt(0)}*/}
                    {/*    </AvatarFallback>*/}
                    {/*</Avatar>*/}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{patient.name}</h4>
                        <Badge
                            variant={patient.paymentStatus === "Paid" ? "secondary" : "destructive"}
                            className={patient.paymentStatus === "Paid" ? "bg-gray-100 text-gray-700 hover:bg-gray-100 font-semibold px-3 py-1 rounded-lg text-xs" : "bg-red-50 text-red-700 hover:bg-red-50 font-semibold px-3 py-1 rounded-lg border border-red-200 text-xs"}
                        >
                            {patient.paymentStatus}
                        </Badge>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                                <span
                                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile</span>
                        <p className="text-sm text-gray-900 mt-1">{patient.mobile}</p>
                    </div>

                    <div>
                                <span
                                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</span>
                        <p className="text-sm text-gray-900 mt-1 break-all">{patient.email}</p>
                    </div>

                    <div>
                                <span
                                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Operations</span>
                        <div className="flex items-center gap-2 mt-2">
                            <div
                                className="operation-button p-2 rounded-lg border cursor-pointer hover:bg-blue-100"
                                style={{
                                    backgroundColor: "rgba(59, 130, 246, 0.1)", borderColor: "rgba(59, 130, 246, 0.2)"
                                }}
                                onClick={(e) => handleOperationClick(e, 'stethoscope')}
                            >
                                <Stethoscope size={14} style={{color: "var(--color-primary)"}}/>
                            </div>
                            <div
                                className="operation-button p-2 rounded-lg border cursor-pointer hover:bg-blue-100"
                                style={{
                                    backgroundColor: "rgba(59, 130, 246, 0.1)", borderColor: "rgba(59, 130, 246, 0.2)"
                                }}
                                onClick={(e) => handleOperationClick(e, 'payment')}
                            >
                                <CreditCard size={14} style={{color: "var(--color-primary)"}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>))}
        </div>
    </>)
}
