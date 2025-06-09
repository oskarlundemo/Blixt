

import '../../styles/Profile.css'

export const BioInput = ({setEditedBio, editedBio, bioLength}) => {



    const handleKeyDown = (e) => {
        const allowedKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
        ];

        if (editedBio.length >= 100 && !allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    };


    return (

        <div className="bio-continer">
            <div className="bio-input">

              <textarea
                  value={editedBio}
                  onChange={e => setEditedBio(e.target.value)}
                  onKeyDown={handleKeyDown}
              />

            </div>

            <span>{bioLength} / 100</span>

        </div>
    )
}