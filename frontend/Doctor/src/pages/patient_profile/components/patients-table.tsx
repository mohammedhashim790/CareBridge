import {Badge} from "./avatar/badge"
import {useNavigate} from "react-router-dom"
import "./patients-table.css"
import type {Patient} from "../patient_list/PatientsList.tsx";
import InitialsAvatar from "../../../components/avatar/avatar.tsx";


export default function PatientsTable(props: { patients: Patient[] }) {

    const navigate = useNavigate();

    const handlePatientClick = (patientId: string) => {
        navigate(`/a/patientsInfo/${patientId}`);
    }

    const handleOperationClick = (e: React.MouseEvent, operation: string) => {
        e.stopPropagation()
        console.log(`${operation} clicked`)
    }

    return (<>
        <div className="hidden md:block overflow-x-auto">
            {props.patients.length === 0 && (<div className="flex flex-col items-center justify-center h-full"
                                                  style={{minHeight: "300px", padding: "1rem"}}>
                <div className="text-gray-500 text-lg font-semibold">No patients found</div>
                <div className="text-gray-500 text-sm font-medium">
                    Add a patient to see them here or if you have scheduled an appointment, you can see them here.
                </div>
            </div>)}
            {props.patients.length > 0 && (<table className="w-full table-auto" style={{cursor: "pointer"}}>
                    <thead>
                    <tr className="border-b border-gray-100 bg-white">
                        <th className="px-4 lg:px-8 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wider">Patient
                            Profile
                        </th>
                        <th className="px-4 lg:px-8 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wider">Patient
                            name
                        </th>
                        <th className="px-4 lg:px-8 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wider">Mobile</th>
                        <th className="px-4 lg:px-8 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                        <th className="px-4 lg:px-8 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wider">Date
                            Of Birth
                        </th>
                        <th className="px-4 lg:px-8 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wider">Payment
                            Status
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                    {props.patients.map((patient) => (<tr
                        key={patient.patientId}
                        className="hover:bg-gray-50 transition"
                        onClick={() => handlePatientClick(patient.patientId)}
                    >
                        <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                            <InitialsAvatar firstName={patient.firstName} lastName={patient.lastName} size={50}
                                            name={undefined}></InitialsAvatar>
                        </td>
                        <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                            <div
                                className="text-sm lg:text-base font-semibold text-gray-900">{patient.firstName + " " + patient.lastName}</div>
                        </td>
                        <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                            <div className="text-xs lg:text-sm text-gray-600 font-medium">{patient.phone}</div>
                        </td>
                        <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                            <div className="text-xs lg:text-sm text-gray-600 font-medium">{patient.email}</div>
                        </td>
                        <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                            <div
                                className="text-xs lg:text-sm text-gray-600 font-medium">{new Date(patient.dateOfBirth).toLocaleDateString()}</div>
                        </td>

                        <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                            <Badge
                                variant={patient.paymentStatus === "PAID" ? "secondary" : "destructive"}
                                className={patient.paymentStatus === "PAID" ? "bg-gray-100 text-gray-700 hover:bg-gray-100 font-semibold px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm" : "bg-red-50 text-red-700 hover:bg-red-50 font-semibold px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg border border-red-200 text-xs lg:text-sm"}
                            >
                                {patient.paymentStatus}
                            </Badge>
                        </td>
                    </tr>))}
                    </tbody>
                </table>


            )}
        </div>
    </>)
}
