/**
 * This component is used to create a backdrop when
 * something is focused
 *
 * @param showOverlay
 * @param setShowOverlay set the state
 * @param clickToggle if you click on the overlay, then remove it
 * @returns {JSX.Element}
 * @constructor
 */

export const Overlay = ({showOverlay, setShowOverlay = false,  clickToggle = false}) => {

    return <div
        onClick={() => clickToggle && setShowOverlay(false) }
        className={`overlay ${showOverlay ? '' : 'hide'}`}>
    </div>
}