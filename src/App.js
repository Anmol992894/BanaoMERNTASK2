import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FrontPage from './Components/FrontPage';
import Login from './pages/Login';
import Loading from './Components/LoadingComponent';
import Register from './pages/Register';
import TweetDetailsPage from './pages/TweetdetailPage';
import AllTweet from './pages/AllTweet';
import Forgot from './pages/Forgot';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login/>}></Route>
        <Route exact path='/register' element={<Register/>}></Route>
        <Route exact path='/forgot' element={<Forgot/>}></Route>
        <Route exact path='/tweetdetail' element={<TweetDetailsPage/>}></Route>
        <Route exact path='/home' element={<AllTweet/>}></Route>
        <Route exact path='/front' element={<FrontPage/>}></Route>
        <Route exact path='*' element={<Loading/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
