const beatSong = document.getElementById('beat-song');
const playBtn = document.querySelector(".play");
const durationTime = document.querySelector(".duration");
const remainingTime = document.querySelector(".remaining");
const progress = document.querySelector(".progress");
var pLyricsBefore = document.getElementById("render-lyrics-before");
var pLyricsAfter = document.getElementById("render-lyrics-after");

var lyricsBeat = [];
let isPlaying = true;
setInterval(renderLyrics, 1);
setInterval(paintLyric, 1);


playBtn.addEventListener("click", playPause);
function playPause(){
    if(isPlaying){
        playBtn.innerHTML = `<i class="fa-sharp fa-regular fa-circle-pause"></i>`
        beatSong.play();
        setInterval(timePlay, 500);
        isPlaying = false;
        
    } else{
        beatSong.pause();
        playBtn.innerHTML = `<i class="fa-sharp fa-regular fa-circle-play"></i>`
        isPlaying= true;
        clearInterval(timePlay, 500);
        clearInterval(renderLyrics, 1);
    }
}
function timePlay(){
    const {duration, currentTime} = beatSong;
    progress.max = duration;
    progress.value = currentTime; 

    remainingTime.textContent = formatDuration(currentTime);
    if(!durationTime){
        durationTime.textContent = "00:00";
    }else{
        durationTime.textContent = formatDuration(duration);
    }
}
timePlay();
setInterval(timePlay, 500);
function formatDuration(number){
    const minutes = Math.floor(number/ 60);
    const secords= Math.floor(number - minutes * 60);
    return `${minutes < 10 ? "0" + minutes : minutes} : ${ secords < 10 ? "0" + secords : secords} `;
    // return `${minutes}: ${secords}`
}


progress.addEventListener("change", handleRange);
function handleRange(){
    beatSong.currentTime = progress.value;
    let check = false;
    for (let i = 0; i < lyricsBeat.length; i++) {
        let numFirst = Number(lyricsBeat[i].paramTime);
        let numSecond = 0;
        if (lyricsBeat[i + 1] != undefined) {
            // debugger
            numSecond = Number(lyricsBeat[i + 1].paramTime);
            if ( Number(beatSong.currentTime.toFixed(2)) > Number(numFirst.toFixed(2)) &&Number(numSecond.toFixed(2))> Number(beatSong.currentTime.toFixed(2)) && check == false) {
                render(i);
                check = true;
            } else if (Number(beatSong.currentTime.toFixed(2)) < Number(numFirst.toFixed(2)) && check == false) {
                pLyricsBefore.innerHTML = (`<p id='render-lyrics-before'>Nhạc dạo</p>`);
                pLyricsAfter.innerHTML = (`<p id='render-lyrics-after'>....</p>`);
                check = true;
            }
        }
    }
    
}


