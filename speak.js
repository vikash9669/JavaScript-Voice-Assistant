

// face detection code starts here

// var count=0;
        var firstFaceDetected = false;
        var camStreamWidth = 640;
        var camStreamHeight = 480;
    
        var VIEW_WIDTH = 320;
        var VIEW_HEIGHT = 240;
    
        var video = document.getElementById("video");
        var canvas = document.getElementById("canvas");
    
        canvas.width = VIEW_WIDTH;
        canvas.height = VIEW_HEIGHT;
    
        var webcamParams = {
            video: {
                mandatory: {
                    maxWidth: camStreamWidth,
                    maxHeight: camStreamHeight,
                    minWidth: camStreamWidth,
                    minHeight: camStreamHeight
                }
            }
        };
        var webcamMgr = new WebCamManager(
            {
                webcamParams: webcamParams, //Set params for web camera
                testVideoMode: false,//true:force use example video for test false:use web camera
                videoTag: video
            }
        );
    
        var faceDetector = new FaceDetector(
            {
                video: webcamMgr.getVideoTag(),
                flipLeftRight: false,
                flipUpsideDown: false
            }
        );
    
        webcamMgr.setOnGetUserMediaCallback(function () {
            faceDetector.startDetecting();
        });
    
        

        faceDetector.setOnFaceAddedCallback(function (addedFaces, detectedFaces) {
            setTimeout(() => {
                for (var i = 0; i < addedFaces.length; i++) {
                    console.log("[facedetector] New face detected id=" + addedFaces[i].faceId + " index=" + addedFaces[i].faceIndex);
        
                    if (!firstFaceDetected) {
                        firstFaceDetected = true; // set the flag to true to indicate the first face is detected
                        setTimeout(() => { // wait for 10 seconds
                            let firstMessage = "aaaaaaaa";
                            computerSpeech(firstMessage);
                            activationMassege();
                        }, 3000);
                    }
                    
                }
            }, 3000)
        });
        
    
    
        faceDetector.setOnFaceUpdatedCallback(function (detectedFaces) {
    
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;
            ctx.fillStyle = "red";
            ctx.font = "italic small-caps bold 20px arial";
    
            for (var i = 0; i < detectedFaces.length; i++) {
    
                var face = detectedFaces[i];
    
                ctx.fillText(face.faceId, face.x * VIEW_WIDTH, face.y * VIEW_HEIGHT);
                ctx.strokeRect(face.x * VIEW_WIDTH, face.y * VIEW_HEIGHT + 10, face.width * VIEW_WIDTH, face.height * VIEW_HEIGHT);
    
            }
        });
    
    
        webcamMgr.startCamera();
// face detection code ends here




// speech recognition code starts here

const button = document.querySelector("button");
const speechRecognition = window.speechRecognition || window.webkitSpeechRecognition;

const myButton = document.getElementById("speak");
const recognition = new speechRecognition();
recognition.onstart = function () {
    console.log("recognition started");
    myButton.style.color = "red";
};

// makes the mike button red on recording
recognition.onend = function(){

console.log("recognition ended");
myButton.style.color = "gray";

}

recognition.onresult = function (event){
    console.log (event);
    var spokenwords = event.results[0][0].transcript.toLowerCase().trim();
    spokenwords = spokenwords.replace("abhiyan","avyaan");
    console.log("your voice",spokenwords);    
    let userText = spokenwords;
    let userHtml = '<p class="userText"><i class="ri-user-3-fill"></i><span>' + userText + '</span></p>';
    $("#chatbox").append(userHtml);
    document.getElementById("chat-bar-bottom").scrollIntoView(true);

    setTimeout(() => {
        let outputValue = computerSpeech(userText);
        getHardResponse(outputValue);
    }, 1000)

};

var speech=new SpeechSynthesisUtterance();
// Makes the computer speak
function computerSpeech(words){
    speech.lang = 'hi-IN-Wavenet-D';
    speech.voiceURI = 'Google हिन्दी';
    speech.pitch=0.85555;
    speech.volume=1;
    speech.rate=1;

    determinewords(speech,words);
    
    window.speechSynthesis.speak(speech);
    console.log(speech.text);
    

    
    const outputValue = speech.text;
    return outputValue;
   
};

// Starts the speechrecognition on when computer stops speaking

    speech.onend = function(event) {
    // the computer has finished speaking, trigger your event here
    console.log("The computer has finished speaking.");
    micOn();
  };

// sends first massege to the user

function firstBotMessage() {
    // let firstMessage = "How's it going?"
// getHardResponse(firstMessage);
 document.getElementById("userInput").scrollIntoView(false);
}

// Retrieves the response
function getHardResponse(outputValue) {
    let botHtml = '<p class="botText"><i class="ri-robot-fill"></i><span>' + outputValue + '</span></p>';
    $("#chatbox").append(botHtml);
    // $("#chatbox").pop()
    document.getElementById("chat-bar-bottom").scrollIntoView(true);
    setTimeout(function(){
        $('.gif')[0].pause();
    },3000);
    $('.gif')[0].play();
};


