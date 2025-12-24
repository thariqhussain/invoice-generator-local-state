export default function Label({htmlFor, children, ...rest}) {
    return(
        <label htmlFor={htmlFor} {...rest}>
            {children}
        </label>
    )
}