interface HeaderParams {
    image: string
}

const Header: React.FC<HeaderParams> = ({image}) => {
    return (
        <header className="flex justify-between items-center pt-3 pr-3">
            <div className="w-11 aspect-square"></div>
            <img src="../images/header/logo.png" alt="logo modvis" className="h-6"/>
            <img src={image} alt="logo modvis" className="w-11 rounded-xl border-white border-[2px]"/>
        </header>
    );
}

export default Header;