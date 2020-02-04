require('@tensorflow/tfjs-node');
const canvas = require('canvas');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = canvas

faceapi.env.monkeyPatch({ Canvas, Image, ImageData })
let main = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('weights')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('weights')
    await faceapi.nets.faceRecognitionNet.loadFromDisk('weights')
}
main()
exports.faceVerify = async (queImage, refImage) => {
    const referenceImage = await canvas.loadImage(refImage)
    const resultsQuery = await faceapi.detectAllFaces(referenceImage, new faceapi.SsdMobilenetv1Options(0.5)).withFaceLandmarks().withFaceDescriptors()
    //console.log(resultsQuery)
    if(resultsQuery.length == 0){
        console.log("Try Another image")
        return -1
    }
    else if(resultsQuery.length > 1){
        console.log("Make sure only one person in front of camera")
        return 0
    }
    const queryImage = await canvas.loadImage(queImage)
    const resultsRef = await faceapi.detectAllFaces(queryImage, new faceapi.SsdMobilenetv1Options(0.5)).withFaceLandmarks().withFaceDescriptors()
    const facematcher = new faceapi.FaceMatcher(resultsRef)
    return facematcher.findBestMatch(resultsQuery[0].descriptor).label
}