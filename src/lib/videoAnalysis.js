/**
 * Video Interview Analysis Engine
 * 
 * Provides validated geometric calculations, coordinate normalization,
 * head-pose estimation (yaw, pitch, roll), central framing validation,
 * and temporal smoothing for video mock interviews using MediaPipe 3D face mesh.
 * 
 * Primary Coaching Objective:
 * Determine whether the candidate is appropriately facing the screen and
 * maintaining centered framing without relying on misleading eye-contact metrics.
 */

// Target framing bounds (normalized coordinate system [0, 1])
export const FRAMING_BOUNDS = {
    // Central bounding region for face center / nose
    X_MIN: 0.28,
    X_MAX: 0.72,
    Y_MIN: 0.18,
    Y_MAX: 0.82,
    // Expected face span (distance between left and right temples relative to frame width)
    MIN_FACE_SPAN: 0.18, // Further away than this is "Too Far"
    MAX_FACE_SPAN: 0.55, // Closer than this is "Too Close"
};

// Screen-facing head orientation thresholds (asymmetry ratios)
export const ORIENTATION_THRESHOLDS = {
    // Horizontal yaw: |(dL - dR) / (dL + dR)| <= 0.22 corresponds to roughly +/- 15 degrees
    MAX_YAW_RATIO: 0.22,
    // Vertical pitch: |(dTop - dBottom) / (dTop + dBottom)| <= 0.25 corresponds to natural screen tilt
    MAX_PITCH_RATIO: 0.25,
    // Lateral roll: angle in radians <= 0.26 rad (roughly 15 degrees tilt)
    MAX_ROLL_RADIANS: 0.26,
};

/**
 * Validates that face landmarks are populated with valid numerical coordinates.
 * @param {Array<{x: number, y: number, z?: number}>} landmarks 
 * @returns {boolean}
 */
export function isValidLandmarks(landmarks) {
    if (!landmarks || !Array.isArray(landmarks) || landmarks.length < 468) {
        return false;
    }
    // Check key reference points: nose(1), temples(234, 454), forehead(10), chin(152)
    const indices = [1, 10, 152, 234, 454];
    for (const idx of indices) {
        const pt = landmarks[idx];
        if (!pt || typeof pt.x !== "number" || typeof pt.y !== "number") return false;
        if (Number.isNaN(pt.x) || Number.isNaN(pt.y)) return false;
        if (pt.x < -0.2 || pt.x > 1.2 || pt.y < -0.2 || pt.y > 1.2) return false;
    }
    return true;
}

/**
 * Analyzes a single video frame's facial landmarks.
 * Returns geometric measurements and positional guidance.
 * 
 * @param {Array<{x: number, y: number, z?: number}>} landmarks 
 * @returns {Object} frame analysis result
 */
