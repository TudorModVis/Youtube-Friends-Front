import { Navigate } from 'react-router-dom';
import { useState } from 'react';

const browser = require("webextension-polyfill");

const LogIn : React.FC = () => {
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

    if (isLoggedIn) {
        return <Navigate to="/activity" />;
    }

    return (
        <>
        <button onClick={() => { authorize(setLoggedIn) }} >Click to login</button>
        </>
    );
}

const authorize = async (setLoggedIn: (value: boolean) => void) => {
    const redirectURL = browser.identity.getRedirectURL('index.html');
    const { oauth2 } = browser.runtime.getManifest();
    const clientId = oauth2.client_id;

    const authParams = new URLSearchParams({
        client_id: clientId,
        response_type: 'token',
        redirect_uri: redirectURL,
        scope: oauth2.scopes.join(' '),
    });

    const authURL = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`;

    browser.identity.launchWebAuthFlow({ interactive: true, url: authURL }).then( async (responseUrl: string) => {
        const url = new URL(responseUrl);
        const urlParams = new URLSearchParams(url.hash.slice(1));
        const params = Object.fromEntries(urlParams.entries());
        const rawData = await fetch('https://www.googleapis.com/oauth2/v3/userinfo?access_token=' + params.access_token);
        const data = await rawData.json();
    
        const requestData = {
            name: data.name,
            image: data.picture,
            email: data.email,
        };

        fetch("https://youtube-friends.onrender.com/api/add-user", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
            .then((res) => {
                if (res.status === 400) {
                    setLoggedIn(true);
                    return '';
                }
                return res.json()
            })
            .then((data) => {
                if (data === '') return;
                Object.assign(requestData, {id: data.id});
                browser.storage.local.set({
                    "userData" : JSON.stringify(requestData)
                });
                setLoggedIn(true);
            })
            .catch(error => console.error('Error:', error));

      });

    
}

export default LogIn;