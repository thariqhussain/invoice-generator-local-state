export default function Button({type = "button", className, children, onClick, ...rest}) {
    return(
        <button className={className} onClick={onClick}>
            {children}
        </button>
    )
}