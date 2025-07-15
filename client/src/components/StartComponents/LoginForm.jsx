import {Inputfield} from "../InputField.jsx";
import {useEffect, useState} from "react";
import {SectionSplitter} from "../SectionSplitter.jsx";
import {supabase} from "../../services/SupabaseClient.js";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Spinner} from "../Spinner.jsx";
import toast from "react-hot-toast";
import {useAuth} from "../../context/AuthContext.jsx";

/**
 * This component is rendered when a user wants to log-in
 * in the Start.jsx page
 *
 * @param setShowLogin state to either show this component or CreateForm.jsx
 * @returns {JSX.Element}
 * @constructor
 */


export const LoginForm = ({setShowLogin}) => {

    const navigate = useNavigate(); // Use this hook for navigation
    const {API_URL} = useAuth();
    const [errors, setErrors] = useState([]); // State to hold errors
    const [disabled, setDisabled] = useState(true); // State to prevent submission if input is not valid
    const [isEmailValid, setIsEmailValid] = useState(false); // State to prevent "forget password" if there is not a valid email
    const [loading, setLoading] = useState(false); // State to check if loading


    // State to hold the data from the fomr
    const [formData, setFormData] = useState({
        password: "",
        email: "",
    });

    useEffect(() => {
        setDisabled(!(formData.password.length > 0 && formData.email.length > 0));
    }, [formData])

    // This function validates so that the email is ok
    const validateEmail = (email) => {
        const standardEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = standardEmailFormat.test(email);
        setIsEmailValid(!valid)
    };

    // If a user has forgotten their password, they need to pass a valid email
    useEffect(() => {
        validateEmail(formData.email);
    }, [formData.email]);

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


    // This function is used for logging in with the guest account
    const handleGuestLogin = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login/guest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });


            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData?.error || 'Something went wrong with the guest account!');
                setLoading(false);
                return;
            }

            const backendData = await response.json();
            console.log(backendData.message);

            const { data, error } = await supabase.auth.setSession({
                access_token: backendData.session.access_token,
                refresh_token: backendData.session.refresh_token,
            });

            setLoading(false);
            navigate("/feed");
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong with the guest account!');
            setLoading(false);
        }
    };

    // This function is used for handeling the submission of the login form
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

    // This function is used for handeling the form submission
    const handleForgotPassword = async (e) => {
        e.preventDefault();

        const {email} = formData;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:5173/reset-password'
        });

        if (error) {
            toast.error(error.message);
            console.error('Error sending reset email:', error.message);
        } else {
            toast.success('Password reset email sent!');
        }
    };



    return (
        <section className="login-section">

            <h1 className="form-box-title">Login on Blixt</h1>

            {loading && (<Spinner/>)}

            <form onSubmit={handleSubmit}>

                <Inputfield
                    type="email"
                    title='Email'
                    id='username'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    example={'Enter email'}
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

                <button
                    className={'start-buttons'}
                    disabled={disabled}
                    type="submit">Login</button>

            </form>

            <SectionSplitter/>


            <div
                className="start-footer">

                <button
                    disabled={isEmailValid}
                    onClick={handleForgotPassword}
                    type="submit">Forgot password?
                </button>

                <p>Don't have an account? {''}
                    <span
                    style={{
                        color: 'var(--accent-color)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                    }}
                    onClick={() => setShowLogin(false)}>Create one</span></p>
                <p>Continue as {''}
                    <span

                        style={{
                            color: 'var(--accent-color)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }}

                    onClick={() => handleGuestLogin()}>
                    guest
                </span>
                </p>
            </div>



        </section>
)
}