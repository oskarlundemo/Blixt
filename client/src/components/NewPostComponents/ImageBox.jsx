

/**
 * This component is used for containing an image that the users has
 * selected to be in their new post in its parent container, ImageGridContainer.jsx
 *
 */

import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

export const ImageBox = ({image, id, inspectImage, removeImage}) => {
    const {attributes, listeners,
        transform, setNodeRef, transition} = useSortable({id});

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div ref={setNodeRef}
             {...attributes}
             className="image-box"
             style={style}
             onClick={(e) => {
                 e.stopPropagation();
                 inspectImage(image);
             }}
        >

            <div {...listeners} className="drag-handle" style={{ cursor: 'grab' }}>
                <img
                    src={image.preview}
                    alt="Selected preview"
                />
            </div>

            <svg
                onClick={(e) => {
                    e.stopPropagation();
                    removeImage(id);
                }}
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
                style={{ cursor: 'pointer' }}
            >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
        </div>
    );
};