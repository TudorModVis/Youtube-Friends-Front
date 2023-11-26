interface MenuParams {
    setPage: (page: string) => void
}

const Menu: React.FC<MenuParams> = ({setPage}) => {
    
    return (
        <div className="flex justify-center pt-4 pb-8">
            <div className="bg-accent rounded-lg flex justify-center items-center gap-16 w-[22rem]">
                <button onClick={() => { setPage('add-friends') }}> <img src="../images/friendadd-icon.svg" alt="home icon" className="w-9" /> </button>
                <button onClick={() => { setPage('home') }}> <img src="../images/home-icon.svg" alt="home icon" className="w-9" /> </button>
                <button onClick={() => { setPage('friend-requests') }}> <img src="../images/friendrequest-icon.svg" alt="home icon" className="w-9" /> </button>
            </div>
        </div>
    )
    
}

export default Menu;