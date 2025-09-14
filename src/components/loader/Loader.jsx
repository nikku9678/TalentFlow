import "./Loader.css"

export default function Loader() {
  return (
    <div>
      <div id="wrapper" className="bg-[#f9f9f9]">		
        <div id="corpus"></div>
        <div id="spinner"></div>
      </div>
      <div id="text">&nbsp;Loading ...</div>
    </div>
  )
}
