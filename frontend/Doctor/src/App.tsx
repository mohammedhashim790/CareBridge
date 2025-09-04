import Router from "./routes/Router"
import {DialogProvider} from "./pages/utils/dialog/dialog.tsx";
import {setJwtDecode} from "../../shared-modules/src/user_auth/user_auth.ts";
import {jwtDecode} from "jwt-decode";


setJwtDecode(jwtDecode);

function App() {
    return (<DialogProvider>
        <Router/>
    </DialogProvider>)
}

export default App
