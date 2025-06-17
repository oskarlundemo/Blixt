import {HeaderMenu} from "../components/HeaderMenu.jsx";
import '../styles/CreateChat.css'
import {use, useEffect, useState} from "react";
import {CreateChatHeader} from "../components/CreateChatComponents/CreateChatHeader.jsx";
import {ParticipantsSection} from "../components/CreateChatComponents/ParticipantsSection.jsx";
import {useAuth} from "../context/AuthContext.jsx";

export const CreateChat = ({}) => {

    const {API_URL, token} = useAuth();
    const [following, setFollowing] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [search, setSearch] = useState("");
    const [showBottomMenu, setShowBottomMenu] = useState(true);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        participants.length > 0 ? setShowBottomMenu(true) : setShowBottomMenu(false);
    }, [participants]);

    useEffect(() => {

        fetch(`${API_URL}/chat/fetch/following`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                setFollowing(data.following);
            })
            .catch(err => console.log(err));
    }, [])


    useEffect(() => {

        fetch(`${API_URL}/chat/fetch/following`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                setFollowing(data.following);
            })
            .catch(err => console.log(err));
    }, [])


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
                        console.log(data)
                        setSearchResults(data.searchResults);
                    })
                    .catch(err => console.log(err));
            } else {
                setSearchResults([]);
            }
        }, 300)

        return () => clearTimeout(delayBouncing);

    }, [search]);



    const handleSubmit = (e) => {

        e.preventDefault();

        try {

            setCreating(true);

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
                    setFollowing(data.following);
                })
                .catch(err => console.log(err));

        } catch (err) {
            console.log('Error creating chat', err);
        }
    }


    const addParticipant = (participant) => {

        setParticipants((prev) => {
            if (prev.some(p => p.id === participant.id)) {
                return prev.filter(p => p.id !== participant.id);
            } else {
                return [...prev, participant];
            }
        });
    };

    return (
        <main className={'create-chat'}>

            {creating && (
                <div className="uploading-overlay">
                    <div className="uploading-spinner"></div>
                </div>
            )}

            <HeaderMenu
                backArrow={true}
            />

            <CreateChatHeader
                search={search}
                setSearch={setSearch}
                participants={participants}
                addParticipant={addParticipant}
            />

            <ParticipantsSection
                addParticipant={addParticipant}
                participants={participants}
                search={search}
                following={following}
                searchResults={searchResults}
            />

            <div
                className={`bottom-menu ${showBottomMenu ? "active" : ""}`}>
                <button
                    style={{
                        backgroundColor: "var(--accent-color)",
                        color: 'white',
                        margin: '1rem',
                        fontSize: '1.5rem'
                    }}

                    onClick={(e) => {
                        handleSubmit(e);
                    }}
                >Create chat</button>
            </div>

        </main>
    )

}