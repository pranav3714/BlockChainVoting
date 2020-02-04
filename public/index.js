let httpRequest = (_link, _json, successCallback, failCallback = (a, b, c) => { console.log("error") }) => {
    $.ajax({
        url: _link,
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(_json),
        processData: false,
        success: successCallback,
        error: failCallback
    })
}

$(document).ready(() => {
    $("#login").submit((e) => {
        e.preventDefault()
        if(imageData == ""){
            return
        }
        let json = { panNumber: $("#panNum").val(), phone: $("#phoneNumber").val(), imageData }
        httpRequest("/auth", json, (data, textStatus, jQxhr) => {
            console.log(data)
            if (data.status == "OK") {
                localStorage.setItem('pan', json.panNumber)
                $("#login").hide()
                $("#otp").show()
                $(".tohide").hide()
            }
            else {
                $("#loginError").text(data.status)
            }
        })
    })
    $("#otp").submit((e) => {
        e.preventDefault()
        let json = { panNumber: localStorage.getItem('pan'), otp: $("#otpNum").val() }
        //console.log(json)
        httpRequest("/otp", json, (data, textStatus, jQxhr) => {
            if (data.status == "OK") {
                localStorage.setItem('name', data.name)
                localStorage.setItem('token', data.token)
                window.location = "/vote"
            }
            else {
                $("#otpError").text(data.status)
            }
        })
    })
    const video = document.getElementById('video')
    const canvas = document.getElementById('captured')
    const snap = document.getElementById('snap')
    const error = $("#spanErrorMsg")
    let imageData = ""
    const constraints = {
        audio: false,
        video: {
            width: 1280, height: 720
        }
    }
    async function init() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            handleSuccess(stream)
        }
        catch (e) {
            error.html("Allow access to webcam or use a system with webcam to login")
            document.getElementById("panSubmit").parentNode.removeChild(document.getElementById("panSubmit"))
        }
    }
    function handleSuccess(stream) {
        window.stream = stream
        video.srcObject = stream
    }
    init()
    var context = canvas.getContext('2d')
    snap.addEventListener('click', function () {
        context.drawImage(video, 0, 0, 640, 480)
        imageData = canvas.toDataURL('image/jpeg', 0.5)
        console.log(imageData)
    })
})