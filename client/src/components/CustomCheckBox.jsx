/**
 * This component is just a custom checkbox, rendered in the CreateChat.jsx
 *
 * @param checked
 * @param onChange
 * @param label
 * @returns {JSX.Element}
 * @constructor
 */


export const CustomCheckBox = ({checked, onChange, label = ''}) => {

    return (
        <label className={'custom-checkbox'}>

            <input
                type='checkbox'
                checked={checked}
                onChange={onChange}
            />

            <span className="checkmark" />
            {label && <span className="checkbox-label">{label}</span>}

        </label>
    )


}