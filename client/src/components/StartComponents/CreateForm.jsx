import {Inputfield} from "../InputField.jsx";
import {SectionSplitter} from "../SectionSplitter.jsx";
import {useEffect, useState} from "react";
import {UsernameCheck} from "./UsernameCheck.jsx";
import {EmailCheck} from "./EmailCheck.jsx";
import {PasswordChecks} from "./PasswordChecks.jsx";
import { supabase } from '../../services/SupabaseClient.js';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";



export const CreateForm = ({setShowLogin}) => {


    const {login} = useAuth();
    const navigate = useNavigate();  // Used to navigate to chats after creation is successful
    const [errors, setErrors] = useState([]);
    const [disabled, setDisabled] = useState(true);

    const [isPasswordFocused, setPasswordFocused] = useState(false);  // State to check if password is focused
    const [isUsernameFocused, setUsernameFocused] = useState(false); // State to check if username input is focus
    const [isEmailFocused, setEmailFocused] = useState(false); // State to check if email input is focused

    const [acceptedPassword, setAcceptedPassword] = useState(false); // State to check if password meets requirements
    const [acceptedUsername, setAcceptedUsername] = useState(false); // State to check if username meets requirements
    const [acceptedEmail, setAcceptedEmail] = useState(false);  // State to check if email meets requirements


    useEffect(() => {
        setDisabled(!(acceptedEmail && acceptedPassword && acceptedUsername));
    }, [acceptedEmail, acceptedPassword, acceptedUsername]);

    const [formData, setFormData] = useState({
        password: "",
        username: "",
        email: "",
    });

    // This function is used for updating the state of the form
    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: value
            };
            return updatedData;
        });


    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password, username } = formData;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                },
            },
        });

        if (error) {
            setErrors([error.message]);
        } else {
            console.log("User signed up!", data);

            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });


            if (signInError) {
                setErrors([signInError.message]);
                return;
            }

            if (signInData.session) {
                login(signInData.session.access_token);
                navigate("/feed");
            }
        }
    };


    return (
        <section className="create-section">

            <h1>Sign up</h1>

            <form onSubmit={handleSubmit}>

                <Inputfield
                    type="text"
                    title='Username'
                    id='username'
                    name='username'
                    value={formData.username}
                    onChange={handleInputChange}
                    example={'Enter username'}
                    onFocus={() => setUsernameFocused(true)}  // Add this
                    onBlur={() => setUsernameFocused(false)}  // And this
                    svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>}
                />

                <UsernameCheck
                    username={formData.username}
                    setAcceptedUsername={setAcceptedUsername}
                    isUsernameFocused={isUsernameFocused}
                    errors={errors}
                    name="username"
                />

                <Inputfield
                    type='email'
                    title='Email'
                    name='email'
                    id='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    example={'johndoe@gmail.com'}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}

                    svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>}
                />

                <EmailCheck
                    email={formData.email}
                    setAcceptedEmail={setAcceptedEmail}
                    isEmailFocused={isEmailFocused}
                    errors={errors}
                    name="email"
                />


                <Inputfield
                    type='password'
                    title='Password'
                    name='password'
                    id='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    example={'*******'}
                    svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M80-200v-80h800v80H80Zm46-242-52-30 34-60H40v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Z"/></svg>}
                />

                <PasswordChecks
                    password={formData.password}
                    setAcceptedPassword={setAcceptedPassword}
                    isPasswordFocused={isPasswordFocused}
                />

                <button disabled={disabled} type="submit">Create</button>

            </form>

            <SectionSplitter/>


            <button className='google-box'>
                <p>Sign up with Google</p>

                <svg viewBox="0 0 128 128">
                    <path fill="#fff" d="M44.59 4.21a63.28 63.28 0 004.33 120.9 67.6 67.6 0 0032.36.35 57.13 57.13 0 0025.9-13.46 57.44 57.44 0 0016-26.26 74.33 74.33 0 001.61-33.58H65.27v24.69h34.47a29.72 29.72 0 01-12.66 19.52 36.16 36.16 0 01-13.93 5.5 41.29 41.29 0 01-15.1 0A37.16 37.16 0 0144 95.74a39.3 39.3 0 01-14.5-19.42 38.31 38.31 0 010-24.63 39.25 39.25 0 019.18-14.91A37.17 37.17 0 0176.13 27a34.28 34.28 0 0113.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0087.2 4.59a64 64 0 00-42.61-.38z"></path><path fill="#e33629" d="M44.59 4.21a64 64 0 0142.61.37 61.22 61.22 0 0120.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 00-13.64-8 37.17 37.17 0 00-37.46 9.74 39.25 39.25 0 00-9.18 14.91L8.76 35.6A63.53 63.53 0 0144.59 4.21z"></path><path fill="#f8bd00" d="M3.26 51.5a62.93 62.93 0 015.5-15.9l20.73 16.09a38.31 38.31 0 000 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 01-5.5-40.9z"></path><path fill="#587dbd" d="M65.27 52.15h59.52a74.33 74.33 0 01-1.61 33.58 57.44 57.44 0 01-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0012.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z"></path><path fill="#319f43" d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0044 95.74a37.16 37.16 0 0014.08 6.08 41.29 41.29 0 0015.1 0 36.16 36.16 0 0013.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 01-25.9 13.47 67.6 67.6 0 01-32.36-.35 63 63 0 01-23-11.59A63.73 63.73 0 018.75 92.4z"></path>
                </svg>
            </button>

            <span>Already have an account? <a onClick={() => setShowLogin(true)}>Login</a></span>

        </section>
    )

}