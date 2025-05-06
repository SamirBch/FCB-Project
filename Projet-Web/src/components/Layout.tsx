import { JSXElement, Suspense } from "solid-js";
import Nav from "./Nav";
import HeaderMail from "./HeaderMail";
import BackgroundMusic from "./BackgroundMusic";

export default function Layout(props: { children: JSXElement }) {
    return (
        <>
            <Nav />
            <HeaderMail />
            <BackgroundMusic />{props.children}
        </>
    )
}