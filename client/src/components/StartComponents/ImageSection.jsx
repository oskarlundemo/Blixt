

import { ImageCard } from "./ImageCard.jsx";

export const ImageSection = () => {
    return (
            <section className="start-images">

            <ImageCard
                zIndex={0}
                rotateDeg={-10}
                translateX={-60}
                boxShadow="rgba(0, 0, 0, 0.5) 0px 5px 15px"
            />

            <ImageCard
                zIndex={2}
                rotateDeg={0}
                translateX={0}
                boxShadow="rgba(0, 0, 0, 0.5) 0px 8px 25px"
            />

            <ImageCard
                zIndex={0}
                rotateDeg={10}
                translateX={60}
                boxShadow="rgba(0, 0, 0, 0.5) 0px 5px 15px"
            />
        </section>
    );
};
