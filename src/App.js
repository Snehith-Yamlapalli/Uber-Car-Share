import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Home from './Tabs/Home'
import './App.css'
import Welcome from './Auth/Welcome'
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';
import Profile from './Tabs/Profile';
import Rides from './Tabs/Rides';
import Layout from './Tabs/Layout';
import Maincode from "./Tabs/Maincode"
function App() {

  return (
    <div className="min-h-screen w-full">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/Auth/SignIn" element={<SignIn />} />
        <Route path="/Auth/SignUp" element={<SignUp />} />
        <Route path="/Layout" element={<Layout/>} />
        <Route element={<Layout />}>
        <Route path="/Home" element={<Home />} />
        <Route path="/Rides" element={< Rides/>} />
        <Route path="/Profile" element={< Profile/>} />
        <Route path="/Chats" element={< Maincode/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
