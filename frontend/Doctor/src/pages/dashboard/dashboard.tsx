import {Calendar, Clock, Download, Edit, FileLock2, Mail, Phone, StickyNote, User, Video,} from "lucide-react";
import "./dashboard.css";
import {useEffect, useState} from "react";
import CalendarWidget from "./components/calendar/calendar.tsx";
import {useDialog} from "../utils/dialog/dialog.tsx";
import {PrescriptionForm} from "../prescription/prescription.tsx";
import type {CalendarEvent} from "./components/calendar/calendar_params.tsx";
import {getCurrentUser} from "../../../../shared-modules/src/user_auth/user_auth.ts";
import {AppointmentApi} from "shared-modules";
import {useNavigate} from "react-router-dom";
import InitialsAvatar from "../../components/avatar/avatar.tsx";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import {useQuery} from "@tanstack/react-query";

const Dashboard = () => {
    const appointmentApi = new AppointmentApi("https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api");
    const user = getCurrentUser()!;
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigate = useNavigate();

    const fetchAppointments = async () => {
        try {
            const response = await appointmentApi.getAppointments();
            setAppointments(response);
            console.log(response);
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        }
    };
    useEffect(() => {
        fetchAppointments();
    }, []);


    const {data, isPending} = useQuery({
        queryKey: ["appointments"], queryFn: fetchAppointments,
    })

    const handleJoin = (appointment: any) => {
        console.log("Value", appointment)
        navigate("/meeting", {
            state: {
                meetingId: appointment.meetingId, token: appointment.token,
            },
        });
    };

    const calendarEvents: CalendarEvent[] = appointments.map((appointment) => {
        return {
            date: appointment.date,
            bubbleMessage: Math.ceil(Math.random() * 20),
            events: ["You have a new appointment with Dr. <NAME> on 23.06.23 at 11:00-12:30.",],
            onClick: (event: CalendarEvent) => {
                console.log(event);
                showDialog({
                    template: PrescriptionForm, params: {
                        isBarrierDismissible: true, onClose: closeDialog, background: "rgba(0, 0, 0, 0.5)",
                    },
                });
            },
        };
    });

    const {showDialog, closeDialog} = useDialog();

    const notes = [{name: "Note 31.06.23.pdf", size: "1.2 Mb"}, {name: "Note 23.06.23.pdf", size: "1.2 Mb"},];

    return (<div className="dashboard-container">
        <div className="profile-content">
            <div className="profile-main">
                {/* doctor Info Card */}
                <div className="doctor-card">
                    <div className="doctor-avatar">
                        <InitialsAvatar firstName={user?.firstName ?? ""} lastName={user?.lastName ?? ""}
                                        name={undefined}/>
                    </div>
                    <div className="doctor-info">
                        <h2>Dr. {user?.firstName}</h2>
                        <div className="contact-info">
                            <div className="contact-item">
                                <Phone
                                    size={16}
                                    onClick={() => {
                                        showDialog({
                                            template: PrescriptionForm, params: {
                                                isBarrierDismissible: true,
                                                onClose: closeDialog,
                                                background: "rgba(0, 0, 0, 0.5)",
                                            },
                                        });
                                    }}
                                />
                                <span>{user.phone}</span>
                            </div>
                            <div className="contact-item">
                                <Mail size={16}/>
                                <span>{user.email}</span>
                            </div>
                            <div className="contact-item">
                                <FileLock2 size={16}/>
                                <span>DS12309JJKNUIASD</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Sections */}
                <div className="info-sections">
                    <div className="info-section">
                        <div className="section-header">
                            <h3>General information</h3>
                            <Edit size={16}/>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Date of birth:</label>
                                <span>23. 07. 1994</span>
                            </div>
                            <div className="info-item">
                                <label>Speciality:</label>
                                <span>{user.specialization}</span>
                            </div>
                            <div className="info-item">
                                <label>Licence Number</label>
                                <span>{`**********${user.licenseNumber.slice(user.licenseNumber.length - 4)}`}</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <div className="section-header">
                            <h3>Upcoming Appointment</h3>
                            <Calendar size={16}/>
                        </div>
                        <div className="info-grid">
                            {!isPending ? (<>
                                <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <label>
                                        All clear! No upcoming appointments.
                                    </label>
                                </div>
                            </>) : (<>
                                <div className="info-item">
                                    {isPending ? (<>
                                        <Skeleton count={2} height={20} width={400}/>
                                    </>) : (<>
                                        <label>Reason:</label>
                                        <span>
                                                    Checkup after Mission: Impossible - The Final Reckoning
                                                </span>
                                    </>)}
                                </div>
                                <div className="info-item">
                                    {isPending ? (<>
                                        <Skeleton count={2} height={20} width={400}/>
                                    </>) : (<>
                                        <label>Reason:</label>
                                        <span>
                                            Checkup after Mission: Impossible - The Final Reckoning
                                        </span>
                                    </>)}

                                </div>
                                <div className="info-item">
                                    {isPending ? (<>
                                        <Skeleton count={2} height={20} width={400}/>
                                    </>) : (<>
                                        <label>Blood type:</label>
                                        <span>XY+</span>
                                    </>)}

                                </div>
                                <div className="info-item">
                                    {isPending ? (<>
                                        <Skeleton count={2} height={20} width={400}/>
                                    </>) : (<>
                                        <label>Last Visit:</label>
                                        <span>Mission: Impossible - Dead Reckoning Part One</span>
                                    </>)}

                                </div>
                            </>)}
                        </div>
                    </div>
                </div>

                {/* Visits Tabs */}
                <div className="visits-section">
                    <div className="tabs">
                        <button className="tab">Appointment</button>
                    </div>

                    <>
                        {(() => {
                            const now = new Date();

                            // Filter: today's appointments & still upcoming
                            const todayAppointments = appointments.filter((appointment) => {
                                const date = new Date(appointment.appointmentDate);
                                const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

                                const isUpcoming = date > now; // remove past appointments

                                return isToday && isUpcoming;
                            });

                            return (<>
                                <div className="overflow-y-auto max-h-[500px] space-y-4 pr-2">
                                    {todayAppointments.map((appointment, index) => {
                                        const dateObj = new Date(appointment.appointmentDate);
                                        const time = dateObj.toLocaleTimeString([], {
                                            hour: "2-digit", minute: "2-digit",
                                        });

                                        return (<div
                                            key={index}
                                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-8">
                                                    {/* Time Section */}
                                                    <div
                                                        className="flex items-center space-x-3 min-w-[140px]">
                                                        <div
                                                            className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                                                            <Clock className="w-5 h-5 text-blue-600"/>
                                                        </div>
                                                        <div>
                                                            <div
                                                                className="font-semibold text-gray-900 text-lg">
                                                                {time}
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-500 flex items-center">
                                                                <Calendar className="w-3 h-3 mr-1"/>
                                                                {dateObj.toLocaleDateString("en-US", {
                                                                    month: "short", day: "numeric",
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Patient Section */}
                                                    <div
                                                        className="flex items-center space-x-3 min-w-[180px]">
                                                        <div
                                                            className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-200">
                                                            <User className="w-5 h-5 text-green-600"/>
                                                        </div>
                                                        <div>
                                                            <div
                                                                className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                                Patient
                                                            </div>
                                                            <div className="font-medium text-gray-900">
                                                                {appointment.patientId ?? "Unknown"}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Status Section */}
                                                    <div className="flex items-center space-x-3">
                                                        <div>
                                                            <div
                                                                className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                                                Status
                                                            </div>
                                                            <span
                                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-800 border-emerald-200">
                          {appointment.status}
                        </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Join Button */}
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => handleJoin(appointment)}
                                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                    >
                                                        <Video className="w-4 h-4 mr-2"/>
                                                        Join
                                                    </button>
                                                </div>
                                            </div>
                                        </div>);
                                    })}
                                </div>

                                {todayAppointments.length === 0 && (<div className="text-center py-12">
                                    <div
                                        className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <Calendar className="w-8 h-8 text-gray-400"/>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No appointments today
                                    </h3>
                                    <p className="text-gray-500">Your schedule is clear for today.</p>
                                </div>)}
                            </>);
                        })()}
                    </>


                </div>
            </div>

            <div className="profile-sidebar">
                <CalendarWidget
                    // onNewEvent={() => {
                    //     return showDialog({
                    //         template: PrescriptionForm, params: {
                    //             isBarrierDismissible: true, onClose: closeDialog, background: 'rgba(0, 0, 0, 0.5)',
                    //         }
                    //     });
                    // }}
                    events={calendarEvents}
                ></CalendarWidget>
                {/* Notes Section */}
                <div className="sidebar-section">
                    <div className="section-header">
                        <h3>Notes</h3>
                        <button onClick={() => {
                            handleJoin(appointments)
                        }} className="download-all">
                            <Download size={16}/>
                            DOWNLOAD
                        </button>
                    </div>
                    <div className="files-list">
                        {notes.map((note, index) => (<div key={index} className="file-item">
                            <StickyNote size={16}/>
                            <div className="file-info">
                                <span className="file-name">{note.name}</span>
                                <span className="file-size">{note.size}</span>
                            </div>
                        </div>))}
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

export default Dashboard
