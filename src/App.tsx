import Header from "./components/header/header"
import About from './components/about/about'
import {Route, Switch, useLocation} from 'wouter';
import {useState} from "react";
import Index from "./pages";

export default function App() {
    const [location, setLocation] = useState<string | undefined>(undefined);

    return (
        <>
        <Header/>
        <Switch location={location}>
            <Route path={"/"} component={Index}/>
            <Route path={"/"} component={Index}/>
        </Switch>
        </>
    );
}