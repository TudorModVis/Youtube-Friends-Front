interface LogInProps {
    setStatus: (newType: string) => void;
}

const browser = require("webextension-polyfill");

const LogIn : React.FC<LogInProps> = ({ setStatus }) => {
    return (
        <>
        <h1>Logging</h1>
        <button onClick={() => {
            addNewUser(setStatus);
        }} >Click to login</button>
        </>
    );
}

const addNewUser = (setStatus : (newType: string) => void) => {
    browser.identity.getAuthToken({interactive: true}, async function(token: string) {
  
        const rawData = await fetch('https://www.googleapis.com/oauth2/v3/userinfo?access_token=' + token);
        const data = await rawData.json();
    
        const requestData = {
            firstname: data.given_name,
            lastname: data.family_name,
            image: data.picture,
            email: data.email,
        };
    
        fetch("http://localhost:4030/api/add-user", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(requestData),
        })
            .then((res) => res.text())
            .then((data) => {
                browser.storage.local.set({
                    "userData" : JSON.stringify(Object.assign(requestData, {id: data.slice(1,-1)}))
                });
                setStatus('logged-in');
            })
            .catch(error => console.error('Error:', error));
      });
  }

export default LogIn;