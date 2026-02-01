import { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import QRCode from "react-qr-code";
import { PERSON, LOVE_LETTER } from "./constants";
import { Routes, Route, useNavigate } from "react-router-dom";
import SharePage from "./SharePage";


export default function App() {
  const noRef = useRef(null);
  const audioRef = useRef(null);
  const sadAudioRef = useRef(null);
  const happyAudioRef = useRef(null);

  const [accepted, setAccepted] = useState(false);
  const [typedText, setTypedText] = useState("");

  const [noCount, setNoCount] = useState(0);
  const [shake, setShake] = useState(false);

  const noMessages = [
    "NO 🖤",
    "Are you sure? 😶",
    "(ㆆ_ㆆ)",
    "Really sure? 🥺",
    "Think again 💔",
    "Last chance 😢",
    "My heart is breaking 💘",
    "Still clicking NO?! 😵‍💫",
    "NO disabled 😐"
  ];

  // Impossible NO button 
  const moveNo = () => {
    if (noCount >= 8) return;

    // Move button
    const x = Math.random() * 300 - 150;
    const y = Math.random() * 160 - 80;

    if (noRef.current) {
      noRef.current.style.position = "absolute";
      noRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }

    // Screen shake
    setShake(true);
    setTimeout(() => setShake(false), 400);

    if (navigator.vibrate) {
      const intensity = Math.min(50 + noCount * 30, 300);
      navigator.vibrate([intensity, 50, intensity]);
    }

    // 🎻 Sad violin — guaranteed click-based play
    if (sadAudioRef.current) {
      sadAudioRef.current.pause();
      sadAudioRef.current.currentTime = 0;
      sadAudioRef.current
        .play()
        .catch(() => console.log("Audio blocked"));
    }

    setNoCount((prev) => prev + 1);
  };


  // YES click magic
  const handleYes = async () => {
    confetti({
      particleCount: 550,
      spread: 200,
      origin: { y: 0.6 }
    });

    setAccepted(true);

    try {
      await happyAudioRef.current.play();
    } catch {
      console.log("Autoplay blocked (normal)");
    }
  };

  // Typewriter effect 
  useEffect(() => {
    if (!accepted) return;

    let i = 0;
    setTypedText("");

    const interval = setInterval(() => {
      setTypedText((prev) => prev + LOVE_LETTER.charAt(i));
      i++;
      if (i >= LOVE_LETTER.length) clearInterval(interval);
    }, 35);

    return () => clearInterval(interval);
  }, [accepted]);

const navigate = useNavigate();

return (
  <>
    <Routes>
      <Route
        path="/"
        element={
          <div
            className={`app-root ${accepted ? "bg-pulse dawn" : ""} ${
              shake ? "shake" : ""
            }`}
          >
            <div className={`card ${accepted ? "heartbeat" : ""}`}>
              {accepted ? (
                <>
                  <h1>YAY 💕</h1>

                  <img
                    src={PERSON.gifUrl2}
                    alt="love gif"
                    style={{ width: "50%", borderRadius: "16px" }}
                  />

                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {typedText}
                  </pre>

                  <img
                    src={PERSON.gifUrl1}
                    alt="dance gif"
                    style={{ width: "50%", borderRadius: "16px" }}
                  />

                  <button
                    className="yes"
                    onClick={() => navigate("/share")}
                    style={{ marginTop: "1rem" }}
                  >
                   💖 Yes 💖
                  </button>
                </>
              ) : (
                <>
                  <h1>{PERSON.theirName} 💖</h1>
                  <p>
                    Life feels better when you’re around.<br />
                    Will you be my Valentine?
                    <br />
                         - Forever Yours "{PERSON.yourName}"
                  </p>

                  <div className="buttons">
                  <button
                    className="yes"
                    onClick={handleYes}
                    style={{
                      transform: `scale(${1 + noCount * 0.12})`,
                      transition: "transform 0.3s ease"
                    }}
                  >
                    Yes 💘
                  </button>

                  <button
                    className="no"
                    ref={noRef}
                    onClick={moveNo}
                    disabled={noCount >= 8}
                    style={{
                      opacity: noCount >= 8 ? 0.4 : 1,
                      cursor: noCount >= 8 ? "not-allowed" : "pointer"
                    }}
                  >
                    {noMessages[Math.min(noCount, noMessages.length - 1)]}
                  </button>
                  </div>
                </>
              )}
            </div>

            <audio ref={happyAudioRef} src={PERSON.songUrl2} loop />
            <audio ref={sadAudioRef} src={PERSON.songUrl1} preload="auto" />
            <audio ref={audioRef} src={PERSON.songUrl} loop />
          </div>
        }
      />

      <Route path="/share" element={<SharePage />} />
    </Routes>
  </>
);

}
