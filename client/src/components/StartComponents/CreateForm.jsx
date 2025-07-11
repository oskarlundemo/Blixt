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


    const {login, user, API_URL} = useAuth();
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

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                },
            },
        });

        if (signUpError) {
            setErrors([signUpError.message]);
            return;
        }

        const newUser = signUpData.user;

        const response = await fetch(`${API_URL}/auth/signup/supabase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: newUser.id,
                email: newUser.email,
                username: newUser.user_metadata.username || username,
            }),
        });

        if (!response.ok) {
            const err = await response.json();
            setErrors([err.error || "Failed to create user"]);
            return;
        }

        if (signUpData.session) {
            navigate("/feed");
        } else {
            setErrors(["Check your inbox to confirm your email before logging in."]);
        }
    };


    return (
        <section className="create-section">


            <h1
                className="form-box-title"
            >Sign up to Blixt</h1>


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

                <button
                    className={'start-buttons'}
                    disabled={disabled}
                    type="submit">Create</button>

            </form>

            <SectionSplitter/>


            <div className="start-footer">
                <span>Already have an account? <a onClick={() => setShowLogin(true)}>Login</a></span>
            </div>

        </section>
    )

}