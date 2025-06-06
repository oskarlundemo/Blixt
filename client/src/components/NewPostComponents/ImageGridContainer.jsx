import {ImageBox} from "./ImageBox.jsx";
import {ImageSelectBox} from "./ImageSelectBox.jsx";
import {rectSortingStrategy, SortableContext} from "@dnd-kit/sortable";


export const ImageGridContainer = ({ images, inspectImage, removeImage, setImages }) => {
    return (
        <SortableContext
            items={images.map(image => image.id)}
            strategy={rectSortingStrategy}
        >
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

                {images.length < 10 && (
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