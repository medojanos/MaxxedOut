import TestPhone from "./assets/testphone.png"
import "./style/home.css"

export default function Home() {
  return (
    <>
      <div id="hero">
        <h1>Maxx out your workouts</h1>
        <a href='#register'><button>Check it out <ion-icon name="arrow-down"></ion-icon></button></a>
      </div>
      <section id='register'>
        <h2>Ready to get started?</h2>
        <div className="container m-auto">
          <h3>Start your fitness journey</h3>
          <h5>You need to register to use the app</h5>
          <a href="/registration"><button>Sign up now <ion-icon name="arrow-forward"></ion-icon></button></a>
        </div>
      </section>
      <hr></hr>
      <section id='download'>
        <h2>Download MaxxedOut</h2>
        <div className="d-flex justify-content-evenly">
          <img src={TestPhone} width={300}/>
          <div>
            <h3>Get the app to...</h3>
            <div id="features">
              <div>
                <ion-icon name="barbell"></ion-icon>
                <span>Track your workouts</span>
              </div>
              <div>
                <ion-icon name="stats-chart"></ion-icon>
                <span>Analyse your statistics</span>
              </div>
              <div>
                <ion-icon name="analytics"></ion-icon>
                <span>See results</span>
              </div>
              <a href="/download" className="m-auto"><button>DOWNLOAD the APK</button></a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
