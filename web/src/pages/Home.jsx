import { Link } from "react-router-dom"
import Tracker from "../assets/tracker.png"
import AppStore from "../assets/appstore.svg"
import GooglePlay from "../assets/googleplay.svg"
import "../style/home.css"

export default function Home() {
  return (
    <>
      <div id="hero">
        <h1>Maxx out your workouts</h1>
        <a href='#register'><button>Check it out <ion-icon name="arrow-down"></ion-icon></button></a>
      </div>
      <section id='register'>
        <h2>Ready to get started?</h2>
        <div className="container m-auto text-center">
          <h3>Start your fitness journey</h3>
          <h5>You need to register to use the app</h5>
          <Link to="/registration"><button>Sign up now <ion-icon name="arrow-forward"></ion-icon></button></Link>
        </div>
      </section>
      <hr></hr>
      <section id='download'>
        <h2>Download MaxxedOut</h2>
        <div className="row justify-content-evenly">
          <div className="col-auto">
            <img src={Tracker} id="phone"/>
          </div>
          <div className="col-auto">
            <h3 className="mt-5">Get the app to...</h3>
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
              <div className="flex justify-content-end">
                <a href="https://github.com/medojanos/MaxxedOut">
                  <button className="button">See it on GitHub</button>
                </a>
              </div>
              <h5>Coming soon...</h5>
              <a href="">
                <img style={{height: "3rem"}} className="me-2 my-1" src={GooglePlay}></img>
              </a>
              <a href="">
                <img style={{height: "3rem"}} src={AppStore}></img>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
