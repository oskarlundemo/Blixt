




export const CompanyLogo = ({height, width = 'auto'}) => {



    return (
        <div className="company-logo">

            <img
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                }}
                src={
                'blixt-logo.png'
                }/>


        </div>
    )

}