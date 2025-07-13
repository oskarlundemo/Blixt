
import { motion } from "framer-motion";
import {CreateChatHeader} from "../CreateChatComponents/CreateChatHeader.jsx";
import {ParticipantsSection} from "../CreateChatComponents/ParticipantsSection.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {useParams} from "react-router-dom";
import {Spinner} from "../Spinner.jsx";
import {useChatContext} from "../../context/ConversationContext.jsx";
import toast from 'react-hot-toast';


/**
 * This component is rendered when an admin of a group conversation
 * wants to add new members to an existing group. It is called in the ConfigureChat.jsx component
 *
 * @returns {JSX.Element}
 * @constructor
 */

export const AddNewGroupMember = ({}) => {

    const {conversationId} = useParams(); // Get the id of the conversation through the params
    const [searchResults, setSearchResults] = useState([]); // State to hold the results of users
    const [search, setSearch] = useState(""); // State to set the search query
    const {token, API_URL} = useAuth(); // Get the users token from the AuthContext.jsx
    const [loading, setLoading] = useState(false); // State to check if the db is done loading
    const {conversationMembers, setConversationMembers} = useChatContext(); // State containing the members of the conversation from ConversationContext.jsx


    // This function is used for handeling new conversations members
    const addNewGroupMember = async (user) => {

        setLoading(true); // Start the loading animation

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
                toast.success(data.message); // Show a toast displaying success
                setConversationMembers(prev => [...prev, data.addedUser]); // Append the added users into the array of conversation members
                setSearchResults(prev => prev.filter(u => u.id !== user.id)); //
            })
            .catch(err => {
                toast.error(err.message || "Something went wrong"); // There was an error adding the user to the conversation
            })
            .finally(() => {
                setLoading(false); // Always set loading to false anyways
            });
    };

    // This hook is used for creating a search as you write effect, displaying results for each letter entered
    useEffect(() => {
        const delayBouncing = setTimeout(() => { // Wrap it inside a timer to minimize fetches and prevent bad performance
            if (search.trim().length > 0) { // If the search string is empty, do nothing
                fetch(`${API_URL}/conversations/search/members/${conversationId}/?q=${search}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        setSearchResults(data.results);
                    })
                    .catch(err => {
                        toast.error(err.message || 'There was an error handeling your search query.');
                        console.log('There was an error handeling your search query.');
                    });
            } else {
                setSearchResults([]); // If there is no search query, show no results
            }
        }, 300)
        return () => clearTimeout(delayBouncing); // Clean up
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
                <Spinner/> // Show the loading animation
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