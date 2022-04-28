import Header from "./components/header/header";
import { Route, Switch } from "wouter";
import { useState } from "react";
import Index from "./pages";
import { Fade } from "./components/utils/fade";

export default function App() {
  const [location] = useState<string | undefined>(undefined);

  return (
    <>
      <Header />
      <Fade>
        <Switch location={location}>
          <Route path={"/"} component={Index} />
          <Route path={"/"} component={Index} />
        </Switch>
      </Fade>
    </>
  );
}
