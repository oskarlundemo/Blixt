
import { motion } from "framer-motion";
import {CreateChatHeader} from "../CreateChatComponents/CreateChatHeader.jsx";
import {ParticipantsSection} from "../CreateChatComponents/ParticipantsSection.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {useParams} from "react-router-dom";
import {Spinner} from "../Spinner.jsx";
import {useChatContext} from "../../context/ConversationContext.jsx";
import toast from 'react-hot-toast';


export const AddNewGroupMember = ({}) => {

    const {conversationId} = useParams();
    const [searchResults, setSearchResults] = useState([]);
    const [search, setSearch] = useState("");
    const {token, API_URL} = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const {conversationMembers, setConversationMembers} = useChatContext();

    useEffect(() => {
        console.log(conversationMembers);
    }, [])

    const addNewGroupMember = async (user) => {
        setLoading(true);
        setError(false);

        await fetch(`${API_URL}/conversations/add/member/${conversationId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ user })
        })
            .then(async res => {
                const data = await res.json();
                console.log(data);
                toast.success(data.message);
                setConversationMembers(prev => [...prev, data.addedUser]);
                setSearchResults(prev => prev.filter(u => u.id !== user.id));
            })
            .catch(err => {
                toast.error(err.message || "Something went wrong");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        const delayBouncing = setTimeout(() => {
            if (search.trim().length > 0) {
                fetch(`${API_URL}/conversations/search/members/${conversationId}/?q=${search}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                        setSearchResults(data.results);
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


    return (
        <motion.main
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
                type: 'tween',
                ease: 'easeInOut',
                duration: 0.5
            }}

            style={{
                padding: '0 1rem'
            }}

            className={'add-new-group-member'}>

            {loading ? (
                <Spinner/>
            ) : (
                <>
                    <h1>Invite new member</h1>

                    <CreateChatHeader
                        add={true}
                        setSearch={setSearch}
                        search={search}
                    />

                    <ParticipantsSection
                        searchResults={searchResults}
                        search={search}
                        add={true}
                        participants={conversationMembers}
                        addMember={addNewGroupMember}
                    />
                </>
            )}

        </motion.main>
    )
}