import {UserAvatar} from "../components/UserAvatar.jsx";
import '../styles/Conversation.css'
import {useNavigate, useParams} from "react-router-dom";
import {MessageInput} from "../components/ConversationComponents/MessageInput.jsx";
import {useEffect, useMemo, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {MessageCard} from "../components/ConversationComponents/MessageCard.jsx";
import {supabase} from "../services/SupabaseClient.js";
import moment from "moment-timezone";
import {MessageSplitter} from "../components/MessasgeSplitter.jsx";
import {BottomMenu} from "../components/BottomMenu.jsx";
import {BottomSheet} from "../components/BottomSheet.jsx";
import {Overlay} from "../components/Overlay.jsx";
import {BottomSheetItem} from "../components/ConversationComponents/BottomSheetItem.jsx";

export const Conversation = ({}) => {

    const navigate = useNavigate();
    const {username} = useParams();
    const [insepctedConversation, setInseptedConversation] = useState(null);
    const [bottomMenu, setBottomMenu] = useState(false);
    const [showGroupUsers, setShowGroupUsers] = useState(false);

    const [showGif, setShowGif] = useState(false);
    const {token, user, API_URL} = useAuth();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef(null);
    const {group_id} = useParams();

    const [messages, setMessages] = useState([]);

    useEffect(() => {

        let endpoint = "";

        if (group_id) {
            endpoint = `${API_URL}/messages/fetch/by-conversation/${group_id}`;
        } else if (username) {
            endpoint = `${API_URL}/messages/fetch/by-user/${encodeURIComponent(username)}`;
        }

        if (endpoint) {
            fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setMessages(data.messages);
                    setInseptedConversation(data.otherUser || data.group);
                    setLoading(false);
                    console.log(data)
                })
                .catch(error =>  {
                    console.log(error);
                    setLoading(false);
                });
        }
    }, [username, group_id]);



    const renderedMessages = useMemo(() => {
        const rendered = []; // Array of rendered messages
        let lastDate = null; // Track the date of the messages

        // Loop through the message
        messages.forEach((message) => {

            const currDate = moment.utc(message.created_at).tz("Europe/Stockholm"); // Set the current time to now

            // This is used for checking if the message was sent during the same day or not, if so content, else add a MessageSplitter
            const isNewDay =
                !lastDate ||
                currDate.year() !== lastDate.year() ||
                currDate.month() !== lastDate.month() ||
                currDate.date() !== lastDate.date();


            if (isNewDay) { // New day, insert a MessageSplitter component in the chat window
                const formattedDate = currDate.locale('sv').format('dddd D MMMM YYYY');
                rendered.push(
                    <MessageSplitter key={`split-${message.id}`} date={formattedDate}/>
                );
                lastDate = currDate; //
            }

            rendered.push(
                <MessageCard
                    key={message.id}
                    content={message.content}
                    timestamp={message.created_at}
                    sender={message.sender}
                />);
        });
        return rendered;
    }, [messages]);




    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])


    const playNotificationSound = () => {
        const audio = new Audio('/notification.mp3');
        audio.play();
    };

    useEffect(() => {
        if (!user?.id || !token) return;

        const table = group_id ? 'GroupMessage' : 'PrivateMessages';
        const fetchUrl = group_id
            ? `${API_URL}/messages/fetch/group/new/enriched`
            : `${API_URL}/messages/fetch/private/new/enriched`;

        const channel = supabase
            .channel('messages-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table },
                async (payload) => {
                    const message = payload.new;

                    if (message.sender_id === user.id || message.receiver_id === user.id || group_id) {
                        try {
                            const response = await fetch(fetchUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ message }),
                            });

                            const data = await response.json();
                            setMessages((prev) => [...prev, data]);
                            playNotificationSound();
                        } catch (err) {
                            console.error('Error fetching enriched message', err);
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [user?.id, user?.token, group_id, API_URL, token]);


    return (
        <main className="conversation-wrapper">
            {loading ? (
                <LoadingTitle/>
            ) : (
                <>
                    <div className="conversation-header">

                        <svg
                            className={'back-icon'}
                            onClick={() => {
                                navigate(-1);
                            }}
                            xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>

                        {group_id && !loading ? (
                            <div style={{ display: "flex" }}>
                                {insepctedConversation?.GroupMembers?.map((groupMember, i) => (
                                    <div
                                        key={groupMember.Member.id}
                                        style={{
                                            marginLeft: i === 0 ? 0 : -8,
                                            zIndex: insepctedConversation.GroupMembers.length - i,
                                            border: '2px solid white',
                                            borderRadius: '50%',
                                        }}>
                                        <UserAvatar
                                            user={groupMember.Member}
                                            size={25}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <UserAvatar
                                size={25}
                                user={insepctedConversation}
                            />
                        )}

                        <h2>{insepctedConversation?.username || insepctedConversation?.name}</h2>


                        {group_id && (
                            <svg

                                onClick={() => {
                                    setBottomMenu(true)
                                }}

                                className={'more-icon'}
                                style={{
                                    marginLeft: 'auto',
                                    padding: '1rem'
                                }}

                                xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/></svg>
                        )}

                    </div>

                    <section
                        style={{
                            position: "relative",
                        }}

                        className="conversation-content">

                        <div
                            style={{
                                width: '90%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignSelf: 'center',
                                gap: '1rem'
                            }}>

                            {messages?.length > 0 ? (
                                renderedMessages
                            ) : (
                                <p
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        textAlign: "center"
                                    }}
                                >
                                    No messages yet! Initiate a conversation
                                </p>
                            )}

                            <div ref={bottomRef} />

                        </div>

                    </section>

                    <MessageInput
                        showGif={showGif}
                        message={message}
                        setMessage={setMessage}
                        setShowGif={setShowGif}
                    />

                    <BottomSheet
                        showMenu={bottomMenu}
                        setShowMenu={setBottomMenu}
                        childrenElements={
                            <div
                                style={{
                                    width: '90%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>

                                <BottomSheetItem

                                    onClick={() => {
                                        setShowGroupUsers(!showGroupUsers);
                                    }}

                                    title={'Group members'}
                                    svg={
                                    <>
                                        <svg
                                            style={{
                                                marginRight: 'auto',
                                                transition: '200 ms ease-in-out',
                                                transform: showGroupUsers ? 'rotate(-90deg)' : 'rotate(0deg)',
                                            }}
                                            xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-360 280-560h400L480-360Z"/></svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>
                                    </>}

                                    dropDown={true}
                                    showDropDown={() => setShowGroupUsers(!showGroupUsers)}
                                    groupMembers={insepctedConversation.GroupMembers}
                                    showGroupUsers={showGroupUsers}
                                />

                                <BottomSheetItem
                                    title={'Delete group'}
                                    svg={<svg className={'delete-icon'} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>}
                                />

                            </div>
                        }
                    />

                    <Overlay
                        showOverlay={bottomMenu}
                        setShowOverlay={setBottomMenu}
                        clickToggle={true}
                        />
                </>
            )}

        </main>
    )


}