import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Loggedin from "./components/auth/Loggedin";
import PassportCallback from "./components/auth/PassportCallback";
import PersistLogin from "./components/auth/PersistLogin";
import RequireAuth from "./components/auth/RequireAuth";
import { MeetingProvider } from "./context/MeetingProvider";
import { SocketProvider } from "./context/SocketProvider";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Meeting from "./pages/Meeting";
import Register from "./pages/Register";
import WaitingRoom from "./pages/WaitingRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PersistLogin />}>
          <Route element={<Loggedin />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="/passport-callback" element={<PassportCallback />} />
          <Route element={<RequireAuth />}>
            <Route element={<SocketProvider />}>
              <Route path="/" exact element={<Home />} />
              <Route element={<MeetingProvider />}>
                <Route path="/meeting/:id" element={<Meeting />} />
                <Route path="/meeting/waiting/:id" element={<WaitingRoom />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
