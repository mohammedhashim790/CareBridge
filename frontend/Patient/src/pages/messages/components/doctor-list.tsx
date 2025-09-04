import type * as React from "react"
import {Search} from "lucide-react"
import InitialsAvatar from "../../../components/avatar.tsx";
import {ChatService} from "../../../../../shared-modules/src/api/chat.service.ts";
import Skeleton from "react-loading-skeleton";
import {useQuery} from "@tanstack/react-query";

interface Doctor {
    id: string
    name: string
    lastMessage: string
    avatar: string
}

interface DoctorListProps {
    doctors: Doctor[]
    selectedDoctorId: string | null
    onSelectDoctor: (id: string) => void
    searchTerm: string
    onSearchChange: (term: string) => void
    onOpenMobileMenu: () => void
}

export const DoctorList: React.FC<DoctorListProps> = ({
                                                          doctors,
                                                          selectedDoctorId,
                                                          onSelectDoctor,
                                                          searchTerm,
                                                          onSearchChange,
                                                      }) => {
    const truncateMessage = (message: string, maxLength: number) => {
        if (message.length <= maxLength) return message
        return message.substring(0, maxLength) + "..."
    }


    const baseURL = "http://localhost:3000/api";


    const getChatList = async () => {
        const api = new ChatService(baseURL);
        return api.getChatList();
    }

    getChatList();

    const {data, isPending} = // {data: {results: []}, isPending: true};
        useQuery({
            queryKey: ['doctors-messaging-list'], queryFn: getChatList
        })


    return (<div className="flex flex-col h-full w-full bg-white border-r border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0 h-16">
            <div className="text-xl font-bold text-gray-800">Chats</div>
        </div>

        <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0"
             style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            {isPending && (<Skeleton count={10} width={300} height={30}></Skeleton>)}

            {!isPending && (data.results.length === 0 ? (<div className="p-4 text-center text-gray-500">
                <p>You don't have any conversations</p>
            </div>) : (data.results.map((doctor) => (<div
                key={doctor._id}
                className={`flex items-center p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedDoctorId === doctor.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`}
                style={{width: "100%"}}
                onClick={() => onSelectDoctor(doctor)}
            >
                <InitialsAvatar firstName={doctor.doctor.firstName} lastName={doctor.doctor.lastName} name={undefined}
                                size={50}></InitialsAvatar>
                <div className="flex-1 min-w-0">
                    <div
                        className="font-medium text-gray-800 truncate">{doctor.doctor.firstName + " " + doctor.doctor.lastName}</div>
                    <div className="text-sm text-gray-500 truncate">
                        {truncateMessage(doctor.lastMessage, 50)}
                    </div>
                </div>
            </div>))))}
        </div>
    </div>)
}
