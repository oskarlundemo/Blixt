import '../styles/NewPost.css'
import {useEffect, useState} from "react";
import {NavigationBar} from "../components/NavigationBar.jsx";
import {closestCorners, DndContext, PointerSensor, TouchSensor, useSensor, useSensors} from "@dnd-kit/core";
import {ImageGridContainer} from "../components/NewPostComponents/ImageGridContainer.jsx";
import {arrayMove} from "@dnd-kit/sortable";
import {Overlay} from "../components/Overlay.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {HeaderMenu} from "../components/HeaderMenu.jsx";
import toast from "react-hot-toast";

/**
 * This component is rendered when a user wants to create a new post
 *
 * @returns {JSX.Element}
 * @constructor
 */




export const NewPost = ({}) => {

    const {API_URL, token} = useAuth(); // Token from context
    const [caption, setCaption] = useState(''); // Of the new post
    const [images, setImages] = useState([]); // Array to hold the images
    const [numberOfImages, setNumberOfImages] = useState(0); // State to check the length
    const [uploading, setUploading] = useState(false); // Uploading animation

    const [showOverlay, setShowOverlay] = useState(false); // Show backdrop
    const [selectedImage, setSelectedImage] = useState(null); // Set select image

    // This hook keeps track of the number of images
    useEffect(() => {
        setNumberOfImages(images.length)
    }, [images])

    // This function removes images from the array
    const removeImage = (id) => {
        setImages(prev => prev.filter(image => image.id !== id));
    };

    // If a users want to take a closer look at an image
    const inspectImage = (image) => {
        setSelectedImage(image);
        setShowOverlay(true);
    }

    // This function handles submission of the post
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('caption', caption);
        images.forEach((image) => {
            formData.append('images', image.file);
        });

        setUploading(true);

        try {
            const response = await fetch(`${API_URL}/posts/create/new`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                setCaption('');
                setImages([]);
                setUploading(false);
                toast.success('Post created');
            } else {
                toast.error('Failed to create post');
                console.error('Failed to submit post');
                setUploading(false);
            }
        } catch (err) {
            setUploading(false);
            console.error('Error submitting post:', err);
        }
    };

    // Returns the index of an image in the array by its unique `id`
    const getImagePos = id => images.findIndex(image => image.id === id)

    // Handles what happens after a drag-and-drop action is completed
    const handleDragEnd = (e) => {
        const {active, over} = e;
        if (active.id === over.id) return;
        setImages(images => {
            const originalPos = getImagePos(active.id)
            const newPos = getImagePos(over.id)

            return arrayMove(images, originalPos, newPos)
        })
    }

    // Define input sensors for drag-and-drop interactions
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
            {uploading && (
                <div className="uploading-overlay">
                    <div className="uploading-spinner"></div>
                </div>
            )}

            <HeaderMenu/>

            <section className={'new-post-images-container'}>

                <DndContext
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCorners}>
                        <ImageGridContainer
                            inspectImage={inspectImage}
                            images={images}
                            removeImage={removeImage}
                            setImages={setImages}
                            uploading={uploading}
                        />
                </DndContext>

                <span>{numberOfImages} / 10</span>

            </section>

            <section className="new-post-description">

                <form onSubmit={handleSubmit}>
                    <fieldset disabled={uploading}>
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
            <Overlay showOverlay={showOverlay}/>

        </main>
    )
}