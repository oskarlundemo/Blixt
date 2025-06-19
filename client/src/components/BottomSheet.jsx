

export const BottomSheet = ({showMenu, setShowMenu, childrenElements = null}) => {



    return (
        <div
            className={`bottom-menu  ${showMenu ? "active" : ""}`}>
            <svg

                onClick={() => {
                    setShowMenu(false);
                }}

                style={{
                    marginLeft: "auto",
                    padding: '1rem'
                }}
                xmlns="http://www.w3.org/2000/svg" height="24px"
                viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>

            {childrenElements}

        </div>
    )


}