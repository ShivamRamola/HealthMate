const socket = io();

// Get media stream (camera and mic)
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        document.getElementById('localVideo').srcObject = stream;
        localStream = stream;
    })
    .catch((err) => {
        console.error("Error getting media stream: ", err);
    });

// Set up peer connection
const peerConnection = new RTCPeerConnection();

// Add local stream to peer connection
localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
});

// Create offer
document.getElementById('startCallBtn').onclick = () => {
    peerConnection.createOffer()
        .then((offer) => {
            return peerConnection.setLocalDescription(offer);
        })
        .then(() => {
            socket.emit('call-initiated', { offer: peerConnection.localDescription });
        })
        .catch((err) => {
            console.error("Error creating offer: ", err);
        });
};

// Receive offer and answer
socket.on('call-initiated', (data) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

    peerConnection.createAnswer()
        .then((answer) => {
            return peerConnection.setLocalDescription(answer);
        })
        .then(() => {
            socket.emit('call-answered', { answer: peerConnection.localDescription });
        })
        .catch((err) => {
            console.error("Error creating answer: ", err);
        });
});

// Handle ICE candidates
peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
        socket.emit('new-ice-candidate', { candidate: event.candidate });
    }
};

socket.on('new-ice-candidate', (data) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
        .catch((err) => {
            console.error("Error adding ice candidate: ", err);
        });
});

// Display remote stream
peerConnection.ontrack = (event) => {
    document.getElementById('remoteVideo').srcObject = event.streams[0];
};

// End call
document.getElementById('endCallBtn').onclick = () => {
    peerConnection.close();
    localStream.getTracks().forEach(track => track.stop());
    document.getElementById('localVideo').srcObject = null;
    document.getElementById('remoteVideo').srcObject = null;
};
