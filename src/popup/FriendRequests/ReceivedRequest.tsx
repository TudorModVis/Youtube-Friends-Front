interface RequestParams {
    id: string,
    image: string,
    email: string,
    firstname: string,
    lastname: string | undefined,
    updateRequests: (email: string) => void
}

const ReceivedRequest: React.FC<RequestParams> = ({image, firstname, lastname, id, email, updateRequests}) => {
    const onConfirmationClick = () => {
        fetch("https://youtube-friends.onrender.com/api/add-friend", {
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
        .catch(error => console.error('Error when /api/add-friend: ', error));

        updateRequests(email);
    }

    const onRejectClick = () => {
        fetch("https://youtube-friends.onrender.com/api/reject-friend", {
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
        .catch(error => console.error('Error when /api/add-friend: ', error));

        updateRequests(email);
    }

    return (
        <div className="bg-semi-black border border-[#4C4C4C] rounded-md p-4 mb-4">
            <div className="flex items-center gap-4">
                <div className="flex gap-2 items-center mb-2">
                    <img src={image} alt="youtube icon" className="w-8 rounded-full"/>
                    <p>{lastname === undefined ? firstname : firstname + ' ' + lastname}</p>
                </div>
                <button className="border border-[#4C4C4C] hover:cursor-pointer" onClick={onConfirmationClick}>OK</button>
                <button className="border border-[#4C4C4C] hover:cursor-pointer" onClick={onRejectClick}>FUTEO</button>
            </div>
            
        </div>
    );
};

export default ReceivedRequest;