fetch("lyrics.xml").then((response)=>{
response.text().then((xml)=>{
    let parse = new DOMParser();
    let xmlDOM = parse.parseFromString(xml, "application/xml");
    let lyrics = xmlDOM.querySelectorAll("data");
    console.log(lyrics);

    lyrics.forEach(lyricXmlNode => {
        for(let i = 0; i<lyricXmlNode.children.length; i++){
            let sizeLyricParam = lyricXmlNode.children[i].getElementsByTagName('i').length;
            let lyricsChart = [];
            for(let j = 0 ; j < sizeLyricParam; j++){
                let wordLyric = {
                    timeWord : lyricXmlNode.children[i].getElementsByTagName('i')[j].getAttribute('va'),
                    wordLyric : lyricXmlNode.children[i].getElementsByTagName('i')[j].textContent
                }
                lyricsChart.push(wordLyric);
            }
             let paramLyric = {
                paramTime: lyricXmlNode.children[i].getElementsByTagName('i')[0].getAttribute('va'),
                paramLyrics: lyricsChart
             }
            lyricsBeat.push(paramLyric);
        }
    });

})
})

 console.log("beat lyricS : ", lyricsBeat);

 function renderLyrics(){
    console.log("vao ham roi")
    for (let i = 0; i < lyricsBeat.length; i++) {
        let numTimeParam = Number(lyricsBeat[i].paramTime);
        if (Number(beatSong.currentTime.toFixed(2)) == Number(numTimeParam.toFixed(2))) {
            render(i)
        }
    }
 }
 function render(i){
    console.log("vao ham render")
    let paramWordsFirst = "";
    let paramWordsSecond = "";
    let countWord = 0;
    for (let j = 0; j < lyricsBeat[i].paramLyrics.length; j++) {
        // debugger
        let charTime = Number(lyricsBeat[i].paramLyrics[j].timeWord);
        let firstTime = 0;
        let secondTime = Number(lyricsBeat[i].paramLyrics[j].timeWord);
        let spaceTime = 0;
         
        if(!lyricsBeat[i].paramLyrics[j+1]){
            for (let k = 0; k < lyricsBeat[i].paramLyrics[j].wordLyric.length; k++) {
               
                if (lyricsBeat[i + 1] != undefined){
                    firstTime = Number(lyricsBeat[i + 1].paramLyrics[0].timeWord);

                    spaceTime = (firstTime - secondTime)/(Number(lyricsBeat[i].paramLyrics[j].wordLyric.length)+1);
                } else {
                    firstTime = beatSong.duration - Number(lyricsBeat[i].paramLyrics[j].timeWord);

                    spaceTime = (firstTime - secondTime)/(Number(lyricsBeat[i].paramLyrics[j].wordLyric.length)+1);
                }

                charTime += spaceTime;
                if(lyricsBeat[i].paramLyrics[j].wordLyric[k] != "") {
                    if(Number(charTime.toFixed(2)) < Number(beatSong.currentTime.toFixed(2))){
                        paramWordsFirst += `<span class="paint" style="left:-${countWord}px; position: relative;" id="${charTime.toFixed(2)}">${lyricsBeat[i].paramLyrics[j].wordLyric[k]}</span> `;
                        countWord += 4;
                    }
                    else{
                    paramWordsFirst += `<span  style="left:-${countWord}px; position: relative;" id="${charTime.toFixed(2)}">${lyricsBeat[i].paramLyrics[j].wordLyric[k]}</span> `;
                    countWord += 4;
                    }
                    // paramWordsFirst += `<span style="left:-${countWord}px; position: relative;" id="${charTime.toFixed(2)}">${lyricsBeat[i].paramLyrics[j].wordLyric[k]}</span> `;
                    // countWord += 4;
                } 
            }
        } else{
            for (let k = 0; k < lyricsBeat[i].paramLyrics[j].wordLyric.length; k++) {
                firstTime = Number(lyricsBeat[i].paramLyrics[j + 1].timeWord);
                spaceTime = (firstTime - secondTime)/(Number(lyricsBeat[i].paramLyrics[j].wordLyric.length) + 1);
                charTime += spaceTime;

                if (!lyricsBeat[i].paramLyrics[j].wordLyric[k] == "") {
                    if(Number(charTime.toFixed(2)) < Number(beatSong.currentTime.toFixed(2))){
                        paramWordsFirst += `<span class="paint" style="left:-${countWord}px; position: relative;" id="${charTime.toFixed(2)}">${lyricsBeat[i].paramLyrics[j].wordLyric[k]}</span> `;
                        countWord += 4;
                    }
                    else{
                    paramWordsFirst += `<span id="${charTime.toFixed(2)}"  style="left:-${countWord}px; position: relative;" >${lyricsBeat[i].paramLyrics[j].wordLyric[k]}</span> `;
                    countWord += 4;
                    }
                    // paramWordsFirst += `<span id="${charTime.toFixed(2)}" style="left:-${countWord}px; position: relative;">${lyricsBeat[i].paramLyrics[j].wordLyric[k]}</span> `;
                    // countWord += 4;
                } 
            }
        }
        countWord -= 7.5;
    }
    
    if (lyricsBeat[i + 1] != undefined) {
        for (let j = 0; j < lyricsBeat[i + 1].paramLyrics.length; j++) {
            paramWordsSecond += lyricsBeat[i + 1].paramLyrics[j].wordLyric;
        }
    }
    
    pLyricsBefore.innerHTML = (`<p id='render-lyrics-before' >${paramWordsFirst}</p>`);
    pLyricsAfter.innerHTML = (`<p id='render-lyrics-after'>${paramWordsSecond}</p>`);
 }

 beatSong.addEventListener("ended", handleEndBeatSong);
 function handleEndBeatSong(){
     playBtn.innerHTML =`<i class="fa-sharp fa-regular fa-circle-play"></i>`}
 
 function paintLyric(){
    if(document.getElementById(beatSong.currentTime.toFixed(2))){
        document.getElementById(beatSong.currentTime.toFixed(2)).classList.add("paint");
    }
 }