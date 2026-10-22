import React from "react";
import { loadRemoteModule } from "./loader";

//import("mfe-b/Component").then((m) => console.dir(m));
// remote modules can also be used with import() which lazy loads them as usual
const Component = React.lazy(() =>
  loadRemoteModule("remote/Component").then((m) => {
    return m;
  }),
);

const App = () => {
  console.log("React", React.version, "in host");

  return (
    <article>
      <header>
        <h1></h1>
      </header>
      <React.Suspense fallback={<p>Lazy loading component...</p>}>
        <Component />
      </React.Suspense>
    </article>
  );
};
export default App;
