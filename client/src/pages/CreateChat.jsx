import {HeaderMenu} from "../components/HeaderMenu.jsx";
import '../styles/CreateChat.css'
import {use, useEffect, useState} from "react";
import {CreateChatHeader} from "../components/CreateChatComponents/CreateChatHeader.jsx";
import {ParticipantsSection} from "../components/CreateChatComponents/ParticipantsSection.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";

export const CreateChat = ({}) => {

    const {API_URL, token} = useAuth();
    const [following, setFollowing] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [search, setSearch] = useState("");
    const [showBottomMenu, setShowBottomMenu] = useState(true);
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(true);

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
                setLoading(false);
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
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false);
                });
        } catch (err) {
            console.log('Error creating chat', err);
        } finally {
            setLoading(false);
            setCreating(false);
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
        <main className={'create-chat'}>

            <HeaderMenu
                backArrow={true}
            />

            {loading ? (
                <LoadingTitle/>
            ) : (
                <>
                    {creating && (
                        <div className="uploading-overlay">
                            <div className="uploading-spinner"></div>
                        </div>
                    )}

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
                </>
            )}
        </main>
    )
}


export const realtimeSearch = (search) => {
    setTimeout(() => {
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
                .catch(err => {
                    console.log(err)
                });
        } else {
            setSearchResults([]);
        }
    }, 300)
}