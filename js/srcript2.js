let currentSong = new Audio();
let albums = {};
let currentFolder = '';
let trackList = [];
let currentTrackIndex = 0;

function formatTime(sec) {
  const minutes = Math.floor(sec / 60).toString().padStart(2, '0');
  const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
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
        <img class="invert" src="img/music.svg" alt="Track">
        <div class="info">
          <div>${decodeURIComponent(file)}</div>
          <div>${albums[currentFolder].title}</div>
        </div>
        <div class="playnow">
          <span>Play now</span>
          <img class="invert" src="img/play.svg" alt="Play">
        </div>
      </li>`;
  });

  ul.querySelectorAll('li').forEach(li =>
    li.addEventListener('click', () => playTrack(Number(li.dataset.idx)))
  );
}

function playTrack(idx) {
  currentTrackIndex = idx;
  const file = trackList[idx];
  currentSong.src = `songs/${currentFolder}/${file}`;
  currentSong.play();
  document.querySelector('.songinfo').textContent = file;
  document.getElementById('play').src = 'img/pause.svg';
}

async function loadAlbum(folder) {
  currentFolder = folder;
  trackList = albums[folder].tracks;
  renderTrackList();
  playTrack(0); // Auto-play first track
}

function togglePlayPause() {
  if (currentSong.paused) {
    currentSong.play();
    document.getElementById('play').src = 'img/pause.svg';
  } else {
    currentSong.pause();
    document.getElementById('play').src = 'img/play.svg';
  }
}

function playNext() {
  currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
  playTrack(currentTrackIndex);
}

function playPrevious() {
  currentTrackIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
  playTrack(currentTrackIndex);
}

// Event listeners
document.getElementById('play').addEventListener('click', togglePlayPause);
document.getElementById('next').addEventListener('click', playNext);
document.getElementById('previous').addEventListener('click', playPrevious);

// Load albums on page load
document.addEventListener('DOMContentLoaded', displayAlbums);
