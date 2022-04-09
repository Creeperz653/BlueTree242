import './header.css'
import {useEffect, useState} from "react";
export default function header() {
    const [pulled, setPulled] = useLocalStorage<boolean>("theme", false)
    function toggle() {
        setPulled(!pulled)
    }
    useEffect(() => {
        document.body.className = pulled ? "theme-dark" : "theme-light"
    }, [pulled])
    return (
        <div className={"header-container"}>
            <h1 style={{color:"white"}}>BlueTree242</h1>
            <svg onClick={toggle} className={`lightswitch ${pulled ? 'pulled' : ''}`}>
                <path d="M 10 0 V 40" />
                <path d="M 5 40 h 10 l 2 20 h -14 l 2 -20" />
            </svg>
        </div>
    )
}

function useLocalStorage<E>(name: string, initValue: E) {
    const [storedValue, setStoredValue] = useState<E>(() => {
        try {
            const item = window.localStorage.getItem(name);
            return item ? JSON.parse(item) : initValue;
        } catch (error) {
            console.log(error);
            return initValue;
        }
    });

    const setValue = (value: E | ((val: E) => E)) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
                window.localStorage.setItem(name, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);
        }
    }
    return [storedValue, setValue] as const
}