import Header from "./Header"
import Home from "./Home"
import Notify from "./Notify"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/notify' element={<Notify/>}/>
      </Routes>
    </div>
    </Router>
  );
}

export default App;