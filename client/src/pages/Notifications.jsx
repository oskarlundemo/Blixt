import {NavigationBar} from "../components/NavigationBar.jsx";


import '../styles/Notifications.css'
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {NotificationCard} from "../components/NotificationsComponents/NotificationCards.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {HeaderMenu} from "../components/HeaderMenu.jsx";
import {NoDataFound} from "../components/NoDataFound.jsx";


export const Notifications = () => {

    const [notifications, setNotifications] = useState([]);
    const [renderIndex, setRenderIndex] = useState(10);
    const [loading, setLoading] = useState(true);

    const {API_URL, token} = useAuth();

    useEffect(() => {

        fetch(`${API_URL}/notifications/load`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                setNotifications(data);
                setLoading(false);}
            )
            .catch(err => console.log(err));

    }, [])

    return (
        <main
            className={'notifications-wrapper'}>

            <HeaderMenu/>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}
                className={'notifications-section'}>

                {loading ? (
                    <LoadingTitle />
                ) : (
                    <>
                        {notifications.length > 0 ? (
                            notifications.slice(0, renderIndex).map((notification) => (
                                <NotificationCard
                                    key={notification.id}
                                    action={notification.type}
                                    user={notification.notifier}
                                    timestamp={notification.createdAt}
                                    thumbnail={notification.post?.images[0].url}
                                    post={notification.post}
                                />
                            ))
                        ) : (
                            <NoDataFound
                                message={'No notifications found.'}
                                svg={
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>
                                }/>
                        )}

                        {renderIndex < notifications.length && (
                            <button
                                style={{
                                    width: 'fit-content',
                                    alignSelf: 'center',
                                    margin: '1rem auto',
                                    display: 'block',
                                }}
                                onClick={() => setRenderIndex(renderIndex + 10)}
                            >
                                Load more
                            </button>
                        )}
                    </>
                )}

            </section>

            <NavigationBar/>

        </main>
    )



}