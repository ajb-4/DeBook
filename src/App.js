import './App.css';
import { Route, Routes } from 'react-router';
import NavBar from './components/NavBar';
import UserProfile from './components/UserProfile';
import HomePage from './components/HomePage';

function App() {
  return (
    <>
      <NavBar/>
      <Routes>
        <Route exact path="/" element={<HomePage/>}></Route>
        <Route exact path="/profile" element={<UserProfile/>}></Route>
      </Routes>
    </>
  );
}

export default App;
