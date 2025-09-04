import {useEffect, useState} from 'react';
import Header from './components/Header';
import TimeSlotSection from '../appointment/components/TimeSlotSelection';
import AppointmentModal from '../appointment/components/AppointmentModal';
import {Moon, Sun} from 'lucide-react';
import Toast from '../../components/toast/Toast';
import type {CreateAppointmentRequestDto} from 'shared-modules';
import {AppointmentApi} from 'shared-modules';
import CalendarWidget from '../dashboard/components/calendar/calendar';
import type {CalendarEvent} from "../dashboard/components/calendar/calendar_params";
import {useDialog} from "../utils/dialog/dialog.tsx";
import {getCurrentUser} from 'shared-modules/src/user_auth/user_auth.ts';
import {PrescriptionForm} from "../prescription/prescription.tsx";

const appointmentApi = new AppointmentApi('https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api');

function convertToApiDateTime(selectedDate: Date, timeSlot: string): string {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
        throw new Error('Invalid date provided');
    }
    if (!timeSlot || !/^\d{1,2}:\d{2}\s[AP]M$/.test(timeSlot)) {
        throw new Error('Invalid time slot format. Expected format: "H:MM AM/PM"');
    }
    const [time, period] = timeSlot.split(' ');
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (isNaN(hours) || isNaN(minutes) || hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
        throw new Error('Invalid time values in time slot');
    }
    if (period === 'PM' && hours < 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    date.setHours(hours, minutes, 0, 0);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hoursStrPadded = String(date.getHours()).padStart(2, '0');
    const minutesStrPadded = String(date.getMinutes()).padStart(2, '0');
    const secondsStrPadded = String(date.getSeconds()).padStart(2, '0');
    const millisecondsStrPadded = String(date.getMilliseconds()).padStart(3, '0');
    const offset = '-03:00';
    return `${year}-${month}-${day}T${hoursStrPadded}:${minutesStrPadded}:${secondsStrPadded}.${millisecondsStrPadded}${offset}`;
}

const Appointment = () => {
    const user = getCurrentUser();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [bookedSlots, setBookedSlots] = useState<string[]>(['']);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointments, setAppointments] = useState<any[]>([]);
    const {showDialog, closeDialog} = useDialog();
    const [toast, setToast] = useState<{
        type: 'success' | 'error'; message: string; isVisible: boolean;
    }>({
        type: 'success', message: '', isVisible: false
    });

    useEffect(() => {
        console.log("USER", user)
        const fetchAppointments = async () => {
            try {
                const response = await appointmentApi.getAppointments();
                setAppointments(response);

                // Filter appointments for the selected date only
                const filtered = response.filter((appointment) => {
                    const apptDate = new Date(appointment.appointmentDate);
                    return (apptDate.getFullYear() === selectedDate.getFullYear() && apptDate.getMonth() === selectedDate.getMonth() && apptDate.getDate() === selectedDate.getDate());
                });

                // Extract time slots from filtered appointments
                const slots = filtered.map((appointment) => {
                    const date = new Date(appointment.appointmentDate);
                    let hours = date.getHours();
                    const minutes = date.getMinutes();
                    const period = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12 || 12;
                    const paddedMinutes = String(minutes).padStart(2, '0');
                    return `${hours}:${paddedMinutes} ${period}`;
                });

                setBookedSlots(slots);
            } catch (error) {
                console.error('Failed to fetch appointments', error);
            }
        };

        fetchAppointments();
    }, [selectedDate]);


    const morningSlots = ['9:00 AM', '9:10 AM', '9:20 AM', '9:30 AM', '9:40 AM', '9:50 AM', '10:00 AM', '10:10 AM', '10:20 AM', '10:30 AM'];

    const eveningSlots = ['5:00 PM', '5:10 PM', '5:20 PM', '5:30 PM', '5:40 PM', '5:50 PM', '6:00 PM', '6:10 PM', '6:20 PM', '6:30 PM'];

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({type, message, isVisible: true});
    };
    const hideToast = () => setToast(prev => ({...prev, isVisible: false}));

    const handleSlotSelect = (slot: string) => {
        if (!bookedSlots.includes(slot)) {
            setSelectedSlot(slot);
            setIsModalOpen(true);
        }
    };

    const calendarEvents: CalendarEvent[] = appointments.map((appointment) => ({
        date: new Date(appointment.appointmentDate).getDate(),
        bubbleMessage: Math.ceil(Math.random() * 20),
        events: ["You have a new appointment with Dr. <NAME> on 23.06.23 at 11:00-12:30."],
        onClick: () => showDialog({
            template: PrescriptionForm,
            params: {isBarrierDismissible: true, onClose: closeDialog, background: 'rgba(0, 0, 0, 0.5)'}
        })
    }));

    const handleAppointmentConfirm = async (patientData: any) => {
        if (!selectedSlot) return showToast('error', 'Please select a time slot first');

        debugger;
        try {
            const appointmentDate = convertToApiDateTime(selectedDate, selectedSlot);
            const payload: CreateAppointmentRequestDto = {
                patientId: patientData.patientId,
                doctorId: user.customId,
                appointmentDate,
                phoneNumber: patientData.phone || undefined,
                additionalNotes: patientData.notes || undefined
            };
            const response = await appointmentApi.createAppointment(payload);
            setBookedSlots([...bookedSlots, selectedSlot]);
            setAppointments([...appointments, response]);
            setSelectedSlot(null);
            setIsModalOpen(false);
            showToast('success', `Appointment booked successfully for ${response.patientName} at ${selectedSlot}`);
        } catch (error: any) {
            if (error?.response?.status === 400 && error?.response?.data?.message === 'Invalid or past appointment date') {
                showToast('error', 'Choose another date and time.');
            } else {
                showToast('error', error?.message || 'Failed to book appointment. Please try again.');
            }
        }
    };

    const handleAddSlots = () => console.log('Add slots functionality');

    return (<div className="min-h-screen bg-gray-50">
            <Header doctorName={"Dr." + user.firstName + " " + user.lastName}/>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <nav className="flex space-x-2 text-sm text-gray-600">
                        <span>Home</span><span>/</span><span className="text-blue-600">Appointments</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-gray-800 mt-2">Appointments</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 order-1">
                        <CalendarWidget
                            //onNewEvent={() => {}}
                            events={calendarEvents}
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                        />
                    </div>

                    <div className="lg:col-span-2 space-y-6 order-2">
                        <TimeSlotSection
                            title="Morning"
                            timeRange="9:00 AM to 12:00 PM"
                            icon={<Sun className="w-5 h-5 text-yellow-500"/>}
                            slots={morningSlots}
                            selectedSlot={selectedSlot}
                            bookedSlots={bookedSlots}
                            onSlotSelect={handleSlotSelect}
                            onAddSlots={handleAddSlots}
                        />
                        <TimeSlotSection
                            title="Evening"
                            timeRange="5:00 PM to 09:00 PM"
                            icon={<Moon className="w-5 h-5 text-purple-500"/>}
                            slots={eveningSlots}
                            selectedSlot={selectedSlot}
                            bookedSlots={bookedSlots}
                            onSlotSelect={handleSlotSelect}
                            onAddSlots={handleAddSlots}
                        />
                    </div>
                </div>
            </div>

            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
                selectedTime={selectedSlot || ''}
                onConfirm={handleAppointmentConfirm}
            />

            <Toast
                type={toast.type}
                message={toast.message}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>);
};

export default Appointment;
