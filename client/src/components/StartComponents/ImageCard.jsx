/**
 * This component is used for holding an image that is rendered in its parent
 * container, ImageSection.sjx
 *
 * @param imgSrc to the image
 * @param height of the image
 * @param width of the image
 * @param zIndex in the layout
 * @param rotateDeg rotation
 * @param translateX move by the x-axis
 * @param boxShadow style
 * @returns {JSX.Element}
 * @constructor
 */


export const ImageCard = ({
                              imgSrc = '',
                              height = 450,
                              width = 250,
                              zIndex = 0,
                              rotateDeg = 0,
                              translateX = 0,
                              boxShadow = ''
                          }) => {
    return (
        <div
            style={{
                zIndex,
                position: 'absolute',
                transform: `translateX(${translateX}%) rotate(${rotateDeg}deg)`,
                borderRadius: `10px`,
                overflow: 'hidden',
                boxShadow,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            className="start-image-wrapper">
            <img
                style={{
                    height: `${height}px`,
                    width: `${width}px`,
                }}
                draggable={false}
                src={imgSrc || 'sigge.jpeg'}
                alt=""
            />
        </div>
    );
};