export default function LanguageCard(props: any){

    const style = {
        backgroundColor: props.backgroundColor,
        color: props.darkMode ? "black" : "white",
    }

    return(
        <>
            <span style={style}>
                {props.language}
                {props.isDead && <div className="overlay" >☠️</div>}
            </span>
        </>
    )
}