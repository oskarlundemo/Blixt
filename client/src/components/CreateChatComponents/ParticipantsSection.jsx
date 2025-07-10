import { SelectableUserCard } from "./SelectableUserCard.jsx";

export const ParticipantsSection = ({
                                        searchResults = [],
                                        addMember = null,
                                        addParticipant = null,
                                        removeParticipant = null,
                                        following = [],
                                        participants = [],
                                        add = false,
                                        search = ''
                                    }) => {
    return (
        <section className={'participants-section'}>
            {searchResults.length > 0 ? (
                searchResults.map((user) => (
                    <SelectableUserCard
                        key={user.id}
                        avatar={user}
                        user={user}
                        username={user.username}
                        addParticipant={addParticipant}
                        id={user.id}
                        removeParticipant={removeParticipant}
                        isSelected={participants.some(p => p.id === user.id)}
                        add={add}
                        addNewGroupMember={addMember}
                    />
                ))
            ) : (
                !add ? (
                    following.length > 0 ? (
                        <>
                            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--light-grey)' }}>Suggested:</p>
                            {following.map((entry) => (
                                <SelectableUserCard
                                    key={entry.followed.id}
                                    username={entry.followed.username}
                                    avatar={entry.followed}
                                    user={entry.followed}
                                    addParticipant={addParticipant}
                                    id={entry.followed.id}
                                    removeParticipant={removeParticipant}
                                    isSelected={participants.some(p => p.id === entry.followed.id)}
                                />
                            ))}
                        </>
                    ) : (
                        <p
                            style={{
                                textAlign: 'center',
                                opacity: '0.5',
                            }}
                        >Users you follow are shown here</p>
                    )
                ) : (
                    search.length > 0 && (
                        <p style={{ textAlign: "center" }}>
                            No results with: "{search}"
                        </p>
                    )
                )
            )}
        </section>
    );
};
