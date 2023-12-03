interface TitleProps {
    subtitle: string,
    title1: string,
    title2: string
}

const Title: React.FC<TitleProps> = ({subtitle, title1, title2}) => {
    return (
        <div className="mb-12">
            <p className="font-light opacity-70 leading-tight">{subtitle}</p>
            <h2 className="font-semibold text-[2rem] leading-none uppercase">{title1}</h2>
            <h2 className="font-semibold text-[2rem] leading-none uppercase">{title2}</h2>
        </div>
    );
}

export default Title;