import type * as React from "react"
import {useEffect, useRef, useState} from "react"
import {ArrowLeft, Mic, Send} from "lucide-react"
import {useQuery} from "@tanstack/react-query"
import {ChatService} from "../../../../../shared-modules/src/api/chat.service.ts"
import "./chat-window.css"
import InitialsAvatar from "../../../components/avatar.tsx"
import Skeleton from "react-loading-skeleton"
import {getCurrentUser} from "../../../../../shared-modules/src/user_auth/user_auth.ts";

interface Message {
    id: string
    sender: "patient" | "doctor"
    text: string
    time: string
    avatar: string
    firstName: string
    lastName: string
}

interface ChatWindowProps {
    doctorName: string
    doctorAvatar: string
    doctorId: string
    onSendMessage: (message: string) => void
    newMessageText: string
    setNewMessageText: (text: string) => void
    onBack: () => void
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
                                                          doctorName,
                                                          doctorAvatar,
                                                          doctorId,
                                                          onSendMessage,
                                                          newMessageText,
                                                          setNewMessageText,
                                                          onBack,
                                                      }) => {
    const baseURL = "http://localhost:3000/api"
    const [localMessages, setLocalMessages] = useState<Message[]>([])

    const {data, isPending} = useQuery({
        queryKey: ['chat-messages', doctorId], queryFn: () => {
            const api = new ChatService(baseURL)
            return api.getChatContext(doctorId)
        }, enabled: !!doctorId
    })

    useEffect(() => {
        if (data?.messages) {
            const formattedMessages = data.messages
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) // Sort oldest first
                .map(msg => ({
                    id: msg._id,
                    sender: msg.senderType as "doctor" | "patient",
                    text: msg.text,
                    time: new Date(msg.createdAt).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}),
                    avatar: doctorAvatar,
                    firstName: msg.doctor?.firstName || "Doctor",
                    lastName: msg.doctor?.lastName || ""
                }));

            setLocalMessages(formattedMessages);
        }
    }, [data, doctorAvatar]);

    const api = new ChatService(baseURL);

    const user = getCurrentUser();

    const handleSendClick = async () => {
        if (newMessageText.trim()) {

            const data = await api.reply({
                doctorId, patientId: user.id, text: newMessageText.trim(),
            });
            localMessages.push(data.chat);
            setNewMessageText("")
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendClick()
        }
    }

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }, [localMessages])

    return (<div className="flex flex-col h-full w-full bg-[#f3f4f6] overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 flex-shrink-0 h-16">
            <div className="flex items-center min-w-0">
                <button
                    onClick={onBack}
                    className="md:hidden mr-3 text-gray-500 hover:text-gray-700 flex-shrink-0"
                >
                    <ArrowLeft size={20}/>
                </button>
                {isPending ? (<>
                    <Skeleton circle count={1} width={50} height={50}></Skeleton>
                    <Skeleton count={1} width={150} height={30}></Skeleton>
                </>) : (<><InitialsAvatar
                    firstName={doctorName}
                    lastName={doctorName}
                    name={undefined}
                    size={50}
                />
                    <div className="font-semibold text-gray-800 truncate">{doctorName}</div>
                </>)}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0" style={{overflowY: "auto"}}>
            {isPending ? (<div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                    <p className="text-lg mb-2">Loading messages...</p>
                </div>
            </div>) : localMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                        <p className="text-lg mb-2">Start a conversation</p>
                        <p className="text-sm">Send a message to begin chatting with {doctorName}</p>
                    </div>
                </div>) : (<>
                {localMessages.map((message) => (<div
                    key={message.id}
                    className={`flex items-start ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                >
                    {message.sender === "doctor" && (<InitialsAvatar
                        firstName={message.firstName}
                        lastName={message.lastName}
                        name={undefined}
                        size={50}
                    />)}
                    <div
                        className={`max-w-[75%] min-w-[100px] p-3 rounded-lg shadow-sm ${message.sender === "patient" ? "bg-[#3b82f6] text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none border border-gray-100"}`}
                    >
                        <p className="text-sm leading-relaxed break-words">{message.text}</p>
                        <span
                            className={`block mt-2 text-xs ${message.sender === "patient" ? "text-blue-100" : "text-gray-500"} text-right`}
                        >
                                        {message.time}
                                    </span>
                    </div>
                    {message.sender === "patient" && (<InitialsAvatar
                        firstName={message.firstName}
                        lastName={message.lastName}
                        name={undefined}
                        size={50}
                    />)}
                </div>))}
                <div ref={messagesEndRef}/>
            </>)}
        </div>

        <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0 message-bar">
            <div className="flex items-center gap-3 max-w-full">
                <input
                    type="text"
                    placeholder="Write Something..."
                    className="flex-1 p-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200 border-0 text-sm min-w-0"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className="text-gray-500 hover:text-gray-700 p-2 flex-shrink-0">
                    <Mic size={20}/>
                </button>
                <button
                    className="text-gray-500 hover:text-blue-600 p-2 flex-shrink-0"
                    onClick={handleSendClick}
                >
                    <Send size={20}/>
                </button>
            </div>
        </div>
    </div>)
}
