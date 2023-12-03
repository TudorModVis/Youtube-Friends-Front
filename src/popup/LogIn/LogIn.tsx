import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

interface LogInProps {
    setLoggedIn: (value: boolean) => void;
}

const browser = require("webextension-polyfill");

const LogIn : React.FC<LogInProps> = ({ setLoggedIn }) => {
    return (
        <>
        {/* <GoogleOAuthProvider clientId="452387761121-c9952bqaco1eikp658ell0a66ggbiivn.apps.googleusercontent.com">
            <GoogleLogin 
                onSuccess={async (credentialResponse) => {
                    // const rawData = await fetch('https://www.googleapis.com/oauth2/v3/userinfo?access_token=' + credentialResponse.credential);
                    // const data = await rawData.json();
                
                    // const requestData = {
                    //     firstname: data.given_name,
                    //     lastname: data.family_name,
                    //     image: data.picture,
                    //     email: data.email,
                    // };
                
                    fetch("https://youtube-friends.onrender.com/api/login", {
                        method: "POST",
                        mode: "cors",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${credentialResponse.credential}`,
                            credentials: 'include'
                        },
                        // body: JSON.stringify({token: credentialResponse.credential}),
                    })
                        .then((res) => res.text())
                        .then((data) => {
                            browser.storage.local.set({
                                "userData" : JSON.stringify(data)
                            });
                            setLoggedIn(true);
                        })
                        .catch(error => console.error('Error:', error));
                }}
                onError={() => [
                    console.log('Login Failed')
                ]}
            />
        </GoogleOAuthProvider> */}
        
        <button onClick={() => {
            authorize(setLoggedIn);
        }} >Click to login</button>
        </>
    );
}

// function oauthSignIn() {
//     // Google's OAuth 2.0 endpoint for requesting an access token
//     var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  
//     // Create <form> element to submit parameters to OAuth 2.0 endpoint.
//     var form = document.createElement('form');
//     form.setAttribute('method', 'GET'); // Send as a GET request.
//     form.setAttribute('action', oauth2Endpoint);

//     const redirectURL = browser.identity.getRedirectURL('index.html');
//     const { oauth2 } = browser.runtime.getManifest();
//     const clientId = oauth2.client_id;
  
//     // Parameters to pass to OAuth 2.0 endpoint.
//     var params = {'client_id': clientId,
//                   'redirect_uri': redirectURL,
//                   'response_type': 'id_token',
//                   'scope': oauth2.scopes[0],
//                 };
  
//     // Add form parameters as hidden input values.
//     for (var p in params) {
//       var input = document.createElement('input');
//       input.setAttribute('type', 'hidden');
//       input.setAttribute('name', p);
//       input.setAttribute('value', params[p]);
//       form.appendChild(input);
//     }
  
//     // Add form to page and submit it to open the OAuth 2.0 endpoint.
//     document.body.appendChild(form);
//     form.submit();
//   }

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