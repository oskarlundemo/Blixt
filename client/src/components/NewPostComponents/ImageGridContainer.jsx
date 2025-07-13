/**
 * This component is used for wrapping and containing all the
 * images that a user has selected for their new post in the NewPost.jsx page.
 *
 * In this component I have also used dnd-kit to make the images re-arrangeable
 * by drag-and-drop, if the user want to change the order before posting
 */

import {ImageBox} from "./ImageBox.jsx";
import {ImageSelectBox} from "./ImageSelectBox.jsx";
import {rectSortingStrategy, SortableContext} from "@dnd-kit/sortable";


export const ImageGridContainer = ({ images, uploading, inspectImage, removeImage, setImages }) => {
    return (
        <SortableContext
            items={images.map(image => image.id)}
            strategy={rectSortingStrategy}>
            <div className="image-grid-container">
                {images.map((image, i) => (
                    <ImageBox
                        key={image.id}
                        image={image}
                        index={i}
                        id={image.id}
                        removeImage={removeImage}
                        inspectImage={inspectImage}
                    />
                ))}

                {(images.length < 10 && !uploading) && (
                    <ImageSelectBox
                        images={images}
                        setImages={setImages}
                        key={'select-box'}
                    />
                )}
            </div>
        </SortableContext>
    );
};