<template>
  <div 
    @mousedown="startDrag"
    @mouseup="endDrag"
    @mousemove="drag"
  >
    <!-- Display DuckUp when dragging -->
    <img 
      v-if="petAccessoryData && duckImage" 
      :src="duckImage" 
      alt="Duck image" 
      style="max-width: 100%; height: auto;" 
      ref="draggableImage"
      class="draggable"
      draggable="false"
    />
  </div>
</template>

<script>
import firebaseApp from '@/firebase.js'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

export default {
  data() {
    return {
      user: false,
      useremail: null,
      userData: null,
      petAccessoryData: null,
      duckImage: null,
      isDragging: false,
      initialMouseOffset: { x: 0, y: 0 },
      initialImageOffset: { x: 0, y: 0 },
      duckImageInterval: null
    }
  },

  async mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user
        this.useremail = user.email
        await this.fetchData(this.useremail)
        if (this.userData && this.userData.ActivePetAccessory) {
          await this.fetchPetAccessoryData(this.userData.ActivePetAccessory)
        }
        this.startDuckImageTimer()
        this.setupPetAccessoryListener(this.userData.ActivePetAccessory)
      }
    })
  },

  methods: {
    async fetchData(useremail) {
      try {
        const docRef = doc(db, 'Users', useremail)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          this.userData = docSnap.data()
          console.log(this.userData)
        } else {
          console.log('User not found')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    },

    async fetchPetAccessoryData(activePetAccessoryId) {
      try {
        const docRef = doc(db, 'Pet Accessories', activePetAccessoryId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          this.petAccessoryData = docSnap.data()
          console.log(this.petAccessoryData)
        } else {
          console.log('Pet accessory not found')
        }
      } catch (error) {
        console.error('Error fetching pet accessory:', error)
      }
    },
    
    setupPetAccessoryListener(activePetAccessoryId) {
      const docRef = doc(db, 'Pet Accessories', activePetAccessoryId)
      onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          this.petAccessoryData = doc.data()
        }
      })
    },
    
    startDuckImageTimer() {
      let isDuck1 = true
      this.duckImageInterval = setInterval(() => {
        if (this.petAccessoryData && this.petAccessoryData.Duck1 && this.petAccessoryData.Duck2) {
          this.duckImage = isDuck1 ? this.petAccessoryData.Duck1 : this.petAccessoryData.Duck2
          isDuck1 = !isDuck1
        }
      }, 500) // Switching interval between duck1 and 2 is 0.5 seconds (stopmotion animation)
    },

    startDrag(event) {
      this.isDragging = true
      this.initialMouseOffset = {
        x: event.clientX,
        y: event.clientY
      }
      this.initialImageOffset = {
        x: this.$refs.draggableImage.offsetLeft,
        y: this.$refs.draggableImage.offsetTop
      }
      clearInterval(this.duckImageInterval)
      this.duckImage = this.petAccessoryData?.DuckUp // Change image to DuckUp
    },

    endDrag() {
      this.isDragging = false;
      const bottomOffset = window.innerHeight - this.$refs.draggableImage.offsetHeight;
      const currentOffsetTop = this.$refs.draggableImage.offsetTop;
      const distance = bottomOffset - currentOffsetTop;
      const duration = 1000; // Duration in milliseconds
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          const newY = currentOffsetTop + progress * distance;
          this.$refs.draggableImage.style.top = `${newY}px`;
          requestAnimationFrame(animate);
        } else {
          this.$refs.draggableImage.style.top = `${bottomOffset}px`;
        }
      };

      requestAnimationFrame(animate);

      // Resume animation
      this.startDuckImageTimer()
    },
    

    drag(event) {
      if (this.isDragging) {
        const dx = event.clientX - this.initialMouseOffset.x
        const dy = event.clientY - this.initialMouseOffset.y
        this.$refs.draggableImage.style.left = `${this.initialImageOffset.x + dx}px`
        this.$refs.draggableImage.style.top = `${this.initialImageOffset.y + dy}px`

        // Dynamic image change based on cursor movement direction
        const deltaX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        if (deltaX > 0) {
          this.duckImage = this.petAccessoryData.DuckRight;
        } else if (deltaX < 0) {
          this.duckImage = this.petAccessoryData.DuckLeft;
        } else {
          this.duckImage = this.petAccessoryData.DuckUp;
        }
      }
    }
  }
}
</script>

<style scoped>
.draggable {
  position: absolute;
  cursor: grab;
  clip-path: polygon(35% 10%, 65% 10%, 65% 100%, 35% 100%);
  z-index: 9; 
}
</style>