export function analyzeFrameGeometry(landmarks) {
    if (!isValidLandmarks(landmarks)) {
        return {
            detected: false,
            centered: false,
            facingScreen: false,
            guidance: "Face not detected in frame",
            guidanceType: "danger",
            yawRatio: 0,
            pitchRatio: 0,
            rollAngle: 0,
            faceSpan: 0,
            nosePos: null,
        };
    }

    const nose = landmarks[1] || landmarks[4];
    const forehead = landmarks[10];
    const chin = landmarks[152];
    const leftTemple = landmarks[234];
    const rightTemple = landmarks[454];

    // 1. Calculate Face Centering
    const isCentered = 
        nose.x >= FRAMING_BOUNDS.X_MIN &&
        nose.x <= FRAMING_BOUNDS.X_MAX &&
        nose.y >= FRAMING_BOUNDS.Y_MIN &&
        nose.y <= FRAMING_BOUNDS.Y_MAX;

    // 2. Face scale / framing distance
    const dxTemples = rightTemple.x - leftTemple.x;
    const dyTemples = rightTemple.y - leftTemple.y;
    const faceSpan = Math.hypot(dxTemples, dyTemples);
    const isTooFar = faceSpan < FRAMING_BOUNDS.MIN_FACE_SPAN;
    const isTooClose = faceSpan > FRAMING_BOUNDS.MAX_FACE_SPAN;

    // 3. Head Pose & Screen Facing Estimation
    // Horizontal Yaw Asymmetry:
    // Distance from nose to left temple (dL) vs nose to right temple (dR)
    const dL = Math.hypot(nose.x - leftTemple.x, nose.y - leftTemple.y);
    const dR = Math.hypot(nose.x - rightTemple.x, nose.y - rightTemple.y);
    const yawSum = dL + dR;
    const yawRatio = yawSum > 0.001 ? (dL - dR) / yawSum : 0;

    // Vertical Pitch Asymmetry:
    // Distance from forehead to nose vs nose to chin
    const dTop = Math.max(0, nose.y - forehead.y);
    const dBottom = Math.max(0, chin.y - nose.y);
    const pitchSum = dTop + dBottom;
    const pitchRatio = pitchSum > 0.001 ? (dTop - dBottom) / pitchSum : 0;

    // Lateral Roll (Head Tilt)
    const rollAngle = Math.atan2(dyTemples, dxTemples);

    // Screen facing check
    const isYawFacing = Math.abs(yawRatio) <= ORIENTATION_THRESHOLDS.MAX_YAW_RATIO;
    const isPitchFacing = Math.abs(pitchRatio) <= ORIENTATION_THRESHOLDS.MAX_PITCH_RATIO;
    const isRollFacing = Math.abs(rollAngle) <= ORIENTATION_THRESHOLDS.MAX_ROLL_RADIANS;
    const isFacingScreen = isYawFacing && isPitchFacing && isRollFacing;

    // 4. Determine instantaneous positioning guidance
    let guidance = "Centered & Facing Screen";
    let guidanceType = "success";

    if (!isCentered) {
        guidance = "Position yourself toward the center of the frame";
        guidanceType = "warning";
    } else if (isTooClose) {
        guidance = "Move back slightly from the camera";
        guidanceType = "warning";
    } else if (isTooFar) {
        guidance = "Move a bit closer to the camera";
        guidanceType = "warning";
    } else if (!isFacingScreen) {
        if (!isYawFacing) {
            guidance = yawRatio > 0 ? "Turn head slightly to your right" : "Turn head slightly to your left";
        } else if (!isPitchFacing) {
            guidance = pitchRatio > 0 ? "Tilt head up toward the camera" : "Tilt head down toward the camera";
        } else {
            guidance = "Keep your head level with the camera";
        }
        guidanceType = "warning";
    }

    return {
        detected: true,
        centered: isCentered,
        facingScreen: isFacingScreen,
        guidance,
        guidanceType,
        yawRatio: Math.round(yawRatio * 1000) / 1000,
        pitchRatio: Math.round(pitchRatio * 1000) / 1000,
        rollAngle: Math.round(rollAngle * 1000) / 1000,
        faceSpan: Math.round(faceSpan * 1000) / 1000,
        nosePos: { x: Math.round(nose.x * 1000) / 1000, y: Math.round(nose.y * 1000) / 1000 }
    };
}

/**
 * Temporal smoothing tracker for sustained vs transient detection.
 */
export class VideoMetricsTracker {
    constructor(windowSize = 8) {
        this.windowSize = windowSize;
        this.reset();
    }

    reset() {
        this.totalFrames = 0;
        this.faceFrames = 0;
        this.centeredFrames = 0;
        this.facingScreenFrames = 0;
        this.optimalFramingFrames = 0;
        this.recentHistory = [];
        this.startedAt = performance.now();
        this.lastNosePos = null;
        this.excessiveMovementFrames = 0;
    }

