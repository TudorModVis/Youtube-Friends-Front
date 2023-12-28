import { useState, useEffect } from 'react';
import Title from '../Shared/Title';
import Request from './ReceivedRequest';
import { Socket } from 'socket.io-client';

interface FriendRequestsParams {
    userId: string,
    socket: Socket,
    setNewFriendRequestsToFalse: () => void
}

interface RequestParams {
    image: string,
    email: string,
    firstname: string,
    lastname: string | undefined,
}

const FriendRequests: React.FC<FriendRequestsParams> = ({userId, socket, setNewFriendRequestsToFalse}) => {
    const [requests, setRequests] = useState<Array<RequestParams> | null>(null);

    useEffect(() => {
        const getRequests = () => {
            fetch(`https://youtube-friends.onrender.com/api/get-received-requests?id=${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setRequests(data);
            })
              .catch(error => console.error('Error:', error));
        }

        socket.on('new-request-received', getRequests);
        getRequests();
        
    }, []);

    const updateRequests = (email: string) => {
        const newRequests = requests?.filter(el => el.email !== email);
        if (newRequests === undefined) return;
        setRequests(newRequests);
    }

    if (requests === null) {
        return (
            <>
                <Title title1="FRIEND REQUESTS" title2='THAT YOU HAVE' subtitle="Be friends on youtube too"/>
            </>
        );
    }

    if (requests.length === 0) {
        setNewFriendRequestsToFalse();
    }

    return (
        <>
            <Title title1="FRIEND REQUESTS" title2='THAT YOU HAVE' subtitle="Be friends on youtube too"/>
            {requests.map((element: RequestParams) => {
                return <Request {...element} key={element.email.toString()} id={userId} updateRequests={updateRequests}/>;
            })}
        </>
    );
}

export default FriendRequests;