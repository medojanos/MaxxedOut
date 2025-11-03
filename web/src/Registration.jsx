export default function Home() {
  return (
    <section>
      <form>
        <h3>Registration</h3>
        <input name="email" type="email" autoComplete="on"></input><br></br>
        <input name="password" type="password"></input><br></br>
        <input name="rePassword" type="password"></input><br></br>
        <input type="submit" className="me-2"></input>
        <input type="reset"></input>
      </form>
    </section>
  )
}
