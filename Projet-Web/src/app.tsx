import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import BackgroundMusic from "~/components/BackgroundMusic";
import "./app.css";
import Header from "./components/HeaderMail";

export default function App() {
    return (
        <Router
            root={props => (
                <>
                    <Suspense>{props.children}</Suspense>
                </>
            )}
        >
            <FileRoutes />
        </Router>
    );
}