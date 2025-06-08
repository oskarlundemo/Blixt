




import React from 'react';
import '../App.css';

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
                <div className={'indicators'}>

                    {slides.map((_, index) => (
                        (currentIndex === index ? (




                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-280q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm0 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/></svg>
                        ))
                    ))}
                </div>
            </div>
        </div>
    );
};