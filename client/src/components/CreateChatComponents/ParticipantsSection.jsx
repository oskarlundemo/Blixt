import {SelectableUserCard} from "./SelectableUserCard.jsx";


export const ParticipantsSection = ({searchResults, addParticipant, removeParticipant, following, participants}) => {

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
                    />
                ))
            ) : (
                (following.length > 0 ? (
                    following.map((entry) => (
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
                    ))
                ) : (
                    <p>No following</p>
                ))
            )}
        </section>
    );
};
