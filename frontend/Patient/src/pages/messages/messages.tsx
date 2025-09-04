import {useCallback, useEffect, useRef, useState} from "react"
import {DoctorList} from "./components/doctor-list"
import {ChatWindow} from "./components/chat-window"
import {ChatService} from "../../../../shared-modules/src/api/chat.service.ts";


type Message = {
    id: string
    sender: "doctor" | "patient"
    text: string
    time: string
    avatar: string
}


export default function MessagesPage() {
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>("1")
    const [doctorName, setDoctorName] = useState<string | null>("")
    const [searchTerm, setSearchTerm] = useState("")
    const [allMessages, setAllMessages] = useState([])
    const [newMessageText, setNewMessageText] = useState("")
    const [showDoctorListOnMobile, setShowDoctorListOnMobile] = useState(true)

    const baseURL = "http://localhost:3000/api";

    const fetchMessages = (id: string) => {
        new ChatService(baseURL).getChatContext(id).then((data) => {
            setAllMessages(data.messages);
        });
    };
    const handleSelectDoctor = useCallback((id: any) => {
        setSelectedDoctorId(id._id);
        setDoctorName(id.doctor.firstName + " " + id.doctor.lastName);


        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }


        fetchMessages(id._id);

        const intervalFn = () => {
            fetchMessages(id._id);
        }


        intervalRef.current = setInterval(intervalFn, 5000);

        if (window.innerWidth < 768) {
            setShowDoctorListOnMobile(false);
        }
    }, []);


    const intervalRef = useRef<NodeJS.Timeout | null>(null);


    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleBackToDoctors = useCallback(() => {
        setShowDoctorListOnMobile(true)
        setSelectedDoctorId(null)
    }, [])

    const handleSendMessage = useCallback(() => {
        if (newMessageText.trim() && selectedDoctorId) {
            const newMsg = {
                id: `m${Date.now()}`,
                sender: "patient" as const,
                text: newMessageText.trim(),
                time: new Date().toISOString(),
                avatar: "/placeholder.svg?height=32&width=32&text=P",
            }
            allMessages.push(newMsg);

            setAllMessages(allMessages);
            setNewMessageText("")
        }
    }, [newMessageText, selectedDoctorId])

    return (<div className="flex h-screen w-full overflow-hidden bg-gray-50" style={{height: "100%"}}>
        <div className={`
        ${showDoctorListOnMobile ? "flex" : "hidden"} 
        md:flex 
        w-full md:w-96 
        flex-shrink-0
        h-full
      `}>
            <DoctorList
                doctors={[]}
                selectedDoctorId={selectedDoctorId}
                onSelectDoctor={handleSelectDoctor}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onOpenMobileMenu={() => setShowDoctorListOnMobile(true)}
            />
        </div>


        <div className={`
        ${selectedDoctorId && !showDoctorListOnMobile ? "flex" : "hidden"} 
        md:flex 
        flex-1 
        h-full
        ${showDoctorListOnMobile ? "absolute inset-0 z-50" : ""}
        md:relative md:z-auto
      `}>
            {selectedDoctorId ? (<ChatWindow
                doctorName={doctorName}
                doctorAvatar={""}
                doctorId={selectedDoctorId}
                onSendMessage={handleSendMessage}
                newMessageText={newMessageText}
                setNewMessageText={setNewMessageText}
                onBack={handleBackToDoctors}
            />) : (<div className="flex items-center justify-center h-full text-gray-500 bg-gray-50"
                        style={{width: "100%"}}>
                <div className="text-center p-8">
                    <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                    <p className="text-sm">Choose a doctor from the list to start chatting</p>
                </div>
            </div>)}
        </div>
    </div>)
}
