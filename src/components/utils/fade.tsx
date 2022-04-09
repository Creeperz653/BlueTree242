import React, {createRef, ReactNode, useEffect} from "react";
import './fade.css'
export type FadeProps = {
    children: ReactNode
}

export function Fade(props: FadeProps) {
    const ref = createRef<HTMLDivElement>()
    useEffect(() => {
        ref.current?.classList.add("fadeIn")
    }, [props.children]) //when children is updated, add fadeIn class, which will make the figure do a fade animation

    return <div className={"fadeContainer"} ref={ref}>
        {props.children}
    </div>
}