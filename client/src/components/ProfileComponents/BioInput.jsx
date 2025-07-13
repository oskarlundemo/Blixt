import '../../styles/Profile.css'


/**
 * This component is rendered once a user want to edit their bio
 * in the Profile.jsx parent component. Then this textarea is shown
 * where they can update their bio
 *
 * @param setEditedBio set state of the new editedBio
 * @param editedBio state of the editedBio
 * @param bioLength length of the bio
 * @returns {JSX.Element}
 * @constructor
 */


export const BioInput = ({setEditedBio, editedBio, bioLength}) => {

    // This function makes sure that if the input is more than 50 chars, only arrow keys or backspace is acceptable
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