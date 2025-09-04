import {useState} from "react"
import PatientsHeader from "../components/patients-header"
import PatientsTable from "../components/patients-table"
import PatientsMobileCards from "../components/patients-mobile-cards"
import "../../a/components/AElement.css"
import {DoctorService} from "../../../../../shared-modules/src/api/doctor.service.ts";
import {useQuery} from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';


export interface Patient {
    _id: number
    firstName: string
    lastName: string
    gender: string
    dateOfBirth: string
    phone: string
    email: string
    patientId: string
    paymentStatus: "PAID" | "PENDING"
}


export default function PatientsList() {
    const [patients, setPatients] = useState<Array<Patient>>([])
    const baseURL = "https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api";
    const api = new DoctorService(baseURL);


    const fetchData = async () => {
        await api.getMyPatientList().then((res) => {
            const patientList: Array<Patient> = [];
            res.data.forEach((item) => {
                item.paymentStatus = "Paid"
                const {_id, patientId, gender, dateOfBirth, lastName, firstName, phone, email} = item;

                patientList.push({
                    _id, patientId, gender, dateOfBirth, lastName, firstName, phone, email, paymentStatus: "PAID"
                })
            });
            setPatients(patientList);
        })
    }
    const {isPending} = useQuery({
        queryKey: ["patientList"], queryFn: fetchData,
    })
    // useEffect(() => {
    //
    //
    // }, []);


    const handlePatientAdded = (newPatient: Patient) => {
        setPatients((prev: Patient[]) => [...prev, newPatient])
    }

    return (<div className="dashboard-container">
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <PatientsHeader onPatientAdded={handlePatientAdded}/>
                {isPending ? (<div style={{height: "100%",padding:'20px'}}>
                    <Skeleton count={6} height={40}></Skeleton>
                </div>) : (<PatientsTable patients={patients}/>)}
                <PatientsMobileCards patients={patients}/>
            </div>
        </div>
    </div>);
}
