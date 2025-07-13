import React from 'react';
import '../App.css';


/**
 * This component is just a carousel, used to render posts that have several pictures in them
 *
 * @param slides the images themselves
 * @returns {Element}
 * @constructor
 */




export const Carousel = ({ children: slides }) => {

    const [currentIndex, setCurrentIndex] = React.useState(0);

    const nextSlide = () => {
        setCurrentIndex(prevIndex =>
            prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex(prevIndex =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="carousel-wrapper">

            <div
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    transition: `transform ${200}ms`,
                }}
                className="carousel-container">
                {slides}
            </div>

                <div className="carousel-controls">
                    <button className="carousel-control-prev" onClick={prevSlide}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>
                    </button>

                    <button className="carousel-control-next" onClick={nextSlide}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
                    </button>
                </div>

            <div className="carousel-footer">
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '0.5rem',
                    alignItems: 'center',
                }} className={'indicators'}>

                    {slides.map((_, index) => (
                        <div
                            key={index}
                            style={{
                                width: '5px',
                                height: '5px',
                                backgroundColor: '#e3e3e3',
                                padding: currentIndex === index ? '1px' : 0,
                                borderRadius: '50%',
                                transition: '200ms ease-in-out',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};