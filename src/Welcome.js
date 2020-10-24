import React, {useEffect, useRef } from "react";
import "./Welcome.css";

function Welcome() {
    const videoRef=useRef(null);
    useEffect(() => {
        videoRef.current.play();
    }, [])
  return (
    <div className="welcome">
      <div className="welcome__container">
      <h2 className="welcome__info">Welcome To Decentralised Messaging dapp....</h2>
        <video
        className="welcome__video"
          loop
          ref={videoRef}
          src="https://cdn.videvo.net/videvo_files/video/free/2013-09/small_watermarked/RedBloodCellsVidevo_preview.webm"
        ></video>
      </div>
    </div>
  );
}

export default Welcome;
