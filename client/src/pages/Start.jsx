import {LoginForm} from "../components/StartComponents/LoginForm.jsx";
import {SmartphoneFrame} from "../components/StartComponents/SmartphoneFrame.jsx";
import {CompanyLogo} from "../components/CompanyLogo.jsx";
import '../styles/Start.css'
import {CreateForm} from "../components/StartComponents/CreateForm.jsx";
import {useState} from "react";

export const Start = ({}) => {

    const [showLogin, setShowLogin] = useState(true);

    return (
        <main className="login">

            <div className="left-container">

                <SmartphoneFrame
                    height={400}
                />

            </div>


            <div className="right-container">

                <CompanyLogo
                    height={100}
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