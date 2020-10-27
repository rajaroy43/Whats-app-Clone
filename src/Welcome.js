import React  from "react";
import "./Welcome.css";
function Welcome() {
  return (
    <div className="welcome">
      <div className="welcome__container">
      <h2 className="welcome__info">Welcome To Centralised Messaging dapp....</h2>
      <video
        className="welcome__video"
          loop
          autoPlay
          src="https://cdn.videvo.net/videvo_files/video/free/2013-09/small_watermarked/RedBloodCellsVidevo_preview.webm"
        ></video>
      </div>
    </div>
  );
}

export default Welcome;
