import { ImageCard } from "./ImageCard.jsx";


/**
 * This component is rendered in the Start.jsx page when a user want to log-in,
 * it is just for UI / design purposes
 *
 * @returns {JSX.Element}
 * @constructor
 */


export const ImageSection = () => {
    return (
            <section className="start-images">
            <ImageCard
                imgSrc={'travel.jpg'}
                zIndex={0}
                rotateDeg={-10}
                translateX={-60}
                boxShadow="rgba(0, 0, 0, 0.5) 0px 5px 15px"
            />

            <ImageCard
                imgSrc={'people.jpg'}
                zIndex={2}
                rotateDeg={0}
                translateX={0}
                boxShadow="rgba(0, 0, 0, 0.5) 0px 8px 25px"
            />

            <ImageCard
                imgSrc={'tacos.jpg'}
                zIndex={0}
                rotateDeg={10}
                translateX={60}
                boxShadow="rgba(0, 0, 0, 0.5) 0px 5px 15px"
            />
        </section>
    );
};
