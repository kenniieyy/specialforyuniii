// Global variables
let isCountdownFinished = false
let isPlaying = false
let backgroundMusic = null
let selectedPhoto = 1
const totalPhotos = 12

// Target date: 22 Juni 2025, 00:00 WIB (UTC+7) - tanggal ulang tahun yang sebenarnya
const targetDate = new Date("2025-06-22T00:00:00+07:00")

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Create floating particles
  createFloatingParticles()

  // Initialize background music
  backgroundMusic = document.getElementById("background-music")
  if (backgroundMusic) {
    backgroundMusic.volume = 0.3
  }

  // Start countdown
  startCountdown()

  // Setup event listeners
  setupEventListeners()

  // Check if countdown is already finished
  checkCountdownStatus()

  // Preload some photos for better gallery experience
  preloadPhotos()
}

function createFloatingParticles() {
  const container = document.querySelector(".background-elements")
  if (!container) return

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div")
    particle.className = "floating-particle"
    particle.style.left = Math.random() * 100 + "%"
    particle.style.top = Math.random() * 100 + "%"
    particle.style.animationDelay = Math.random() * 3 + "s"
    particle.style.animationDuration = 2 + Math.random() * 3 + "s"
    container.appendChild(particle)
  }
}

function preloadPhotos() {
  // Preload all photos for better gallery experience
  const imageFormats = ["jpg", "jpeg", "png", "JPG", "JPEG", "PNG"]

  for (let i = 1; i <= totalPhotos; i++) {
    let formatIndex = 0

    function tryLoadImage() {
      if (formatIndex >= imageFormats.length) return

      const img = new Image()
      const format = imageFormats[formatIndex]
      img.src = `photo/foto${i}.${format}`

      img.onload = () => {
        console.log(`Successfully preloaded foto${i}.${format}`)
      }

      img.onerror = () => {
        formatIndex++
        tryLoadImage()
      }
    }

    tryLoadImage()
  }
}

function startCountdown() {
  updateCountdown() // Initial update
  setInterval(updateCountdown, 1000)
}

function updateCountdown() {
  const now = new Date().getTime()
  const distance = targetDate.getTime() - now

  // Jika sudah lewat, hitung berapa lama sudah lewat
  if (distance < 0) {
    const pastTime = Math.abs(distance)
    const days = Math.floor(pastTime / (1000 * 60 * 60 * 24))
    const hours = Math.floor((pastTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((pastTime % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((pastTime % (1000 * 60)) / 1000)

    const daysEl = document.getElementById("days")
    const hoursEl = document.getElementById("hours")
    const minutesEl = document.getElementById("minutes")
    const secondsEl = document.getElementById("seconds")

    if (daysEl) daysEl.textContent = days.toString().padStart(2, "0")
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, "0")
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, "0")
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, "0")

    // Give users time to see the late countdown - wait 30 seconds after page load
    if (!window.countdownStartTime) {
      window.countdownStartTime = Date.now()
    }

    const timeOnPage = Date.now() - window.countdownStartTime
    if (timeOnPage > 5000 && !isCountdownFinished) {
      // 5 seconds
      isCountdownFinished = true
      showBirthdayPage()
    }
    return
  }

  // Countdown normal jika belum lewat
  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  const daysEl = document.getElementById("days")
  const hoursEl = document.getElementById("hours")
  const minutesEl = document.getElementById("minutes")
  const secondsEl = document.getElementById("seconds")

  if (daysEl) daysEl.textContent = days.toString().padStart(2, "0")
  if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, "0")
  if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, "0")
  if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, "0")
}

function checkCountdownStatus() {
  // Remove the immediate switch logic - let countdown page always show first
  // const now = new Date().getTime()
  // const distance = targetDate.getTime() - now
  // if (distance < -10000) {
  //   isCountdownFinished = true
  //   showBirthdayPage()
  // }
}

function showBirthdayPage() {
  const countdownPage = document.getElementById("countdown-page")
  const birthdayPage = document.getElementById("birthday-page")

  if (countdownPage) countdownPage.style.display = "none"
  if (birthdayPage) birthdayPage.style.display = "block"
}

