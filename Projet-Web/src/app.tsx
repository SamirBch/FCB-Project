import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import BackgroundMusic from "~/components/BackgroundMusic";
import "./app.css";

export default function App() {
    return (
        <Router
            root={props => (
                <>
                    <Nav />
                    <BackgroundMusic />
                    <Suspense>{props.children}</Suspense>
                </>
            )}
        >
            <FileRoutes />
        </Router>
    );
}