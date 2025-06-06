



export const PopUpModule = ({ showPopup, selectedImage }) => {
    return (
        <div className={`pop-up ${showPopup ? '' : 'hide'}`}>
            {selectedImage ? (
                <img
                    src={selectedImage.preview}
                    alt="Popup preview"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
            ) : (
                <p>No image selected</p>
            )}
        </div>
    );
};