import {useAuth} from "react-oidc-context";

function App() {

    const {user, signinRedirect} = useAuth();

    return (
        <div>
            <main>
                {!user && <button onClick={() => signinRedirect()}>Sign in</button>}
                {user && <div>
                    Subject: {user.profile.sub}
                </div>}
            </main>
        </div>
    )
}

export default App
