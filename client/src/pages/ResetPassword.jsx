import {useEffect, useState} from "react";
import {Inputfield} from "../components/InputField.jsx";
import {supabase} from "../services/SupabaseClient.js";
import {PasswordChecks} from "../components/StartComponents/PasswordChecks.jsx";


export const ResetPassword = ({}) => {

    const [newPassword, setNewPassword] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [acceptedPassword, setAcceptedPassword] = useState(false); // State to check if password meets requirements
    const [errors, setErrors] = useState([]);


    useEffect(() => {

    }, [])

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            console.log(error);
            setErrors([
                { path: "password", msg: error.message },
            ]);
        } else {
            console.log('Successfully updated password');
        }
    };

    return (
        <main className={'reset-password-container'}>


            <form onSubmit={handleUpdatePassword}>

                <Inputfield
                    type='password'
                    title='Password'
                    name='password'
                    id='password'
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    onFocus={null}
                    onBlur={null}
                    example={'*******'}
                    svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M80-200v-80h800v80H80Zm46-242-52-30 34-60H40v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Z"/></svg>}
                />

                <PasswordChecks
                    password={newPassword}
                    setAcceptedPassword={setAcceptedPassword}
                    isPasswordFocused={true}
                />

                <button disabled={!acceptedPassword} type="submit">Update Password</button>

            </form>

        </main>
    )



}