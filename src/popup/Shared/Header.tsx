interface HeaderParams {
    image: string
}

const Header: React.FC<HeaderParams> = ({image}) => {
    return (
        <header className="flex justify-between items-center py-4">
            <div className="w-12 aspect-square"></div>
            <img src="../images/logo.svg" alt="logo modvis" className="w-9 aspect-square"/>
            <img src={image} alt="logo modvis" className="w-12 rounded-full"/>
        </header>
    );
}

export default Header;