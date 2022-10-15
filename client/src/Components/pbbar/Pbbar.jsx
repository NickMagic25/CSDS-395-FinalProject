import "./pbbar.css"

export default function Pbbar() {
  return (
    <div className="pbbar">
        <div className="pbbarWrapper">
            <div className="pbContainer">
                <span className="pbText">
                    <b>Bob</b> and <b>2 other friends</b> just broke a PR <b>check it out!</b>
                    </span>
            </div>
            <img src="assets/Premium.png" alt="" className="pbbarAd" />
        </div>
    </div>
  )
}
