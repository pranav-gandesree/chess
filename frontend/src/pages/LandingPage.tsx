import { useNavigate } from "react-router-dom"

const LandingPage = () => {
    const navigate = useNavigate()
  return (
    <div className="m-10">
      <button onClick={()=>{
        navigate('/game')
      }} className="bg-blue-500"> Play the game </button>
    </div>
  )
}

export default LandingPage
