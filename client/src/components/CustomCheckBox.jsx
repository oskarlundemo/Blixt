

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