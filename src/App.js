
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Home, Playgame, Nopage} from './pages'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' index element = {<Home />} />
          <Route path='/doodle' element = {<Playgame />} />
          <Route path='*' element = {<Nopage />}  />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
