import {Inputfield} from "../InputField.jsx";
import {useEffect, useState} from "react";
import {SectionSplitter} from "../SectionSplitter.jsx";
import {supabase} from "../../services/SupabaseClient.js";
import {useNavigate} from "react-router-dom";
import {Spinner} from "../Spinner.jsx";


export const LoginForm = ({setShowLogin}) => {

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [resetDisabled, setResetDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        password: "",
        email: "",
    });

    useEffect(() => {
        setResetDisabled(!(formData.email.length > 0));
    }, [formData.email]);

    useEffect(() => {
        setDisabled(!(formData.password.length > 0 && formData.email.length > 0));
    }, [formData])


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

        setLoading(true);

        const { email, password } = formData;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });


        if (error) {
            setErrors([
                { path: "email", msg: "Invalid login credentials" },
                { path: "password", msg: "Invalid login credentials" }
            ]);
            setLoading(false);
            return;
        }

        if (data.session) {
            setLoading(false);
            navigate("/feed");
        }
    };


    const handleForgotPassword = async (e) => {
        e.preventDefault();

        console.log('Clicking forgot');

        const {email} = formData;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:5173/reset-password'
        });

        if (error) {
            console.error('Error sending reset email:', error.message);
        } else {
            console.log('Password reset email sent!');
        }
    };



    return (
        <section className="login-section">

            <h1>Login</h1>

            {loading && (
                <Spinner/>
            )}

            <form onSubmit={handleSubmit}>

                <Inputfield
                    type="email"
                    title='Email'
                    id='username'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    example={'Enter username'}
                    svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>}
                />

                <Inputfield
                    type='password'
                    title='Password'
                    errors={errors}
                    name='password'
                    id='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    example={'*******'}
                    svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M80-200v-80h800v80H80Zm46-242-52-30 34-60H40v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Z"/></svg>}
                />

                <button disabled={disabled} type="submit">Login</button>

            </form>

            <SectionSplitter/>


            <div
                className="start-footer">

                <button className='google-box'>
                    <p>Sign in with Google</p>

                    <svg viewBox="0 0 128 128">
                        <path fill="#fff" d="M44.59 4.21a63.28 63.28 0 004.33 120.9 67.6 67.6 0 0032.36.35 57.13 57.13 0 0025.9-13.46 57.44 57.44 0 0016-26.26 74.33 74.33 0 001.61-33.58H65.27v24.69h34.47a29.72 29.72 0 01-12.66 19.52 36.16 36.16 0 01-13.93 5.5 41.29 41.29 0 01-15.1 0A37.16 37.16 0 0144 95.74a39.3 39.3 0 01-14.5-19.42 38.31 38.31 0 010-24.63 39.25 39.25 0 019.18-14.91A37.17 37.17 0 0176.13 27a34.28 34.28 0 0113.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0087.2 4.59a64 64 0 00-42.61-.38z"></path><path fill="#e33629" d="M44.59 4.21a64 64 0 0142.61.37 61.22 61.22 0 0120.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 00-13.64-8 37.17 37.17 0 00-37.46 9.74 39.25 39.25 0 00-9.18 14.91L8.76 35.6A63.53 63.53 0 0144.59 4.21z"></path><path fill="#f8bd00" d="M3.26 51.5a62.93 62.93 0 015.5-15.9l20.73 16.09a38.31 38.31 0 000 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 01-5.5-40.9z"></path><path fill="#587dbd" d="M65.27 52.15h59.52a74.33 74.33 0 01-1.61 33.58 57.44 57.44 0 01-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0012.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z"></path><path fill="#319f43" d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0044 95.74a37.16 37.16 0 0014.08 6.08 41.29 41.29 0 0015.1 0 36.16 36.16 0 0013.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 01-25.9 13.47 67.6 67.6 0 01-32.36-.35 63 63 0 01-23-11.59A63.73 63.73 0 018.75 92.4z"></path>
                    </svg>
                </button>

                <button disabled={resetDisabled} onClick={handleForgotPassword} type="submit">Forgot password?</button>


                <span>Don't have an account? <a onClick={() => setShowLogin(false)}>Create one</a></span>
            </div>



        </section>
)
}