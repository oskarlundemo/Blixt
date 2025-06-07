
import '../styles/NewPost.css'
import {useEffect, useState} from "react";
import {NavigationBar} from "../components/NavigationBar.jsx";
import {closestCorners, DndContext, PointerSensor, TouchSensor, useSensor, useSensors} from "@dnd-kit/core";
import {ImageGridContainer} from "../components/NewPostComponents/ImageGridContainer.jsx";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {Overlay} from "../components/Overlay.jsx";
import {PopUpModule} from "../components/PopUpModule.jsx";
import {useAuth} from "../context/AuthContext.jsx";


export const NewPost = ({}) => {


    const {API_URL} = useAuth();
    const {user} = useAuth();
    const [caption, setCaption] = useState('');
    const [images, setImages] = useState([])
    const [numberOfImages, setNumberOfImages] = useState(0);

    const [showPopup, setShowPopup] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);


    useEffect(() => {
        setNumberOfImages(images.length)
        console.log(images)
    }, [images])

    const removeImage = (id) => {
        setImages(prev => prev.filter(image => image.id !== id));
    };


    const inspectImage = (image) => {
        console.log('Image clicked:', image);
        setSelectedImage(image);
        setShowPopup(true);
        setShowOverlay(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('caption', caption);

        images.forEach((image) => {
            formData.append('images', image.file);
        });

        try {
            const response = await fetch(`${API_URL}/posts/new/${user.sub}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();



        } catch (err) {
            console.error('Error submitting post:', err);
        }
    };

    const getImagePos = id => images.findIndex(image => image.id === id)

    const handleDragEnd = (e) => {
        const {active, over} = e;

        if (active.id === over.id) return;

        setImages(images => {
            const originalPos = getImagePos(active.id)
            const newPos = getImagePos(over.id)

            return arrayMove(images, originalPos, newPos)
        })
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 10,
            },
        })
    );


    return (
        <main className="new-post-container">


            <section className={'new-post-images-container'}>

                <DndContext
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCorners}>
                        <ImageGridContainer
                            inspectImage={inspectImage}
                            images={images}
                            removeImage={removeImage}
                            setImages={setImages}/>
                </DndContext>

                <span>{numberOfImages} / 10</span>

            </section>


            <section className="new-post-description">


                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Caption</legend>
                        <textarea
                            name="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Write something about your post..."
                            rows="5"
                            cols="50"
                        />
                    </fieldset>

                    <button disabled={images.length === 0} type="submit">Post</button>
                </form>

            </section>


            <NavigationBar/>

            <PopUpModule images={images} showPopup={showPopup}/>

            <Overlay showOverlay={showOverlay}/>

        </main>
    )
}