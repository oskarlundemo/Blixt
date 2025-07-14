import {LoginForm} from "../components/StartComponents/LoginForm.jsx";
import {CompanyLogo} from "../components/CompanyLogo.jsx";
import '../styles/Start.css'
import {CreateForm} from "../components/StartComponents/CreateForm.jsx";
import {useState} from "react";
import {ImageSection} from "../components/StartComponents/ImageSection.jsx";
import {StartPageFooter} from "../components/StartComponents/StartPageFooter.jsx";

export const Start = ({}) => {

    const [showLogin, setShowLogin] = useState(true);

    return (
        <main className="start">

            <CompanyLogo/>


            <section className="content">
                <ImageSection/>

                {showLogin ? (
                    <LoginForm setShowLogin={setShowLogin} />
                ) : (
                    <CreateForm setShowLogin={setShowLogin} />
                )}
            </section>

            <StartPageFooter/>

        </main>
    )

}