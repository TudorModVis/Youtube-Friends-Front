interface MenuParams {
    setPage: (page: string) => void,
    page: string,
    newFriendRequests: boolean
}

const Menu: React.FC<MenuParams> = ({setPage, page, newFriendRequests}) => {
    const friendRequestsImage = newFriendRequests ? "../images/friendrequest-icon-new.svg" : "../images/friendrequest-icon.svg";
    return (
        <div className="flex justify-center fixed bottom-4 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-semi-black rounded-lg flex justify-center gap-6 w-[18.5rem] py-2 border border-[#A0A0A0]">
                <button onClick={() => { setPage('add-friends') }}> <img src="../images/menu/friends.svg" alt="home icon" className="w-8 max-w-none" style={{opacity: page === 'add-friends' ? 1 : .7}} /> </button>
                <button onClick={() => { setPage('home') }}> <img src={page === 'home' ? "../images/menu/home-active.png" : "../images/menu/home.svg"} alt="home icon" className="w-8 max-w-none" /> </button>
                <button onClick={() => { setPage('friend-requests') }}> <img src="../images/menu/account.svg"alt="home icon" className="w-8 max-w-none" style={{opacity: page === 'friend-requests' ? 1 : .7}} /> </button>
                <button onClick={() => { setPage('friend-requests') }}> <img src="../images/menu/settings.svg"alt="home icon" className="w-8 max-w-none" style={{opacity: page === 'friend-requests' ? 1 : .7}} /> </button>
            </div>
        </div>
    )
    
}

export default Menu;