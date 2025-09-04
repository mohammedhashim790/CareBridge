import {useState} from "react";
import {Calendar, Camera, List, Mail, Phone, Pill,} from "lucide-react";
import {Button} from "./components/avatar/button";
import {Avatar, AvatarFallback, AvatarImage} from "./components/avatar/avatar";
import "./dashboard.css";
import type {PatientInformationResponseDto} from "shared-modules";
import {GetPatientAppointment} from "shared-modules";
import {getCurrentUser} from "shared-modules/src/user_auth/user_auth";
import {useNavigate} from "react-router-dom";
import InitialsAvatar from "../../components/avatar.tsx";
import {BioMarkers} from "./components/bio-markers/bio-markers.tsx";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import {useQuery} from "@tanstack/react-query";

const appointmentApi = new GetPatientAppointment("https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api");

export type Appointment = {
    _id: string; appointmentDate: string; status: string; token: string; doctorId: string; meetingId: {
        _id: string; token: string; scheduledTime: string;
    }; doctor: any
};

export type RawAppointment = Appointment & {
    patientId: string; createdAt: string; updatedAt: string; __v: number;
};

export default function PatientDashboard() {
    const user = getCurrentUser();
    const [patientInfo, setPatientInfo] = useState<PatientInformationResponseDto | null>(null);
    // const [upcomingAppointment, setUpcomingAppointment] = useState<Appointment | null | {}>(null);
    const patientId = user?.customId;
    const navigate = useNavigate();

    const handleJoin = () => {
        if (!upcomingAppointment) return;

        console.log(upcomingAppointment);
        navigate("/meeting", {
            state: {
                meetingId: upcomingAppointment.meetingId._id, token: upcomingAppointment.token,
            },
        });
    };

    const fetchAppointments = async () => {
        try {
            const data = await appointmentApi.getAllPatientAppointment(patientId);
            setPatientInfo(data);

            const now = new Date();
            const futureAppointments = (data.appointments as RawAppointment[]).filter((a) => new Date(a.appointmentDate) > now);

            const sortedAppointments = futureAppointments.sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

            const nextAppointment = sortedAppointments[0] ?? undefined;
            if (!nextAppointment) return undefined;

            return {
                _id: nextAppointment._id,
                appointmentDate: nextAppointment.appointmentDate,
                status: nextAppointment.status,
                token: nextAppointment.token,
                doctorId: nextAppointment.doctorId,
                meetingId: nextAppointment.meetingId,
                doctor: nextAppointment.doctor
            };
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    const {data, isPending} = useQuery({
        queryKey: ["appointments"], queryFn: fetchAppointments
    })


    let upcomingAppointment: Appointment = data;


    const dateObj = upcomingAppointment ? new Date(upcomingAppointment.appointmentDate) : null;
    const formattedDate = dateObj?.toLocaleDateString("en-CA", {
        day: "2-digit", month: "2-digit", year: "numeric",
    });
    const formattedTime = dateObj?.toLocaleTimeString([], {
        hour: "2-digit", minute: "2-digit",
    });

    return (<div className="p-4 md:p-6 lg:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            Hello, {user?.firstName} {user?.lastName}!
        </h2>

        <div className="mb-6">
            <div className="patient-profile-section">
                <div className="patient-card">
                    <div className="patient-header">
                        <div className="patient-avatar">
                            <InitialsAvatar firstName={user?.firstName ?? ""} lastName={user?.lastName ?? ""}
                                            name={undefined}/>
                        </div>
                        <div className="patient-basic-info">
                            <h3 className="patient-name">
                                {user?.firstName} {user?.lastName}
                            </h3>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <Phone size={14}/>
                                    <span>{user?.phone}</span>
                                </div>
                                <div className="contact-item">
                                    <Mail size={14}/>
                                    <span>{user?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <Pill size={20} className="text-orange-500"/>
                    <h3 className="text-lg font-semibold text-gray-800">My Medications</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                    <span className="text-left">Paracetamol</span>
                    <span className="text-right">Twice a day</span>
                    <span className="text-left">Sinerest</span>
                    <span className="text-right">Once a day</span>
                    <span className="text-left">Tusq</span>
                    <span className="text-right">Twice a day</span>
                </div>
            </div>

            <div className="card flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Camera size={20} className="text-gray-500"/>
                        <h3 className="text-lg font-semibold text-gray-800">Recent Bills</h3>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Dr. Drake"/>
                                <AvatarFallback>DD</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-gray-800">Dr. Drake</p>
                                <p className="text-xs text-gray-500">08/09/2025</p>
                            </div>
                        </div>
                        <span className="text-lg font-semibold text-gray-800">$210</span>
                    </div>
                </div>
                <Button
                    className="carebridge-primary-btn cursor-pointer w-full text-white font-semibold py-2 rounded-md">
                    Pay
                </Button>
            </div>

            <BioMarkers/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar size={20} className="text-gray-500"/>
                    <h3 className="text-lg font-semibold text-gray-800">Upcoming Appointment</h3>
                </div>
                <div className="flex items-center gap-3 mb-4">
                    {isPending ? (<>
                        <Skeleton circle={true} height={80} width={80}/>
                        <div className="flex-1">
                            <Skeleton/>
                            <Skeleton/>
                        </div>
                    </>) : (<>
                        {!upcomingAppointment ? (<>
                            You're all caught up! No appointments scheduled.
                        </>) : (<><InitialsAvatar firstName={upcomingAppointment.doctor.firstName}
                                                  lastName={upcomingAppointment.doctor.lastName} name={null}/>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">Dr. {upcomingAppointment.doctor.firstName + " " + upcomingAppointment.doctor.lastName}</p>
                                <p className="text-blue-600 text-sm font-medium">Physician</p>
                            </div>
                        </>)}
                    </>)}
                </div>
                {isPending ? (<>
                    <Skeleton/>
                    <Skeleton/>
                    <Skeleton/>
                </>) : (<>
                    {!upcomingAppointment ? (<>
                    </>) : (<>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4 text-sm">
                            <div>
                                <p className="font-semibold text-gray-600 mb-1">Date</p>
                                <p className="text-gray-800">{formattedDate}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 mb-1">Time</p>
                                <p className="text-gray-800">{formattedTime}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 mb-1">Location</p>
                                <p className="text-gray-800">{patientInfo?.patient.address.street}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleJoin}
                                    className="carebridge-primary-btn cursor-pointer flex-1 text-white font-semibold py-2 rounded-md">
                                Join
                            </Button>
                            <Button
                                variant="outline"
                                className="carebridge-outline-btn cursor-pointer flex-1 font-semibold py-2 rounded-md bg-transparent"
                            >
                                Cancel
                            </Button>
                        </div>
                    </>)}
                </>)}
            </div>

            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <List size={20} className="text-gray-500"/>
                    <h3 className="text-lg font-semibold text-gray-800">Recent Updates</h3>
                </div>
                <div className="space-y-4 overflow-y-auto max-h-[200px] scrollable-container pr-2 recent_updates">
                    You're all caught up! No Updates yet..
                </div>
            </div>
        </div>
    </div>);
}
