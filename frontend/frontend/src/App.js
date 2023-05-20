import './App.css';
import Login from './login';
import Singup from './singup';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Singup />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
