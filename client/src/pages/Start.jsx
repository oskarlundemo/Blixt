import {LoginForm} from "../components/StartComponents/LoginForm.jsx";
import {SmartphoneFrame} from "../components/StartComponents/SmartphoneFrame.jsx";
import {CompanyLogo} from "../components/CompanyLogo.jsx";
import '../styles/Start.css'
import {CreateForm} from "../components/StartComponents/CreateForm.jsx";
import {useState} from "react";

export const Start = ({}) => {

    const [showLogin, setShowLogin] = useState(true);

    return (
        <main className="start">

            <CompanyLogo
                height={300}
            />

            <div className='start-container'>

                <SmartphoneFrame
                    height={500}
                />

                {showLogin ? (
                    <LoginForm setShowLogin={setShowLogin} />
                ) : (
                    <CreateForm setShowLogin={setShowLogin} />
                )}

            </div>

        </main>
    )

}