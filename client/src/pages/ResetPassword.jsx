import {useEffect, useState} from "react";
import {Inputfield} from "../components/InputField.jsx";
import {supabase} from "../services/SupabaseClient.js";
import {PasswordChecks} from "../components/StartComponents/PasswordChecks.jsx";
import {HeaderMenu} from "../components/HeaderMenu.jsx";
import '../styles/ResetPassword.css'
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {PasswordMatching} from "../components/PasswordsMatching.jsx";

/**
 * This component is rendered when a user needs to reset their password
 *
 * @returns {JSX.Element}
 * @constructor
 */


export const ResetPassword = ({}) => {

    const navigate = useNavigate(); // Used for navigation
    const [newPassword, setNewPassword] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [acceptedPassword, setAcceptedPassword] = useState(false); // State to check if password meets requirements
    const [seconds, setSeconds] = useState(3); // State to hold countdown timer
    const [reenterPassword, setReenterPassword] = useState(''); // State to hold the reentered password

    // This function handles the submission of the updated password to Supabase
    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            toast.error(error.message); // If errors, display it in a toast
        } else {
            let count = 3;

            // Start counting with a toast
            let toastId = toast.loading(`Successfully updated password. Redirecting in ${count} seconds...`, {
                duration: Infinity, // Keep it visible until dismissed manually
            });

            // Start countdown
            const interval = setInterval(() => {
                count -= 1;
                setSeconds(count);

                toast.dismiss(toastId);
                toastId = toast.loading(`Successfully updated password. Redirecting to homepage in ${count} seconds...`, {
                    duration: Infinity,
                });

                if (count <= 0) {
                    clearInterval(interval);
                    toast.dismiss(toastId);
                    navigate('/');
                }
            }, 1000);
        }
    };


    return (
        <main className={'reset-password-container'}>

            <HeaderMenu
                dms={false}
            />


            <section className={'reset-password-wrapper'}>

                <h1>Reset password</h1>

                <form
                    className="reset-password-form"
                    onSubmit={handleUpdatePassword}>

                    <Inputfield
                        type='password'
                        title='New password'
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

                    <Inputfield
                        type='password'
                        title='Re-enter password'
                        name='password'
                        id='password'
                        value={reenterPassword}
                        onChange={e => setReenterPassword(e.target.value)}
                        onFocus={null}
                        onBlur={null}
                        example={'*******'}
                        svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M80-200v-80h800v80H80Zm46-242-52-30 34-60H40v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Z"/></svg>}
                    />

                    <PasswordMatching
                        original={newPassword}
                        reentered={reenterPassword}
                        setDisabled={setDisabled}
                        isPasswordFocused={true}
                    />

                    <button disabled={disabled} type="submit">Update Password</button>
                </form>

            </section>

        </main>
    )
}