export default function Alphabet(props: any){

    const style = props.isChosen ? {backgroundColor: "#755a00"} : {}

    return (
        <>
        <button className="alphabet" style={style} onClick={() => props.onClick(props.index)}>{props.letter}</button>
        </>
    )
}