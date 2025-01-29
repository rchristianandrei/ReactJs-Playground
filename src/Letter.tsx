export default function Letter(props: any){

    return(
        <>
        <span className="letter">{props.isRevealed && props.letter}</span>
        </>
    )
}