function setupEventListeners() {
  // Music button
  const musicBtn = document.getElementById("music-btn")
  if (musicBtn) {
    musicBtn.addEventListener("click", toggleMusic)
  }

  // Modal close buttons
  const closeModal = document.getElementById("close-modal")
  const closePhoto = document.getElementById("close-photo")

  if (closeModal) closeModal.addEventListener("click", closeModalHandler)
  if (closePhoto) closePhoto.addEventListener("click", closePhotoModal)

  // Photo navigation
  const prevPhoto = document.getElementById("prev-photo")
  const nextPhoto = document.getElementById("next-photo")

  if (prevPhoto) prevPhoto.addEventListener("click", () => navigatePhoto("prev"))
  if (nextPhoto) nextPhoto.addEventListener("click", () => navigatePhoto("next"))

  // Close modals when clicking outside
  const modal = document.getElementById("modal")
  const photoModal = document.getElementById("photo-modal")

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === this) closeModalHandler()
    })
  }

  if (photoModal) {
    photoModal.addEventListener("click", function (e) {
      if (e.target === this) closePhotoModal()
    })
  }
}

function toggleMusic() {
  if (!backgroundMusic) return

  const playIcon = document.getElementById("play-icon")
  const pauseIcon = document.getElementById("pause-icon")
  const musicText = document.querySelector(".music-text")

  if (isPlaying) {
    backgroundMusic.pause()
    if (playIcon) playIcon.style.display = "block"
    if (pauseIcon) pauseIcon.style.display = "none"
    if (musicText) musicText.textContent = "Play"
    isPlaying = false
  } else {
    backgroundMusic.play().catch((error) => {
      console.log("Audio play failed:", error)
    })
    if (playIcon) playIcon.style.display = "none"
    if (pauseIcon) pauseIcon.style.display = "block"
    if (musicText) musicText.textContent = "Pause"
    isPlaying = true
  }
}

function openModal(type) {
  const modal = document.getElementById("modal")
  const modalTitle = document.getElementById("modal-title")
  const modalBody = document.getElementById("modal-body")

  if (!modal || !modalTitle || !modalBody) return

  let title = ""
  let content = ""

  switch (type) {
    case "ucapan":
      title = "Pesan Buat Kamu"
      content = getMessageContent()
      break
    case "galeri":
      title = "Slide Memori"
      content = getGalleryContent()
      break
    case "video":
      title = "Layar Cerita"
      content = getVideoContent()
      break
    case "musik":
      title = "Sound (Ngga) Biasa"
      content = getMusicContent()
      break
  }

  modalTitle.textContent = title
  modalBody.innerHTML = content
  modal.style.display = "flex"

  // Setup photo click events if gallery
  if (type === "galeri") {
    setupPhotoClicks()
  }
}

function closeModalHandler() {
  const modal = document.getElementById("modal")
  if (modal) modal.style.display = "none"
}

function getMessageContent() {
  return `
    <div class="content-section">
      <div class="content-title">
        Barakallah fii umrik, Yuniii 🎉
      </div>
      <div class="content-subtitle">
        Harapan baik yang datang di hari bahagiamu
      </div>
      <div class="message-content">
        <p>Selamat memasuki angka yang lebih tinggi dari sebelumnya, yun. Berkah umurnya, panjang umur, sehat selalu, dimudahkan rezekinya, jadi anak yang selalu berbakti sama orang tua.</p>
        
        <p>Semoga cita-cita yuni segera tercapai, skripsinya lancar, bisa lulus cepat dengan hasil yang memuaskan, dan langsung dapat kerja yang yuni impikan.</p>
        
        <p>Aaaa ternyata kita udah di fase umur 21 tahun 🥹🎂. Kenal yuni dari tahun 2019, rasanya waktu cepet banget berlalu. Mari berteman sampai tua 👭 sampai anak-anak kita kenal satu sama lain, biar mereka tahu sahabat sejati itu beneran ada.</p>
        
        <p>Mari tetap bersama seperti tahun-tahun sebelumnya, mari tetap bersama meskipun sedang berjalan di kehidupan masing-masing, mari untuk selalu menyayangi dan mendukung dalam segala hal baik.</p>
        
        <p>Teruslah tumbuh jadi versi terbaik dari dirimu 🌱</p>
        
        <p class="highlight-text">
          I wish I can tell u how much I love you. We're not just a bestfriend, WE'RE SISTER.🫶
        </p>
      </div>
    </div>
  `
}

