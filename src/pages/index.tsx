import About from "../components/about/about";
import './index.css'
import GithubActivity from "../components/github/github";
export default function Index() {
    return (
        <div className={"info-container"}>
        <About />
            <GithubActivity />
        </div>
    )
}