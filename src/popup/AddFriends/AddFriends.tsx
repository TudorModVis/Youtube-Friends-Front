import { useState, useEffect } from 'react';
import Title from '../Shared/Title';
import SentRequest from './SentRequest';
import { Socket } from 'socket.io-client';

interface AddFriendsParams {
    userId: string,
    socket: Socket
}

interface Request {
    image: string,
    email: string,
    firstname: string,
    lastname: string | undefined,
}

const AddFriends: React.FC<AddFriendsParams> = ({userId, socket}) => {
    const [email, setEmail] = useState('');
    const [requests, setRequests] = useState<Array<Request> | null>(null);

    useEffect(() => {
        const getRequests = () => {
            fetch(`https://youtube-friends.onrender.com/api/get-sent-requests?id=${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setRequests(data);
            })
              .catch(error => console.error('Error:', error));
        }

        socket.on('update-sent-requests', getRequests);
        getRequests();
    }, []);

    const onFormSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();

        fetch("https://youtube-friends.onrender.com/api/send-friend-request", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            },
        body: JSON.stringify({
            id: userId,
            friend: email
        }),
    })
        .catch(error => console.error('Error when /api/send-friend-request: ', error));
    }

    const updateRequests = (email: string) => {
        const newRequests = requests?.filter(el => el.email !== email);
        if (newRequests === undefined) return;
        setRequests(newRequests);
    }

    return (
        <>
            <Title title1="Spy on your friends and" title2='search for new ones' subtitle="Be friends on youtube too"/>
            <div>
                <h3 className='mb-4 leading-none'>Add friend</h3>
                <p className='mb-4 leading-none'>You can add friends with their email</p>
                <form className='w-full' onSubmit={onFormSubmit}>
                    <input 
                        type='email' 
                        name='email' 
                        placeholder='You can add friends with their email' 
                        className='w-full bg-semi-black border border-[#4C4C4C] rounded-md mb-8 p-3 focus:outline-none' 
                        onChange={(e) => {setEmail(e.target.value)}}
                    />
                    <input 
                        type="submit" 
                        value="Send friend request" 
                        className='rounded-md bg-accent text-center w-full mb-4 p-3 hover:cursor-pointer'
                    />
                </form>
            </div>
            {requests !== null && requests.map((element: Request) => {
                return <SentRequest {...element} key={element.email.toString()} id={userId} updateRequests={updateRequests}/>;
            })}
        </>
    )
}

export default AddFriends;