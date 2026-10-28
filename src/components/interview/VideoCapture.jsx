import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import useLiveTranscript from "@/hooks/useLiveTranscript";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { analyzeFrameGeometry, VideoMetricsTracker } from "@/lib/videoAnalysis";

const LOCAL_WASM = "/wasm";
const CDN_WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const LOCAL_MODEL = "/models/face_landmarker.task";
const CDN_MODEL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

const PREFERRED_CAM_KEY = "cc_preferred_camera_id";

function findPreferredCamera(devices) {
    if (!devices || !devices.length) return null;
    // 1. Highest priority: HP TrueVision (exact hardware built-in webcam)
    const hp = devices.find((d) => /hp\s*true\s*vision/i.test(d.label || ""));
    if (hp) return hp;
    // 2. Physical hardware webcam (integrated, USB, camera) - exclude virtual / IR / phone link
    const physical = devices.find(
        (d) => d.label && !/virtual|obs|droidcam|iriun|motorola|phone|link|hello|infrared|ir\b/i.test(d.label)
    );
    if (physical) return physical;
    // 3. Any non-virtual device
    const nonVirtual = devices.find((d) => d.label && !/virtual|obs|droidcam|iriun/i.test(d.label));
    if (nonVirtual) return nonVirtual;
    return devices[0];
}

