import {useEffect} from "react";

import '../../styles/CreateChat.css'

export const CreateChatHeader = ({participants, search, addParticipant, setSearch}) => {

    useEffect(() => {
        console.log(participants);
    }, [participants]);

    return (
        <section className={'create-chat-header'}>

            <h2>To:</h2>

            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {participants && (
                <div className={'participants-container'}>
                    {participants.map((participant) => (

                        <div key={participant.id}>
                            <p key={participant.id}>{participant.username}</p>

                            <svg

                                onClick={() => addParticipant(participant)}

                                xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                        </div>

                    ))}
                </div>
            )}

        </section>
    )
}