function getGalleryContent() {
  return `
    <div class="content-section">
      <div class="content-title">
        Galeri Bersama Yuni 
      </div>
      <div class="content-subtitle">
        Momen-momen indah yang terabadikan
      </div>
      
      <div class="photo-grid">
        ${Array.from({ length: totalPhotos }, (_, i) => i + 1)
          .map(
            (i) => `
            <div class="photo-item" onclick="openPhotoModal(${i})" data-photo="${i}">
              <img src="photo/foto${i}.jpg" alt="Foto ${i}" loading="eager" onerror="handleImageError(this, ${i})" onload="handleImageLoad(this)">
            </div>
          `,
          )
          .join("")}
      </div>
    </div>
  `
}

function handleImageLoad(img) {
  // Remove the camera icon when image loads successfully
  const photoItem = img.parentElement
  if (photoItem) {
    photoItem.style.setProperty("--image-loaded", "1")
  }
}

function handleImageError(img, photoNumber) {
  console.log(`Trying to load foto${photoNumber}...`)

  if (img.src.includes(".jpg")) {
    img.src = `photo/foto${photoNumber}.jpeg`
  } else if (img.src.includes(".jpeg")) {
    img.src = `photo/foto${photoNumber}.png`
  } else if (img.src.includes(".png")) {
    img.src = `photo/foto${photoNumber}.JPG`
  } else if (img.src.includes(".JPG")) {
    img.src = `photo/foto${photoNumber}.JPEG`
  } else if (img.src.includes(".JPEG")) {
    img.src = `photo/foto${photoNumber}.PNG`
  } else {
    // If all formats fail, show placeholder
    img.src = `https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop`
    img.alt = `Foto ${photoNumber} (placeholder)`
  }
}

function getVideoContent() {
  return `
    <div class="content-section">
      <div class="content-title">
        Layar Cerita Kita
      </div>
      <div class="content-subtitle">
        Kumpulan foto yang dirangkai jadi satu video sederhana
      </div>
      
      <div class="video-container">
        <video controls poster="photo/foto1.jpg" preload="metadata" style="width: 100%; height: auto;">
          <source src="video/video1.mp4" type="video/mp4">
          <source src="video/video1.webm" type="video/webm">
          <source src="video/video1.mov" type="video/quicktime">
          Browser Anda tidak mendukung video HTML5.
        </video>
        <div class="video-info">
          <h4>Kenangan Dalam Gambar</h4>
          <p>Beberapa foto, satu video, buat nginget momen-momen yang pernah ada.</p>
        </div>
      </div>
    </div>
  `
}

function getMusicContent() {
  const songs = [
    { title: "Sahabat Tak Akan Pergi", artist: "Betrand Putra Onsu, Anneth Deliecia", file: "song1" },
    { title: "Teman Sejati", artist: "Hivi", file: "song2" },
    { title: "Satu Frekuensi", artist: "Suara Kayu", file: "song3" },
    { title: "Tujuh Belas", artist: "Tulus", file: "song4" },
  ]

  return `
    <div class="content-section">
      <div class="content-title">
        Cuplikan Sound Spesial Buat Yuni 
      </div>
      <div class="content-subtitle">
        Potongan suara penuh makna
      </div>
      
      <div class="music-list">
        ${songs
          .map(
            (song) => `
            <div class="music-item">
              <div class="music-header">
                <div class="music-icon-bg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18V5l12-2v13"/>
                    <circle cx="6" cy="18" r="3"/>
                    <circle cx="18" cy="16" r="3"/>
                  </svg>
                </div>
                <div class="music-info">
                  <h4>${song.title}</h4>
                  <p>${song.artist}</p>
                </div>
              </div>
              <div class="music-player">
                <audio controls preload="metadata" style="width: 100%; height: 28px; border-radius: 8px; filter: sepia(20%) saturate(70%) hue-rotate(180deg);">
                  <source src="music/${song.file}.mp3" type="audio/mpeg">
                  <source src="music/${song.file}.mp4" type="audio/mp4">
                  <source src="music/${song.file}.mpeg" type="audio/mpeg">
                  <source src="music/${song.file}.ogg" type="audio/ogg">
                  Browser Anda tidak mendukung audio HTML5.
                </audio>
              </div>
            </div>
          `,
          )
          .join("")}
      </div>
    </div>
  `
}

