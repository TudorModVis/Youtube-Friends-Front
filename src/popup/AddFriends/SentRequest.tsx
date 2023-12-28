interface RequestParams {
    id: string,
    image: string,
    email: string,
    name: string,
    updateRequests: (email: string) => void
}

const SentRequest: React.FC<RequestParams> = ({image, name, id, email, updateRequests}) => {
    const onCancelClick = () => {
        fetch("https://youtube-friends.onrender.com/api/cancel-friend-request", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            },
        body: JSON.stringify({
            id: id,
            friend: email
        }),
    })
        .catch(error => console.error('Error on /api/cancel-friend-request: ', error));

        updateRequests(email);
    }

    return (
        <div className="bg-semi-black border border-[#4C4C4C] rounded-md p-4 mb-4">
            <div className="flex items-center gap-4">
                <div className="flex gap-2 items-center mb-2">
                    <img src={image} alt="youtube icon" className="w-8 rounded-full"/>
                    <p>{name}</p>
                </div>
                <button className="border border-[#4C4C4C] hover:cursor-pointer" onClick={onCancelClick}>CANCEL</button>
            </div>
            
        </div>
    );
};

export default SentRequest;