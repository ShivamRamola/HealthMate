// firebaseSignaling.js

import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    onSnapshot,
    arrayUnion
  } from "firebase/firestore";
  import { db } from "../firebase/firebase.js"; // Make sure this path is correct in your project
  
  let callDoc, offerCandidatesCollection, answerCandidatesCollection;
  
  /**
   * Sets up a WebRTC call as the caller.
   * @param {RTCPeerConnection} peerConnection
   */
  export async function createCall(peerConnection) {
    // Create a new call document in Firestore
    callDoc = doc(collection(db, "calls"));
    offerCandidatesCollection = collection(callDoc, "offerCandidates");
    answerCandidatesCollection = collection(callDoc, "answerCandidates");
  
    // Listen for ICE candidates and store them in Firestore
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await setDoc(doc(offerCandidatesCollection), event.candidate.toJSON());
      }
    };
  
    // Create the offer
    const offerDescription = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offerDescription);
  
    // Save the offer to Firestore
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type
    };
    await setDoc(callDoc, { offer });
  
    // Listen for remote answer
    onSnapshot(callDoc, async (snapshot) => {
      const data = snapshot.data();
      if (!peerConnection.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        await peerConnection.setRemoteDescription(answerDescription);
      }
    });
  
    // Listen for remote ICE candidates
    onSnapshot(answerCandidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.addIceCandidate(candidate);
        }
      });
    });
  
    return callDoc.id; // Return the call ID so the callee can use it
  }
  
  /**
   * Joins an existing call as the callee.
   * @param {RTCPeerConnection} peerConnection
   * @param {string} callId
   */
  export async function answerCall(peerConnection, callId) {
    // Get the call document
    callDoc = doc(db, "calls", callId);
    offerCandidatesCollection = collection(callDoc, "offerCandidates");
    answerCandidatesCollection = collection(callDoc, "answerCandidates");
  
    // Listen for ICE candidates and store them in Firestore
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await setDoc(doc(answerCandidatesCollection), event.candidate.toJSON());
      }
    };
  
    // Get offer and set as remote description
    const callData = (await getDoc(callDoc)).data();
    const offerDescription = new RTCSessionDescription(callData.offer);
    await peerConnection.setRemoteDescription(offerDescription);
  
    // Create and set local answer
    const answerDescription = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answerDescription);
  
    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp
    };
    await updateDoc(callDoc, { answer });
  
    // Listen for remote ICE candidates
    onSnapshot(offerCandidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.addIceCandidate(candidate);
        }
      });
    });
  }
  