// Video interview capture with real-time face orientation and framing analysis.
// Focuses on whether the candidate is appropriately centered and oriented toward the screen.
export default function VideoCapture({ submitted, onSubmit, evaluating, onSwitchMode }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const landmarkerRef = useRef(null);
    const rafRef = useRef(null);
    const lastFrameAtRef = useRef(0);
    const trackerRef = useRef(new VideoMetricsTracker());
    const speechStartAtRef = useRef(0);

    const [camError, setCamError] = useState("");
    const [camReady, setCamReady] = useState(false);
    const [noFramesDetected, setNoFramesDetected] = useState(false);
    const [availableCameras, setAvailableCameras] = useState([]);
    const [selectedCameraId, setSelectedCameraId] = useState(() => {
        try { return localStorage.getItem(PREFERRED_CAM_KEY) || ""; } catch { return ""; }
    });
    const [cameraLabel, setCameraLabel] = useState("");
    const [visionStatus, setVisionStatus] = useState("Loading face analysis…");
    const [metrics, setMetrics] = useState({
        faceVisible: 0,
        centered: 0,
        facingScreen: 0,
        liveGuidance: "Positioning camera…",
        liveStatusType: "warning",
    });

    const { supported, listening, liveText, finalText, start, stop } = useLiveTranscript();
    const [transcript, setTranscript] = useState("");
    const [isEditingTranscript, setIsEditingTranscript] = useState(false);

    // Synchronize live speech to editable transcript
    useEffect(() => {
        const spoken = (finalText || liveText).trim();
        if (spoken && !isEditingTranscript) {
            setTranscript(spoken);
        }
    }, [liveText, finalText, isEditingTranscript]);

    const handleStartSpeaking = useCallback(() => {
        speechStartAtRef.current = performance.now();
        setIsEditingTranscript(false);
        start();
    }, [start]);

    const handleStopSpeaking = useCallback(() => {
        stop();
        const spoken = (finalText || liveText).trim();
        if (spoken) setTranscript(spoken);
    }, [stop, finalText, liveText]);

    const stopCamera = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    }, []);

    // Enumerate camera devices with labels
    const refreshDevices = useCallback(async () => {
        if (!navigator.mediaDevices?.enumerateDevices) return [];
        try {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const videoInputs = allDevices.filter((d) => d.kind === "videoinput");
            setAvailableCameras(videoInputs);
            return videoInputs;
        } catch {
            return [];
        }
    }, []);

    // Load FaceLandmarker once on mount with fallback chain
    useEffect(() => {
        let active = true;

        async function initLandmarker() {
            setVisionStatus("Loading face analysis model…");

            const tryInit = async (wasmUrl, modelUrl, delegate = "GPU") => {
                const vision = await FilesetResolver.forVisionTasks(wasmUrl);
                return await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: { modelAssetPath: modelUrl, delegate },
                    runningMode: "VIDEO",
                    numFaces: 1,
                    outputFaceBlendshapes: false,
                    outputFacialTransformationMatrixes: false,
                });
            };

            const attempts = [
                () => tryInit(LOCAL_WASM, LOCAL_MODEL, "GPU"),
                () => tryInit(LOCAL_WASM, LOCAL_MODEL, "CPU"),
                () => tryInit(CDN_WASM, CDN_MODEL, "GPU"),
                () => tryInit(CDN_WASM, CDN_MODEL, "CPU"),
                () => tryInit(CDN_WASM, LOCAL_MODEL, "CPU"),
            ];

            let landmarker = null;
            let lastErr = null;
            for (const attempt of attempts) {
                if (!active) break;
                try {
                    landmarker = await attempt();
                    if (landmarker) break;
                } catch (err) {
                    lastErr = err;
                }
            }

            if (!active) {
                try { landmarker?.close?.(); } catch { /* ignore */ }
                return;
            }

            if (landmarker) {
                landmarkerRef.current = landmarker;
                trackerRef.current.reset();
                setVisionStatus("Real-time orientation & framing analysis active");
            } else {
                console.warn("FaceLandmarker model load failed:", lastErr);
                setVisionStatus("Face analysis unavailable — camera preview active");
            }
        }

        initLandmarker();

        return () => {
            active = false;
            try { landmarkerRef.current?.close?.(); } catch { /* ignore */ }
            landmarkerRef.current = null;
        };
    }, []);

    // Main camera initialization with HP TrueVision auto-selection preference
    useEffect(() => {
        let active = true;
        let frameCheckTimer = null;

        async function initCamera() {
            setCamError("");
            setCamReady(false);
            setNoFramesDetected(false);

            if (!navigator.mediaDevices?.getUserMedia) {
                setCamError("Camera API is not supported in this browser.");
                return;
            }

            try {
                // First enumerate devices to detect HP TrueVision or user's chosen camera
                const devices = await refreshDevices();
                let chosenId = selectedCameraId;

                if (!chosenId && devices.length > 0) {
                    const preferred = findPreferredCamera(devices);
                    if (preferred?.deviceId) {
                        chosenId = preferred.deviceId;
                        setSelectedCameraId(chosenId);
                        try { localStorage.setItem(PREFERRED_CAM_KEY, chosenId); } catch { /* ignore */ }
                    }
                }

                // Constraints prioritizing the detected hardware webcam
                const constraints = {
                    video: chosenId
                        ? { deviceId: { exact: chosenId }, width: { ideal: 1280 }, height: { ideal: 720 } }
                        : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
                    audio: false
                };

                let stream = null;
                try {
                    stream = await navigator.mediaDevices.getUserMedia(constraints);
                } catch {
                    // Fallback to basic video constraint
                    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                }

                if (!active) {
                    stream.getTracks().forEach((t) => t.stop());
                    return;
                }

                streamRef.current = stream;
                const track = stream.getVideoTracks()[0];
                const label = track?.label || "Webcam";
                setCameraLabel(label);

                // Re-refresh devices once permission is granted so device labels populate
                await refreshDevices();

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        if (!active) return;
                        videoRef.current
                            ?.play()
                            .then(() => {
                                if (active) {
                                    setCamReady(true);
                                    trackerRef.current.reset();
                                }
                            })
                            .catch((playErr) => {
                                console.warn("Video auto-play deferred:", playErr);
                            });
                    };
                }

                // Diagnostic check: verify frames are actively rendering
                frameCheckTimer = setTimeout(() => {
                    if (!active) return;
                    const v = videoRef.current;
                    const t = streamRef.current?.getVideoTracks()[0];
                    if (t?.muted || (v && v.videoWidth === 0 && v.videoHeight === 0)) {
                        setNoFramesDetected(true);
                    }
                }, 3000);
            } catch (err) {
                console.error("Camera access failed:", err);
                if (active) {
                    setCamError(
                        err.name === "NotAllowedError"
                            ? "Camera access permission was denied. Please allow camera permissions in your browser address bar."
                            : "Camera unavailable. Check if another app (Zoom, Teams) is using the webcam."
                    );
                }
            }
        }

        initCamera();

        return () => {
            active = false;
            if (frameCheckTimer) clearTimeout(frameCheckTimer);
            stopCamera();
        };
    }, [selectedCameraId, stopCamera, refreshDevices]);

    useEffect(() => {
        if (submitted) {
            stop();
            stopCamera();
        }
    }, [submitted, stop, stopCamera]);

    // Live frame analysis loop using validated facial geometry & head pose
    useEffect(() => {
        let active = true;

        const analyze = (now) => {
            if (!active) return;
            const video = videoRef.current;
            const landmarker = landmarkerRef.current;

            if (
                video &&
                landmarker &&
                video.readyState >= 2 &&
                video.videoWidth > 0 &&
                video.videoHeight > 0 &&
                !video.paused &&
                now - lastFrameAtRef.current >= 200 // Sample ~5 frames per second
            ) {
                lastFrameAtRef.current = now;
                try {
                    const result = landmarker.detectForVideo(video, now);
                    const landmarks = result.faceLandmarks?.[0];
                    const geometry = analyzeFrameGeometry(landmarks);

                    trackerRef.current.addSample(geometry);

                    // Update UI metrics every 2 sampled frames
                    if (trackerRef.current.totalFrames % 2 === 0) {
                        const cur = trackerRef.current.getCurrentMetrics();
                        setMetrics({
                            faceVisible: cur.faceVisible,
                            centered: cur.centered,
                            facingScreen: cur.facingScreen,
                            liveGuidance: cur.liveGuidance,
                            liveStatusType: cur.liveStatusType,
                        });
                    }
                } catch {
                    // Ignore transient frame errors
                }
            }
            rafRef.current = requestAnimationFrame(analyze);
        };

        rafRef.current = requestAnimationFrame(analyze);

        return () => {
            active = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [camReady]);

    const answerText = transcript.trim();

    const submit = () => {
        const speechDuration = speechStartAtRef.current
            ? Math.max(1, Math.round((performance.now() - speechStartAtRef.current) / 1000))
            : trackerRef.current.totalFrames > 0
            ? Math.max(1, Math.round(trackerRef.current.totalFrames / 5))
            : 0;

        const videoAnalysis = trackerRef.current.finalizeReport(cameraLabel || "HP TrueVision / Built-in Camera");

        const speechAnalysis = answerText ? {
            duration_seconds: speechDuration,
            spoken: true,
        } : null;

        onSubmit(answerText, videoAnalysis, speechAnalysis);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column: Live Camera & Vision Signals */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="eyebrow">Camera &amp; Screen Orientation</p>
                    {onSwitchMode && (
                        <button
                            type="button"
                            onClick={() => onSwitchMode("mic")}
                            className="text-xs text-[#174A3A] font-semibold hover:underline"
                        >
                            Switch to Voice-Only (Mic) →
                        </button>
                    )}
                </div>

                {camError ? (
                    <div className="aspect-video rounded-md bg-[#FDF2F0] border border-[#E8C3BD] flex flex-col items-center justify-center p-5 text-center">
                        <span className="text-xl mb-1">📷</span>
                        <span className="text-sm font-semibold text-[#A44732] mb-1">Camera Access Issue</span>
                        <span className="text-xs text-[#68665F] max-w-sm">{camError}</span>
                        {onSwitchMode && (
                            <button
                                type="button"
                                onClick={() => onSwitchMode("mic")}
                                className="mt-3 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#174A3A] text-white hover:bg-[#123B2E]"
                            >
                                Continue with Microphone Mode
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div
                            onClick={() => {
                                const v = videoRef.current;
                                if (v && v.paused) {
                                    v.play().then(() => setCamReady(true)).catch(() => {});
                                }
                            }}
                            className="aspect-video rounded-md overflow-hidden bg-[#1C1C1A] border border-[#E5E0D5] relative shadow-inner"
                            title={camReady ? "Live camera preview" : "Click to start camera playback"}
                        >
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                                style={{ transform: "scaleX(-1)" }}
                            />

                            {!camReady && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1C1C1A] text-white p-4 text-center z-10">
                                    <div className="w-8 h-8 border-2 border-white/20 border-t-emerald-400 rounded-full animate-spin mb-2"></div>
                                    <span className="text-xs text-white/80">Connecting camera feed…</span>
                                    <span className="text-[10px] text-white/50 mt-1">Click here if video does not start automatically</span>
                                </div>
                            )}

                            {camReady && (
                                <>
                                    {/* Live indicator badge */}
                                    <span className="absolute top-2 left-2 text-[10px] font-bold tracking-wider uppercase text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-20">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live
                                    </span>

                                    {/* Real-time Screen-Facing & Centering Coach Badge */}
                                    <div className="absolute bottom-2 inset-x-2 flex justify-center z-20 pointer-events-none">
                                        <div
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-md flex items-center gap-1.5 transition-all ${
                                                metrics.liveStatusType === "success"
                                                    ? "bg-[#174A3A]/90 text-white border border-emerald-400/40"
                                                    : metrics.liveStatusType === "danger"
                                                    ? "bg-[#A44732]/90 text-white border border-rose-400/40"
                                                    : "bg-[#C8922E]/90 text-white border border-amber-300/40"
                                            }`}
                                        >
                                            <span>
                                                {metrics.liveStatusType === "success" ? "✓" : "⚠️"}
                                            </span>
                                            <span>{metrics.liveGuidance}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Device selector if multiple cameras detected */}
                        {availableCameras.length > 1 && (
                            <div className="flex items-center gap-2 pt-1">
                                <label className="text-[11px] font-medium text-[#68665F] whitespace-nowrap">Camera:</label>
                                <select
                                    value={selectedCameraId}
                                    onChange={(e) => {
                                        const id = e.target.value;
                                        setSelectedCameraId(id);
                                        try {
                                            if (id) localStorage.setItem(PREFERRED_CAM_KEY, id);
                                            else localStorage.removeItem(PREFERRED_CAM_KEY);
                                        } catch { /* ignore */ }
                                    }}
                                    className="text-xs bg-[#FAF7F0] border border-[#D9D3C7] rounded px-2 py-1 flex-1 text-[#1C1C1A] truncate"
                                >
                                    <option value="">Auto ({cameraLabel || "HP TrueVision / Built-in"})</option>
                                    {availableCameras.map((cam, idx) => (
                                        <option key={cam.deviceId || idx} value={cam.deviceId}>
                                            {cam.label || `Camera ${idx + 1}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {noFramesDetected && (
                            <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                                <p className="font-semibold flex items-center gap-1">
                                    <span>⚠️</span> No video frames received from webcam
                                </p>
                                <p className="text-[11px] text-amber-800 leading-relaxed">
                                    Your camera connected ({cameraLabel || "selected device"}), but is sending black frames. Please check:
                                </p>
                                <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                                    <li>Physical webcam privacy shutter / slider or Fn camera key is open.</li>
                                    <li>No other app (Zoom, Teams, Camera app) is actively using the webcam.</li>
                                    {availableCameras.length > 1 && <li>Try selecting a different camera from the dropdown above.</li>}
                                </ul>
                                {onSwitchMode && (
                                    <button
                                        type="button"
                                        onClick={() => onSwitchMode("mic")}
                                        className="mt-1 text-xs font-semibold text-[#174A3A] underline hover:text-[#123B2E]"
                                    >
                                        Or switch to Voice-Only Microphone Interview →
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <p className="text-xs text-[#68665F] mt-2">{visionStatus}</p>

                {/* Validated Objective Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                    <Metric
                        label="Face Visible"
                        value={`${metrics.faceVisible}%`}
                        hint="Proportion of time face is detected"
                    />
                    <Metric
                        label="Centered"
                        value={`${metrics.centered}%`}
                        hint="Proportion within central target framing"
                    />
                    <Metric
                        label="Facing Screen"
                        value={`${metrics.facingScreen}%`}
                        hint="Head oriented toward camera"
                    />
                </div>
                <p className="text-[10px] text-[#68665F] mt-2 leading-relaxed">
                    Evaluates natural screen orientation and central framing using geometric head pose (yaw/pitch). Non-intrusive and processed entirely in your browser without recording or uploading video frames.
                </p>
            </div>

            {/* Right Column: Live Transcript & Answer Verification */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <p className="eyebrow">Interview Transcript &amp; Answer</p>
                    <span className="text-[11px] text-[#68665F]">
                        {listening ? "Recording spoken words…" : "Review or edit before submitting"}
                    </span>
                </div>

                {!supported && (
                    <p className="text-xs text-[#A44732] mb-2">
                        Live speech recognition is unavailable in this browser. You may type your answer directly into the transcript box below.
                    </p>
                )}

                <div className="flex items-center gap-3 mb-3">
                    <button
                        type="button"
                        onClick={listening ? handleStopSpeaking : handleStartSpeaking}
                        disabled={submitted || !supported}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                            listening
                                ? "bg-[#A44732] text-white shadow-sm"
                                : "bg-[#174A3A] text-white hover:bg-[#123B2E] disabled:opacity-50"
                        }`}
                    >
                        {listening ? "⏹ Stop Speaking" : "🎙 Start Speaking"}
                    </button>

                    {listening && (
                        <span className="text-xs text-[#C8922E] flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-[#C8922E] animate-pulse" />
                            Listening &amp; transcribing…
                        </span>
                    )}

                    {!listening && transcript && (
                        <span className="text-xs text-[#2F6B57] font-medium">
                            ✓ {transcript.split(/\s+/).filter(Boolean).length} words recorded
                        </span>
                    )}
                </div>

                {/* Editable Transcript Area to Guarantee Transcription Reliability */}
                <div className="flex-1 flex flex-col">
                    <textarea
                        value={transcript}
                        onChange={(e) => {
                            setIsEditingTranscript(true);
                            setTranscript(e.target.value);
                        }}
                        disabled={submitted}
                        placeholder={
                            listening
                                ? "Your transcript is appearing here as you speak…"
                                : "Click 'Start Speaking' to transcribe your spoken answer, or type your response here directly…"
                        }
                        className="w-full flex-1 min-h-[160px] p-3.5 rounded-md bg-[#FAF7F0] border border-[#E5E0D5] text-sm text-[#1C1C1A] leading-relaxed focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#174A3A] resize-y"
                    />
                    <div className="flex items-center justify-between mt-1 text-[11px] text-[#68665F]">
                        <span>Candidate can edit any words if speech recognition dropped syllables.</span>
                        {transcript && (
                            <button
                                type="button"
                                onClick={() => setTranscript("")}
                                className="text-[#A44732] hover:underline"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {!submitted && (
                    <div className="mt-4">
                        <PrimaryButton
                            loading={evaluating}
                            onClick={submit}
                            disabled={!answerText || evaluating}
                        >
                            {evaluating ? "Evaluating Answer…" : "Submit Answer & Evaluate"}
                        </PrimaryButton>
                        {!answerText && !evaluating && (
                            <p className="text-[11px] text-[#68665F] mt-1.5 text-center">
                                Speak your answer or type above to enable submission.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function Metric({ label, value, hint }) {
    return (
        <div className="rounded-md border border-[#E5E0D5] bg-[#FAF7F0] p-2.5" title={hint}>
            <p className="text-[10px] text-[#68665F] uppercase font-bold tracking-wider">{label}</p>
            <p className="text-base font-bold text-[#174A3A] mt-0.5">{value}</p>
        </div>
    );
}
