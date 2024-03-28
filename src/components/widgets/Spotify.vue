<template>
  <div class="spotify-widget" ref="spotifyWidget">
    <div class="widget-header">Spotify</div>
    <div class="playlist-container" ref="playlistContainer">
      <iframe
        ref="spotifyEmbed"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
    <div class="error-message" v-if="error">Invalid Spotify link, please try again.</div>
    <div class="widget-footer">
      <input
        type="text"
        v-model="mediaUrl"
        placeholder="Enter Spotify Media URL"
        @keypress.enter.prevent="loadMedia"
      />
      <button @click="loadMedia">Save</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import interact from 'interactjs'

export default {
  setup() {
    const spotifyWidget = ref(null)
    const playlistContainer = ref(null)
    const spotifyEmbed = ref(null)
    const mediaUrl = ref('')
    const error = ref(false)

    const loadSpotifyMedia = (url) => {
      const mediaTypeAndId = extractTypeAndIdFromUrl(url)
      if (mediaTypeAndId) {
        const embedUrl = `https://open.spotify.com/embed/${mediaTypeAndId.type}/${mediaTypeAndId.id}?utm_source=generator`
        spotifyEmbed.value.src = embedUrl
        error.value = false
      } else {
        error.value = true
        console.log('Invalid Spotify URL')
      }
      mediaUrl.value = ''
    }

    const extractTypeAndIdFromUrl = (url) => {
      const match = url.match(
        /(?:playlist|track|album|episode|show)\/([a-zA-Z0-9]+)(?:\?si=([a-zA-Z0-9]+))?/
      )
      if (match && match.length > 1) {
        return { type: match[0].split('/')[0], id: match[1] }
      }
      return null
    }

    const loadDefaultPlaylist = () => {
      const defaultPlaylistUrl =
        'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM?si=b5a59d64ba224b71'
      loadSpotifyMedia(defaultPlaylistUrl)
    }

    const loadMedia = () => {
      loadSpotifyMedia(mediaUrl.value)
    }

    const dragElement = (elmnt) => {
      let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0

      if (elmnt) {
        const header = elmnt.querySelector('.widget-header')
        if (header) {
          header.onmousedown = dragMouseDown
        } else {
          elmnt.onmousedown = dragMouseDown
        }
      }

      function dragMouseDown(e) {
        e = e || window.event
        e.preventDefault()
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        document.onmousemove = elementDrag
      }

      function elementDrag(e) {
        e = e || window.event
        e.preventDefault()
        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        const xMax = window.innerWidth - elmnt.offsetWidth
        const yMax = window.innerHeight - elmnt.offsetHeight

        let newPosLeft = elmnt.offsetLeft - pos1
        let newPosTop = elmnt.offsetTop - pos2

        if (newPosLeft >= 0 && newPosLeft <= xMax) {
          pos3 = e.clientX
        } else {
          newPosLeft = elmnt.offsetLeft
        }

        if (newPosTop >= 0 && newPosTop <= yMax) {
          pos4 = e.clientY
        } else {
          newPosTop = elmnt.offsetTop
        }

        elmnt.style.left = newPosLeft + 'px'
        elmnt.style.top = newPosTop + 'px'
      }

      function closeDragElement() {
        document.onmouseup = null
        document.onmousemove = null
      }
    }

    onMounted(() => {
      loadDefaultPlaylist()
      dragElement(spotifyWidget.value)

      // Initialize resizable interaction correctly
      interact(spotifyWidget.value).resizable({
        edges: { left: false, right: true, bottom: true, top: false },
        modifiers: [
          // Restrict minimum size
          interact.modifiers.restrictSize({
            min: { width: 360, height: 230 }
          })
        ],
        listeners: {
          move(event) {
            let { width, height } = event.rect
            // Adjust the spotify-widget dimensions
            spotifyWidget.value.style.width = `${width}px`
            spotifyWidget.value.style.height = `${height}px`

            // Adjust the playlist-container dimensions minus any non-iframe height like header/footer
            const adjustedHeight = height - 140

            playlistContainer.value.style.height = `${adjustedHeight}px`
            spotifyEmbed.value.style.height = `${adjustedHeight}px`
          }
        }
      })
    })

    return { spotifyWidget, playlistContainer, spotifyEmbed, mediaUrl, error, loadMedia }
  }
}
</script>

<style scoped>
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  font-family: 'Outfit', sans-serif;
  padding: 20px;
  overflow: auto;
}

.spotify-widget {
  position: absolute;
  z-index: 9;
  background: #222;
  color: #fff;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 15px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.widget-header {
  text-align: left;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
  cursor: grab;
  z-index: 10;
}

.spotify-widget input[type='text'] {
  width: calc(100% - 90px);
  /* Adjusted width */
  padding: 10px;
  border-radius: 8px;
  border: none;
  margin-right: 10px; /* Added spacing between input and button */
  color: black;
}

.widget-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.widget-footer button {
  padding: 10px 20px;
  background-color: green;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
  /* Prevent button from shrinking */
}

.widget-footer button:hover {
  background-color: #0a5;
}

.widget-footer button:focus {
  outline: none;
}

.playlist-container {
  position: relative;
  flex-grow: 10;
  min-height: 80px;
}

iframe {
  width: 100%;
  height: 80px;
  border: none;
}

.error-message {
  color: red;
  margin-top: 15px;
  /* display: none; */
}
</style>
