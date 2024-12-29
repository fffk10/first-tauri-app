import { Link } from "react-router-dom";

function About() {
  return (
    <div>
      <h1 className="font-bold">About</h1>
      <p>このページは Tauri クロスプラットフォームデモのアプリケーションです</p>

      <Link to="/">Home</Link>
    </div>
  );
}

export default About;
