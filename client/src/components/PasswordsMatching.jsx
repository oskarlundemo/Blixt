import {use, useEffect, useState} from "react";


export const PasswordMatching = ({
                                     original = '',
                                     reentered = '',
                                     setDisabled,
                                     isPasswordFocused = true
                                 }) => {
    const [isMatching, setIsMatching] = useState(false);

    // This hook is used to always runs once the password changes and validate if the password is ok
    useEffect(() => {
        console.log(reentered);
        const match = original === reentered && original.length > 0;
        setIsMatching(match);
        if (typeof setDisabled === 'function') {
            setDisabled(!match); // Disable the submit button if not matching
        }
    }, [original, reentered]);

    return (
        <div className={`checks password-checks ${isPasswordFocused ? "show" : ""}`}>
            <div className={`password-check ${isMatching ? "approved" : ""}`}>
                {isMatching ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>)
                    : (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/></svg>)}
                <p>Password matches</p>
            </div>
        </div>
    )
}