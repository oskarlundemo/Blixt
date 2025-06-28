import '../styles/CreateChat.css'
import {use, useEffect, useState} from "react";
import {CreateChatHeader} from "../components/CreateChatComponents/CreateChatHeader.jsx";
import {ParticipantsSection} from "../components/CreateChatComponents/ParticipantsSection.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {Spinner} from "../components/Spinner.jsx";
import toast from "react-hot-toast";
import {BottomSheetItem} from "../components/ConversationComponents/BottomSheetItem.jsx";
import {BottomSheet} from "../components/BottomSheet.jsx";
import {Overlay} from "../components/Overlay.jsx";

export const CreateChat = ({setCreateChatUI = null, following = []}) => {

    const {API_URL, token} = useAuth();
    const [participants, setParticipants] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [search, setSearch] = useState("");
    const [showBottomMenu, setShowBottomMenu] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        participants.length > 0 ? setShowBottomMenu(true) : setShowBottomMenu(false);
    }, [participants]);


    useEffect(() => {
        const delayBouncing = setTimeout(() => {
            if (search.trim().length > 0) {
                fetch(`${API_URL}/chat/search/?q=${search}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        setSearchResults(data.searchResults);
                    })
                    .catch(err => {
                        console.log(err)
                    });
            } else {
                setSearchResults([]);
            }
        }, 300)
        return () => clearTimeout(delayBouncing);
    }, [search]);

    const handleSubmit = (e) => {

        e.preventDefault();
        setLoading(true);

        try {
            let endPoint = participants.length > 1 ? 'group' : 'private'

            fetch(`${API_URL}/chat/create/${endPoint}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({participants}),
            })
                .then(res => res.json())
                .then(data => {
                    setLoading(false);
                    toast.success(data.message);
                    setParticipants([]);
                    setSearch('');
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false);
                    toast.error('Something went wrong when creating group');
                });
        } catch (err) {
            console.log('Error creating chat', err);
        } finally {
            setLoading(false);
        }
    }

    const addParticipant = (participant) => {

        if (participants.length >= 5)
            return;

        setParticipants((prev) => {
            const alreadyExists = prev.some(p => p.id === participant.id);
            if (!alreadyExists) {
                return [...prev, participant];
            }
            return prev;
        });
    };



    const removeParticipant = (participant) => {
        setParticipants((prev) => {
            if (prev.some(p => p.id === participant.id)) {
                return prev.filter(p => p.id !== participant.id);
            }
        })
    }

    return (
        <main className="create-chat">
            {loading && <Spinner />}

            <svg
                onClick={() => setCreateChatUI(false)}
                style={{ margin: "1rem" }}
                className="configure-back"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
            >
                <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
            </svg>

            <CreateChatHeader
                search={search}
                setSearch={setSearch}
                participants={participants}
                removeParticipant={removeParticipant}
            />

            <ParticipantsSection
                addParticipant={addParticipant}
                participants={participants}
                search={search}
                following={following}
                searchResults={searchResults}
                removeParticipant={removeParticipant}
                add={false}
            />

            <div className={`bottom-menu ${showBottomMenu ? "active" : ""}`}>
                <button
                    style={{
                        backgroundColor: "var(--accent-color)",
                        color: "white",
                        margin: "1rem",
                        fontSize: "1.5rem",
                        opacity: showBottomMenu ? 1 : 0,
                    }}
                    onClick={handleSubmit}
                >
                    Create chat
                </button>
            </div>

        </main>
    );
}
