import { useEffect, useRef, useState } from "react";

// Live speech-to-text using the browser's Web Speech API.
// Produces an interim transcript while speaking (unchanged live UX) and a
// final transcript that becomes the interview answer on submit.
export default function useLiveTranscript() {
    const [supported, setSupported] = useState(true);
    const [listening, setListening] = useState(false);
    const [liveText, setLiveText] = useState("");
    const [finalText, setFinalText] = useState("");
    const recRef = useRef(null);
    const wantRef = useRef(false);

    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            setSupported(false);
            return;
        }
        const rec = new SR();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";
        rec.onresult = (e) => {
            let interim = "";
            let final = "";
            for (let i = 0; i < e.results.length; i++) {
                const r = e.results[i];
                if (r.isFinal) final += r[0].transcript + " ";
                else interim += r[0].transcript;
            }
            setFinalText(final);
            setLiveText((final + " " + interim).trim());
        };
        rec.onerror = () => { };
        rec.onend = () => {
            // Chrome stops on silence — restart if the user still wants to talk.
            if (wantRef.current) {
                try { rec.start(); } catch { }
            } else {
                setListening(false);
            }
        };
        recRef.current = rec;
        return () => {
            wantRef.current = false;
            try { rec.stop(); } catch { }
        };
    }, []);

    function start() {
        if (!recRef.current) return;
        setLiveText("");
        setFinalText("");
        wantRef.current = true;
        try { recRef.current.start(); setListening(true); } catch { }
    }

    function stop() {
        wantRef.current = false;
        try { recRef.current.stop(); } catch { }
        setListening(false);
    }

    return { supported, listening, liveText, finalText, start, stop };
}