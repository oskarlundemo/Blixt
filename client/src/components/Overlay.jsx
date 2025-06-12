




export const Overlay = ({showOverlay, setShowOverlay = false,  clickToggle = false}) => {




    return <div


        onClick={() => clickToggle && setShowOverlay(false) }

        className={`overlay ${showOverlay ? '' : 'hide'}`}>

    </div>
}