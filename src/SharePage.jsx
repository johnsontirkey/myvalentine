import { useEffect, useRef } from "react";
import { PERSON } from "./constants";

export default function SharePage() {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current?.play().catch(() => {});
  }, []);

  return (
    <div className="app-root dawn">
      <div className="card heartbeat" style={{width:"250px"}}>
        <h2>💖 Forever Us 💖</h2>

        <img
          src={PERSON.gifUrl3}
          alt="love gif"
          style={{ width: "60%", borderRadius: "16px" }}
        />

        <img
          src={PERSON.gifUrl}
          alt="dance gif"
          style={{ width: "50%", marginTop: "1rem" }}
        />

        <audio ref={audioRef} src={PERSON.songUrl} loop />
      </div>
    </div>
  );
}