function setupPhotoClicks() {
  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    const photoItems = document.querySelectorAll(".photo-item")
    photoItems.forEach((item, index) => {
      item.onclick = () => openPhotoModal(index + 1)

      // Force reload images that might not have loaded
      const img = item.querySelector("img")
      if (img && img.src.includes("placeholder")) {
        handleImageError(img, index + 1)
      }
    })
  }, 100)
}

function openPhotoModal(photoNumber) {
  selectedPhoto = photoNumber
  const photoModal = document.getElementById("photo-modal")
  const modalPhoto = document.getElementById("modal-photo")
  const photoTitle = document.getElementById("photo-title")
  const photoCounter = document.getElementById("photo-counter")

  if (!photoModal || !modalPhoto || !photoTitle || !photoCounter) return

  modalPhoto.src = `photo/foto${photoNumber}.jpg`
  modalPhoto.onerror = function () {
    handleImageError(this, photoNumber)
  }

  photoTitle.textContent = `Foto Kenangan ${photoNumber}`
  photoCounter.textContent = `${photoNumber} dari ${totalPhotos} foto`

  photoModal.style.display = "flex"
  closeModalHandler() // Close the main modal
}

function closePhotoModal() {
  const photoModal = document.getElementById("photo-modal")
  if (photoModal) photoModal.style.display = "none"
}

function navigatePhoto(direction) {
  if (direction === "prev") {
    selectedPhoto = selectedPhoto > 1 ? selectedPhoto - 1 : totalPhotos
  } else {
    selectedPhoto = selectedPhoto < totalPhotos ? selectedPhoto + 1 : 1
  }

  const modalPhoto = document.getElementById("modal-photo")
  const photoTitle = document.getElementById("photo-title")
  const photoCounter = document.getElementById("photo-counter")

  if (!modalPhoto || !photoTitle || !photoCounter) return

  modalPhoto.src = `photo/foto${selectedPhoto}.jpg`
  modalPhoto.onerror = function () {
    handleImageError(this, selectedPhoto)
  }

  photoTitle.textContent = `Foto Kenangan ${selectedPhoto}`
  photoCounter.textContent = `${selectedPhoto} dari ${totalPhotos} foto`
}

// Keyboard navigation for photo modal
document.addEventListener("keydown", (e) => {
  const photoModal = document.getElementById("photo-modal")
  if (photoModal && photoModal.style.display === "flex") {
    if (e.key === "ArrowLeft") {
      navigatePhoto("prev")
    } else if (e.key === "ArrowRight") {
      navigatePhoto("next")
    } else if (e.key === "Escape") {
      closePhotoModal()
    }
  }

  const modal = document.getElementById("modal")
  if (modal && modal.style.display === "flex" && e.key === "Escape") {
    closeModalHandler()
  }
})

// Touch/swipe support for mobile photo navigation
let touchStartX = 0
let touchEndX = 0

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX
})

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
})

function handleSwipe() {
  const photoModal = document.getElementById("photo-modal")
  if (photoModal && photoModal.style.display === "flex") {
    const swipeThreshold = 50
    const swipeDistance = touchEndX - touchStartX

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        navigatePhoto("prev")
      } else {
        navigatePhoto("next")
      }
    }
  }
}