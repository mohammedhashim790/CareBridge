import Router from './router/Router';
import {setJwtDecode} from "../../shared-modules/src/user_auth/user_auth.ts";
import {jwtDecode} from "jwt-decode";
import {DialogProvider} from "./components/dialog/dialog.tsx";


setJwtDecode(jwtDecode);

function App() {
    return (<DialogProvider>
        <Router/>
    </DialogProvider>)
}

export default App
