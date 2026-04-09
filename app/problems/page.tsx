import Navbar from "../../components/Navbar"

export default function Problems() {
  return (
    <div style={{background:"#0d1117",color:"white",minHeight:"100vh"}}>

      <Navbar/>

      <div style={{padding:"40px"}}>

        <h1 style={{fontSize:"32px",marginBottom:"30px"}}>
          Coding Problems
        </h1>

        <div style={{display:"grid",gap:"20px"}}>

          <div style={{
            padding:"20px",
            border:"1px solid #222",
            borderRadius:"10px"
          }}>
            <h3>Two Sum</h3>
            <p style={{color:"#9ca3af"}}>Difficulty: Easy</p>
          </div>

          <div style={{
            padding:"20px",
            border:"1px solid #222",
            borderRadius:"10px"
          }}>
            <h3>Binary Search</h3>
            <p style={{color:"#9ca3af"}}>Difficulty: Easy</p>
          </div>

          <div style={{
            padding:"20px",
            border:"1px solid #222",
            borderRadius:"10px"
          }}>
            <h3>Longest Substring Without Repeating Characters</h3>
            <p style={{color:"#9ca3af"}}>Difficulty: Medium</p>
          </div>

        </div>

      </div>

    </div>
  )
}