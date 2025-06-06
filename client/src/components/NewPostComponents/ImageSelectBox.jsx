import {useRef} from "react";
import { v4 as uuidv4 } from 'uuid';


export const ImageSelectBox = ({setImages}) => {

    const pictureInputRef = useRef(null);

    const handleFileAdd = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const imageWithPreview = {
                file,
                id: uuidv4(),
                preview: reader.result
            };

            setImages(prev => [...prev, imageWithPreview]);
        };

        reader.readAsDataURL(file);
    };

    const handleButtonClick = () => {
        pictureInputRef.current.click();
    };

    return (
        <div className={'file-select-box'}>
            <input
                type='file'
                ref={pictureInputRef}
                onChange={handleFileAdd}
                accept="image/*"
                style={{ display: 'none' }}
            />

            <button
                onClick={handleButtonClick}
                className={'file-btn'}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>            </button>
        </div>
    )
}