    addSample(geometry) {
        this.totalFrames += 1;

        if (!geometry || !geometry.detected) {
            this.recentHistory.push({ detected: false, centered: false, facingScreen: false });
            if (this.recentHistory.length > this.windowSize) this.recentHistory.shift();
            return;
        }

        this.faceFrames += 1;
        if (geometry.centered) this.centeredFrames += 1;
        if (geometry.facingScreen) this.facingScreenFrames += 1;
        if (geometry.faceSpan >= FRAMING_BOUNDS.MIN_FACE_SPAN && geometry.faceSpan <= FRAMING_BOUNDS.MAX_FACE_SPAN) {
            this.optimalFramingFrames += 1;
        }

        // Fidgeting / abrupt position shift check
        if (this.lastNosePos && geometry.nosePos) {
            const movement = Math.hypot(
                geometry.nosePos.x - this.lastNosePos.x,
                geometry.nosePos.y - this.lastNosePos.y
            );
            if (movement > 0.10) {
                this.excessiveMovementFrames += 1;
            }
        }
        this.lastNosePos = geometry.nosePos;

        this.recentHistory.push({
            detected: true,
            centered: geometry.centered,
            facingScreen: geometry.facingScreen,
        });
        if (this.recentHistory.length > this.windowSize) this.recentHistory.shift();
    }

    /**
     * Computes smoothed current metrics for UI display.
     */
    getCurrentMetrics() {
        const total = this.totalFrames;
        const faces = this.faceFrames;

        const faceVisiblePct = total > 0 ? Math.round((faces / total) * 100) : 0;
        const centeredPct = faces > 0 ? Math.round((this.centeredFrames / faces) * 100) : 0;
        const facingScreenPct = faces > 0 ? Math.round((this.facingScreenFrames / faces) * 100) : 0;

        // Determine smoothed guidance based on recent sliding window
        let liveGuidance = "Centered & Facing Screen";
        let liveStatusType = "success";

        if (this.recentHistory.length > 0) {
            const detectedInWindow = this.recentHistory.filter(h => h.detected).length;
            const centeredInWindow = this.recentHistory.filter(h => h.centered).length;
            const facingInWindow = this.recentHistory.filter(h => h.facingScreen).length;

            if (detectedInWindow === 0) {
                liveGuidance = "Face not detected in frame";
                liveStatusType = "danger";
            } else if (centeredInWindow / detectedInWindow < 0.5) {
                liveGuidance = "Adjust position toward screen center";
                liveStatusType = "warning";
            } else if (facingInWindow / detectedInWindow < 0.5) {
                liveGuidance = "Turn your face toward the screen";
                liveStatusType = "warning";
            }
        }

        return {
            faceVisible: faceVisiblePct,
            centered: centeredPct,
            facingScreen: facingScreenPct,
            liveGuidance,
            liveStatusType,
        };
    }

    /**
     * Finalizes session results into a structured, validated report.
     */
    finalizeReport(cameraDevice = "Webcam") {
        const total = this.totalFrames;
        const faces = this.faceFrames;
        const durationSec = Math.max(1, Math.round((performance.now() - this.startedAt) / 1000));

        if (total === 0 || faces < 3) {
            return {
                frame_count: total,
                duration_seconds: durationSec,
                face_visible_percent: 0,
                centered_percent: 0,
                facing_screen_percent: 0,
                screen_facing_status: "Insufficient Visual Information",
                framing_status: "Camera Inactive or Face Absent",
                camera_device_used: cameraDevice,
                analysis_method: "MediaPipe 468-point 3D Landmark Vector Model",
            };
        }

        const faceVisiblePct = Math.round((faces / total) * 100);
        const centeredPct = Math.round((this.centeredFrames / faces) * 100);
        const facingScreenPct = Math.round((this.facingScreenFrames / faces) * 100);

        // Screen-Facing Classification
        let screenFacingStatus = "Consistently Facing Screen";
        if (facingScreenPct < 50) {
            screenFacingStatus = "Frequently Turned Away";
        } else if (facingScreenPct < 75) {
            screenFacingStatus = "Generally Facing Screen";
        }

        // Framing Classification
        let framingStatus = "Well Centered in Frame";
        if (centeredPct < 60) {
            framingStatus = "Sustained Off-Center Positioning";
        }

        return {
            frame_count: total,
            duration_seconds: durationSec,
            face_visible_percent: faceVisiblePct,
            centered_percent: centeredPct,
            facing_screen_percent: facingScreenPct,
            screen_facing_status: screenFacingStatus,
            framing_status: framingStatus,
            camera_device_used: cameraDevice,
            analysis_method: "MediaPipe 468-point 3D Landmark Vector Model",
        };
    }
}
