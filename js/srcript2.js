let currentSong = new Audio();
let albums = {};
let currentFolder = '';
let trackList = [];
let currentTrackIndex = 0;

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

async function displayAlbums() {
  const res = await fetch('songs/albums.json');
  albums = await res.json();
  const container = document.querySelector('.cardContainer');

  container.innerHTML = '';
  Object.entries(albums).forEach(([folder, data]) => {
    container.innerHTML += `
      <div data-folder="${folder}" class="card">
        <div class="play">▶</div>
        <img src="${data.cover}" alt="${folder}">
        <h2>${data.title}</h2>
        <p>${data.description}</p>
      </div>`;
  });

  document.querySelectorAll('.card').forEach(card =>
    card.addEventListener('click', () => loadAlbum(card.dataset.folder))
  );
}

function renderTrackList() {
  const ul = document.querySelector('.songlist ul');
  ul.innerHTML = '';
  trackList.forEach((file, idx) => {
    ul.innerHTML += `
      <li data-idx="${idx}">
        <img class="invert" src="img/music.svg" alt="">
        <div class="info">
          <div>${decodeURIComponent(file)}</div>
          <div>Artist Name</div>
        </div>
        <div class="playnow">
          <span>Play now</span>
          <img class="invert" src="img/play.svg" alt="">
        </div>
      </li>`;
  });
  ul.querySelectorAll('li').forEach(li =>
    li.addEventListener('click', () => playTrack(Number(li.dataset.idx)))
  );
}

function playTrack(idx, pause = false) {
  currentTrackIndex = idx;
  const file = trackList[idx];
  currentSong.src = `songs/${currentFolder}/${file}`;
  if (!pause) currentSong.play();
  document.querySelector('.songinfo').textContent = file.replaceAll("%20", " ");
  updatePlayPauseButton();
}

async function loadAlbum(folder) {
  currentFolder = folder;
  trackList = albums[folder].tracks;
  renderTrackList();
  playTrack(0, false); // Play first song immediately
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
  await displayAlbums();

  document.getElementById('play').addEventListener('click', () => {
    if (currentSong.paused) {
      currentSong.play();
    } else {
      currentSong.pause();
    }
    updatePlayPauseButton();
  });

  currentSong.addEventListener('timeupdate', () => {
    document.querySelector('.songtime').textContent =
      `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration || 0)}`;
    document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
  });

  currentSong.addEventListener('play', updatePlayPauseButton);
  currentSong.addEventListener('pause', updatePlayPauseButton);

  document.querySelector('.seekbar').addEventListener('click', e => {
    const pct = e.offsetX / e.currentTarget.clientWidth;
    currentSong.currentTime = currentSong.duration * pct;
  });

  document.getElementById('previous').addEventListener('click', () => {
    if (currentTrackIndex > 0) {
      playTrack(currentTrackIndex - 1);
    }
  });

  document.getElementById('next').addEventListener('click', () => {
    if (currentTrackIndex < trackList.length - 1) {
      playTrack(currentTrackIndex + 1);
    }
  });

  document.querySelector('.range input').addEventListener('input', e => {
    currentSong.volume = e.target.value / 100;
    updateVolumeIcon();
  });

  document.querySelector('.volume img').addEventListener('click', () => {
    toggleMute();
  });
});

function updatePlayPauseButton() {
  const playButton = document.getElementById('play');
  if (currentSong.paused) {
    playButton.src = 'img/play.svg';
  } else {
    playButton.src = 'img/pause.svg';
  }
}

function updateVolumeIcon() {
  const volumeIcon = document.querySelector('.volume img');
  if (currentSong.volume > 0) {
    volumeIcon.src = 'img/volume.svg';
  } else {
    volumeIcon.src = 'img/mute.svg';
  }
}

function toggleMute() {
  if (currentSong.volume > 0) {
    currentSong.volume = 0;
  } else {
    currentSong.volume = 0.7; // You can set this to any default volume level
  }
  document.querySelector('.range input').value = currentSong.volume * 100;
  updateVolumeIcon();
}

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const closeBtn = document.querySelector('.close');
  const leftMenu = document.querySelector('.left');

  // Open menu
  hamburger.addEventListener('click', () => {
    leftMenu.classList.add('open');
  });

  // Close menu
  closeBtn.addEventListener('click', () => {
    leftMenu.classList.remove('open');
  });
});

