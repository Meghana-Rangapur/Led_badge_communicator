const video = document.getElementById("video");
const messageOutput = document.getElementById("messageOutput");


async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => resolve(video);
    });
}


async function loadHandModel() {
    const model = await handPoseDetection.createDetector(handPoseDetection.SupportedModels.MediaPipeHands, {
        runtime: "mediapipe",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
    });
    return model;
}


async function recognizeGestures(model) {
    const hands = await model.estimateHands(video);

    if (hands.length > 0) {
        const landmarks = hands[0].keypoints;
        const message = detectGesture(landmarks);
        messageOutput.innerText = message;
    }

    requestAnimationFrame(() => recognizeGestures(model));
}


function detectGesture(landmarks) {
    if (isOpenPalm(landmarks)) return "HELP! URGENT!";
    if (isVShape(landmarks)) return "NEED MEDICAL ASSISTANCE!";
    if (isThumbsUp(landmarks)) return "I AM SAFE";
    if (isCuppedHand(landmarks)) return "NEED WATER";
    if (isPointingUp(landmarks)) return "CALL POLICE IMMEDIATELY!";
    if (isCrossedWrists(landmarks)) return "DANGER! EVACUATE NOW!";
    if (isHandsOnHead(landmarks)) return "I AM LOST, NEED HELP!";
    return "No Gesture Detected";
}


function isOpenPalm(landmarks) {
    return landmarks[4].y > landmarks[8].y && landmarks[12].y > landmarks[8].y;
}

function isVShape(landmarks) {
    return Math.abs(landmarks[8].y - landmarks[12].y) < 20;
}

function isThumbsUp(landmarks) {
    return landmarks[4].y < landmarks[8].y;
}

function isCuppedHand(landmarks) {
    return landmarks[4].y > landmarks[12].y && landmarks[8].y > landmarks[12].y;
}

function isPointingUp(landmarks) {
    return landmarks[8].y < landmarks[6].y;
}

function isCrossedWrists(landmarks) {
    return Math.abs(landmarks[4].x - landmarks[20].x) < 30;
}

function isHandsOnHead(landmarks) {
    return landmarks[8].y < 100 && landmarks[12].y < 100;
}


(async function () {
    await setupCamera();
    const model = await loadHandModel();
    recognizeGestures(model);
})();
