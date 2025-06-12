

import '../App.css'



export const LoadingTitle = () => {


    return (
        <h2
            style={{
                textAlign: "center",
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)", // This centers the element properly
            }}>
            Loading


            <span
                style={{
                    animation: "bounce 1s infinite ease-in-out",
                    animationDelay: "0s",
                    display: "inline-block",
                }}
            >.</span>
            <span
                style={{
                    animation: "bounce 1s infinite ease-in-out",
                    animationDelay: "0.4s",
                    display: "inline-block",
                }}
            >.</span>
            <span
                style={{
                    animation: "bounce 1s infinite ease-in-out",
                    animationDelay: "0.6s",
                    display: "inline-block",
                }}
            >.</span>
        </h2>

    )


}