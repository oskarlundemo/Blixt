


import '../../styles/Start.css'

export const SmartphoneFrame = ({height = '0'}) => {


    return (
        <img
            className='mock-iphone'
            src={`smartphoneframe.png`}
            style={{
                height: `${height}px`,
                width: `auto`,}}
            />
    )


}