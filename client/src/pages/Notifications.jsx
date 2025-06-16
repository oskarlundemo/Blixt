import {NavigationBar} from "../components/NavigationBar.jsx";


import '../styles/Notifications.css'
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {NotificationCard} from "../components/NotificationsComponents/NotificationCards.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {HeaderMenu} from "../components/HeaderMenu.jsx";


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
                            <p style={{ textAlign: 'center' }}>No notifications found.</p>
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