//Gets the text text from the input box and processes it
function getResponse(){
    let userText = $("#InputBox").val();

    if (userText == "") {
        let blankoutput="Try to ask something!";
        let botHtml = '<p class="botText"><i class="ri-robot-fill"></i><span>' + blankoutput + '</span></p>';
        $("#InputBox").val("");
        $("#chatbox").append(botHtml);
        document.getElementById("chat-bar-bottom").scrollIntoView(true);
   
        
    }

    else{

        let userHtml = '<p class="userText"><i class="ri-user-3-fill"></i><span>' + userText + '</span></p>';
        
        $("#InputBox").val("");
        $("#chatbox").append(userHtml);
        document.getElementById("chat-bar-bottom").scrollIntoView(true);
        
        setTimeout(() => {
            const outputValue = computerSpeech(userText);
            getHardResponse(outputValue);
        }, 1000)
    }
    };

    // sends the first massege
    function activationMassege(){
        let landingMassege="hi!, wellcome to avyaan. how may i help you?"
        let botHtml = '<p class="botText"><i class="ri-robot-fill"></i><span>' + landingMassege + '</span></p>';
        $("#InputBox").val("");
        $("#chatbox").append(botHtml);
        document.getElementById("chat-bar-bottom").scrollIntoView(true);

       
    };
// voice recognition starts
 function micOn(){
        recognition.start();
    };


//runs when send batton pressed
function sendButton() {
    getResponse();
};

// runs when we type in input box and press enter 
$("#InputBox").keypress(function (e) {
    if (e.which == 13) {
        getResponse();
    }
});



