
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
    currFolder = folder;
    // Fetch Data from URL: await pauses execution until the fetch promise resolves.
    const a = await fetch(`http://192.168.18.134:3000/${folder}/`)
    // Converts the HTTP response into a text format using .text().
    const response = await a.text()
    console.log(response);

    let div = document.createElement('div')
    div.innerHTML = response;

    let as = div.getElementsByTagName('a')

    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    return songs;

}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src =`/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}



async function main() {
    // get the list of all the song 
    songs = await getSongs("songs/ncs");
    playMusic(songs[0], true)
    // show all the songs in the playlist
    let songUL = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li>
        
          <img class="invert" src="music.svg" alt="">
                         <div class="info">
                            <div>   ${song.replaceAll("%20", " ")}</div>
                            <div> Asim</div>
                        </div>
                        <div class="playnow">
                               <span>Play now</span>
                               <img class="invert" src="play.svg" alt="">
                         </div></li>`;

    }
    // attach an eevent listner to each song 
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })


    // Attach an Event listner to each play previous next button 
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "play.svg"
        }
    })

    // addEventListener for time update
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/
        ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    //  addEventListener for the seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // add addEventListener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add addEventListener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Add  addEventListener for the Prevoius and Next button
    previous.addEventListener("click", () => {
        console.log("Previous Clicked");
        console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index -1) > 0) {
            playMusic(songs[index - 1]);
        }

    })

    next.addEventListener("click", () => {
        currentSong.pause();
        console.log("next clicked ");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if((index+1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    })

    // add Ebenetlistner for the volume\
    document.querySelector(".range").addEventListener("change" ,(e)=>{
        console.log("setting volume to ",e.target.value  ,"/100");
        currentSong.volume= parseInt(e.target.value)/100;
        
    })


}

main()



