interface MenuParams {
    setPage: (page: string) => void,
    page: string,
    newFriendRequests: boolean
}

const Menu: React.FC<MenuParams> = ({setPage, page, newFriendRequests}) => {
    const friendRequestsImage = newFriendRequests ? "../images/friendrequest-icon-new.svg" : "../images/friendrequest-icon.svg";
    return (
        <div className="flex justify-center pt-4">
            <div className="bg-accent rounded-lg flex justify-center items-center gap-16 w-[22rem] h-16">
                <button onClick={() => { setPage('add-friends') }}> <img src="../images/friendadd-icon.svg" alt="home icon" className="w-9 hover:opacity-1 transition duration-300" style={{opacity: page === 'add-friends' ? 1 : .7}} /> </button>
                <button onClick={() => { setPage('home') }}> <img src="../images/home-icon.svg" alt="home icon" className="w-9 hover:opacity-1 transition duration-300" style={{opacity: page === 'home' ? 1 : .7}} /> </button>
                <button onClick={() => { setPage('friend-requests') }}> <img src={friendRequestsImage} alt="home icon" className="w-9 hover:opacity-1 transition duration-300" style={{opacity: page === 'friend-requests' ? 1 : .7}} /> </button>
            </div>
        </div>
    )
    
}

export default Menu;