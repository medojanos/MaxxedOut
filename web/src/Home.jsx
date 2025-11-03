import { Link } from 'react-router-dom'
import TestPhone from './assets/testphone.png'

export default function Home() {
  return (
    <>
      <div id='hero'>
        <a href='#more'><button>More</button></a>
      </div>
      <section id='more'>
        <p>You need to register to use the app!</p>
          <Link to="/registration"><button>Registration</button></Link><br></br>
          <div id='download'>
            <Link to="/download"><button>Download</button></Link>
            <img src={TestPhone} width={400}></img>
          </div>
      </section>
    </>
  )
}