// The function gets the value as we typed or spoke and give th response
function determinewords(speech,words){
         if(words.match("how are you")){
            speech.text = "i am fine ! what about you?";
        } 
        
        else if (words.match("open google"))
	    {
		// "https://" is important!
        document.innerHTML = "Opening Google";
		window.open("https://www.google.com", "_blank");
	    }
        
        else if(words.match("who are you")){
            speech.text = "I am an vertual assistent of avyaan, to assist you.";
        }
        
        else if(words.match("avyaan")){
            speech.text = "Avyaan management is a it company founded in 2022, situated in bhopal madhyapradesh";
        }
        
        else if(words.match("hi")||words.match("hello")||words.match("hiii")||words.match("hlo")||words.match("hii")){
            speech.text = "Hello Buddy!";
        }
        
        else if(words.match("i love you")){
            speech.text = "i love you too !";
        }
        // else if(words.match("distinguishes")||words.match("Avayaan")||words.match("BPO")){
        //     speech.text = " ";
        // }
       
        
        else if(words.match("since")||words.match("when")||words.match("new")||words.match("old")){
            speech.text = "In 2022, Avyaan Management started its journey towards service industry exploring into divergent areas where BPO, KPO, RPO is a part as well as becoming a pioneer in the field of Future AI. Over the year, we also expanded into different service zones including AI/ML, Digital marketing, Chatbot. Customer support services (24*7), Technical support services etc.";
        }
     
        // else if(words.match("people")||words.match("workers")||words.match("staff")||words.match("people")){
        //     speech.text = "";
        // }
        
        else if(words.match("shift")||words.match("timing")||words.match("working hour")||words.match("schedule")||words.match("night")){
            speech.text = "the shift timings are 9:00 AM onwords to 7:00 PM onwords every week day, their is no night shift.";
        }
        
        else if(words.match("hiring")||words.match("requirement")||words.match("vacancy")||words.match("jobs")||words.match("posts")||words.match("recrutment")){
            speech.text = "we do belive in the skills rather than the rankings so we have so many opportunities and the job opening for the various profiles and you can ask for the JD on the reception itself.";
        }
        
        else if(words.match("policies")||words.match("rules")){
            speech.text = "we are following each and every rule in which we are bounded woth the INdian Govt rules of labour LAws tht we have registred with.";
        }
        
        else if(words.match("work")||words.match("kaam")||words.match("activities")||words.match("working")||words.match("type of work")){
            speech.text = "we are one of the leading service providers for domestic and international clientsfor the domains like AI&ML industry in which we cover data collection and data annotation along with contact center services of multiple clients around the nation and we also prviding th digital marketing services to national and international clients so overall and last bot not the least IT services like webste devploepment and software devlopement plus virtual assitance for the details informations you can ask speceficcaly the details of the perticular domains";
        }
        
        else if(words.match("working days")||words.match("office days")){
            speech.text = "We works all week days, and their is a day off in week as per workers choice either sunday or either thursday";
        }
        
        else if(words.match("leaves")||words.match("holydays")||words.match("chutti")||words.match("absent")||words.match("closed")||words.match("off days")){
            speech.text = "As we work all week days so if someone wants leave he/she can mail ho HR manager or leave qeuries, otherwise some action we be taken on the worker if taking leave without informing HR.";
        }
        
        else if(words.match("forms")||words.match("registeration form")||words.match("apply")||words.match("application form")||words.match("documents")||words.match("resume")||words.match("cv")){
            speech.text = "self information form or interview form available at reception desk";
        }
        
        else if(words.match("attendance")||words.match("present")||words.match("fingerprint")||words.match("absence")){
            speech.text = "We work 10:00 AM to 7:00 PM in all week days, While entering the office workers have to punchin in the attendance monitoring device and vise-versa and register your entery and outgoings at reception ";
        }
        
        else if(words.match("branches")||words.match("second office")||words.match("local")||words.match("globle")){
            speech.text = " We have no branches, we have a main offce at 2nd Floor Shree Ram Plaza ";
        }
        
        else if(words.match("washroom")|| words.match("restroom")||words.match("mens washroom")||words.match("girls room")){
             speech.text = "Their are both men's and women's rest room's are available at Avyaan office, they located at the left side of main enterance of office";
         }
        
         else if(words.match("interview")||words.match("rounds")||words.match("hr")||words.match("first round")||words.match("second round")||words.match("hr round")){
            speech.text = "normally there are 3 rounds 1. screening 2. technichal round 3. final round but it can be increadsed in exceptional cases ";
        }
        
        else if(words.match("processes")||words.match("office work")||words.match("environment")||words.match("working place")){
            speech.text = "Avyaan Mangement has a quite good Working environment, Every worker has their own table,chaire and desktop computer as well, and a ggod view of bhopal at windoew";
        }
        
        else if(words.match("documents")||words.match("resume")||words.match("cv")){
            speech.text = "Resume/ CV needed while coming to give an interview, Theirfor after all rounds of interview some document needed to submit to HR like- Marksheet 10 standard, Aadhar Card and two Photos. ";
        }
        
        else if (words.match("map")||words.match("map location")||words.match("avyaan location")||words.match("location")||words.match("area")||words.match("company place"))
	    {
		// "https://" is important!
        document.innerHTML = "Opening Avyaan Management pvt. ltd. location page";
		window.open("https://goo.gl/maps/z8EjmmwzW2PMy4G39", "_blank");
	    }

        else if(words.match("contact")||words.match("mobile number")||words.match("email")||words.match("contact information")){
            speech.text = "You can contact us via phone :-  +91 0755-4940937 and via Email :- connect@avyaanmgmt.com";
        }

        else if(words.match("company")||words.match("your company")||words.match("avyaan management")||words.match("private limited")){
            speech.text = "In 2022, Avyaan Management started its journey towards service industry exploring into divergent areas where BPO, KPO, RPO is a part as well as becoming a pioneer in the field of Future AI. Over the year, we also expanded into different service zones including AI/ML, Digital marketing, Chatbot. Customer support services (24*7), Technical support services etc.";
        }

        else if(words.match("good morning")||words.match("morning")){
            speech.text = "A very Good morning to you!";
        
        }
        else if(words.match("good afternoon")||words.match("afternoon")){
           speech.text = "A very Good Afternoon to you!";
        }

        else if(words.match("good evening")||words.match("evening")){
            speech.text = "A very Good Evening to you!";
        }

        else if(words.match("about")||words.match("about abhiyaan")||words.match("about company")){
            // "https://" is important!
            document.innerHTML = "Opening Avyaan Management pvt. ltd. About page";
            window.open("https://www.avyaanmgmt.com/about.html", "_blank");
            }
       
        else if(words.match("aaaaaaaa")){
            speech.text = "hi!, wellcome to avyaan. how may i help you?";
        }
        
        else if(words.match("thankyou")||words.match("thank you")||words.match("by")||words.match("by by")){
            speech.text = "Glad to help you! ";
            console.log("hi");
            $("#chatbox").val("");
        }
       
        else if (words.match("open avyaan")||words.match("open avyaan"))
	    {
		// "https://" is important!
        document.innerHTML = "Opening Avyaan Management Web page";
        speech.text = "Opening Avyaan Management Web page";
		window.open("https://www.avyaanmgmt.com/", "_blank");
	    }
        

	    else if (words.match("open youtube"))
	    {
		// "https://" is important!
		output.innerHTML = "Opening YouTube";
		window.open("https://www.youtube.com", "_blank");
	    }

	    else if (words.match("open onestate"))
	    {
		// "https://" is important!
		output.innerHTML = "Opening Onestate Coding on YouTube";
		window.open("https://www.youtube.com/channel/UCrphqZNc_r-KsOTeTKH5hwA", "_blank");
	    }

	    else if (words.match("open light-lens"))
	    {
		// "https://" is important!
		output.innerHTML = "Opening Light-Lens on Github";
		window.open("https://github.com/Light-Lens", "_blank");
	    }
        
        else{
            speech.text = "Sorry!, i didn't catch you";
        }
       
    };

// button.addEventListener("click",()=>{
//     recognition.start();
// });



