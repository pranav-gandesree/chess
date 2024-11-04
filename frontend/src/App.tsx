import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import GamePage from "./pages/GamePage"

function App() {

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/game" element={<GamePage/>}/>
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
