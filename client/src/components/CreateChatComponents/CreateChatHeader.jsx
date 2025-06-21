import {useEffect, useState} from "react";

import '../../styles/CreateChat.css'

export const CreateChatHeader = ({participants = [], add = false, search = '', removeParticipant = null, setSearch = ''}) => {

    const [numberOfParticipants, setNumberOfParticipants] = useState(0);

    useEffect(() => {
        setNumberOfParticipants(participants.length);
    }, [participants]);

    return (
        <section className={'create-chat-header'}>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <h2
                    style={{
                        width: 'fit-content',
                        margin: '0 1rem'
                    }}
                >
                    {add ? 'Add:' : 'To:'}
                </h2>

                {participants && (
                    <div

                        style={{
                            minHeight: "55px",
                        }}
                        className={'participants-container'}>
                        {participants.map((participant) => (
                            <div key={participant.id}>
                                <p>{participant.username}</p>

                                <svg
                                    onClick={() => removeParticipant(participant)}
                                    xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                                </svg>
                            </div>
                        ))}

                    </div>
                )}

                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

            </div>

            {!add && (
                <p
                    style={{
                        display: 'block',
                        textAlign: 'right',
                    }}>{numberOfParticipants} / 5</p>
            )}

        </section>
    )
}