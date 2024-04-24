<template>
  <PageLayout>
    <div class="flex flex-row justify-between px-8 p-4 h-full w-screen">
      <div class="w-44 flex flex-col gap-4 h-full">
        <!-- Alert -->
        <div class="absolute top-[10rem] right-0 rounded-l-full">
          <div class="flex items-end flex-col gap-4">
            <div
              v-for="(message, index) in successMessages"
              :key="'success-' + index"
              class="success-message flex bg-neutral-800 rounded-l-full py-4 pl-9 pr-8"
            >
              <div class="flex items-center justify-center gap-2">
                <img src="/icons/square-check-solid.svg" alt="" class="w-4 h-4" />
                <p class="text-white font-semibold">
                  {{ message }}
                </p>
              </div>
            </div>
            <div
              v-for="(message, index) in failureMessages"
              :key="'failure-' + index"
              class="failure-message flex bg-neutral-800 rounded-l-full py-4 pl-9 pr-8"
            >
              <div class="flex items-center justify-center gap-2">
                <img src="/icons/square-xmark-solid.svg" alt="" class="w-4 h-4" />
                <p class="text-white font-semibold">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Coin Display -->

        <div
          class="bg-yellow-50 p-3 rounded-xl flex items-center justify-center gap-3 duration-150 hover:scale-105"
        >
          <img src="/icons/coins.svg" alt="" class="h-9 w-9" />
          <p class="text-2xl font-semibold text-tPurple">{{ coins.toFixed(0) }}</p>
        </div>

        <!-- Store Food -->

        <div
          v-if="storeFoodDetail"
          class="bg-white p-4 rounded-lg flex flex-col gap-7 overflow-auto h-fit duration-200 hover:bg-tLightPurple"
        >
          <div v-for="(data, index) in storeFoodDetail" :key="index">
            <button @click="buyFood(data)" class="duration-150 hover:scale-105">
              <div
                class="w-36 h-36 bg-tYellow p-2 flex flex-col items-center justify-center rounded-lg"
              >
                <p>{{ data.Name }}</p>
                <div class="overflow-hidden flex justify-center">
                  <img :src="data.href" alt="" />
                </div>
                <p>{{ data.Price }} Coins</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Pet -->

      <div class="flex flex-col items-center h-full justify-center gap-5 w-full">
        <p class="text-4xl text-white font-semibold duration-150 hover:scale-110">
          {{ petName }}
        </p>
        <div class="w-96 h-96 relative duration-150 hover:scale-105">
          <img
            src="/shop/cloud.png"
            alt=""
            class="h-8 absolute top-12 z-50 left-20 animate-cloud"
          />
          <img
            src="/shop/musicNote1.png"
            alt=""
            class="h-12 absolute top-16 z-50 right-20 music-note"
          />
          <img
            src="/shop/musicNote2.png"
            alt=""
            class="h-12 absolute top-36 z-50 left-12 music-note"
          />
          <img src="/shop/backdrop.png" alt="" class="absolute" />

          <div class="flex h-full w-full justify-between flex-col">
            <div class="h-full z-50 flex items-end justify-center">
              <img :src="petImageLink" alt="" class="z-50 animate-bounce" />
            </div>
            <div class="h-[28%]" />
          </div>
        </div>
        <div class="hover:scale-105 duration-150">
          <Healthbar :futureDate="petHealth" />
        </div>
      </div>

      <!-- Store Equipments -->

      <div class="w-44 flex justify-end">
        <div v-if="subcollectionEquipment" class="w-40 flex flex-col gap-4 overflow-scroll h-full">
          <div v-for="(data, index) in subcollectionEquipment" :key="index">
            <button
              @click="buyEquipment(data)"
              class="hover:scale-105 w-36 h-36 bg-white p-2 flex flex-col items-center justify-center rounded-lg group hover:bg-tLightPurple duration-150 hover:text-white"
            >
              <p>{{ data.Name }}</p>
              <div class="overflow-hidden flex justify-center">
                <img :src="data.href" alt="" />
              </div>
              <p v-if="data.Price != 0">{{ data.Price }} Coins</p>
              <button
                v-if="data.Price == 0"
                class="bg-tYellow rounded-lg w-full text-white fond-semibold group-hover:bg-tPurple duration-150"
              >
                Wear
              </button>
            </button>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script>
import firebaseApp from '../firebase.js'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  collection,
  updateDoc,
  increment,
  setDoc
} from 'firebase/firestore'
import PageLayout from '@/components/PageLayout.vue'
import Healthbar from '@/components/Healthbar.vue'

const db = getFirestore(firebaseApp)

export default {
  name: 'QuackPalPage',

  components: {
    PageLayout,
    Healthbar
  },

  data() {
    return {
      coins: 0,
      petName: null,
      useremail: null,
      petHealth: null,
      storeFoodDetail: null,
      subcollectionEquipment: null,
      petImageName: null,
      petImageLink: null,
      successMessages: [],
      failureMessages: [],
      isHatched: null
    }
  },

  async mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user
        this.useremail = auth.currentUser.email
        await this.fetchFood()
        await this.fetchUserDataAndAccessories(this.useremail)
        await this.fetchHatchedStatus()
      }
    })
  },

  methods: {
    async fetchUserDataAndAccessories(useremail) {
      const docRef = doc(db, 'Users', useremail)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        this.coins = docSnap.data().Coins
        this.petName = docSnap.data().PetName
        this.petHealth = docSnap.data().PetHealth.toDate()
        this.petImageName = docSnap.data().ActivePetAccessory

        const subcollectionRef = collection(docRef, 'Equipment')
        const subcollectionSnapshot = await getDocs(subcollectionRef)
        this.subcollectionEquipment = subcollectionSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter((data) => data.Name != 'Egg')
          .filter((data) => {
            console.log(docSnap.data().ActivePetAccessory)
            if (docSnap.data().ActivePetAccessory == 'Egg') {
              return data.Name != 'Duck'
            } else {
              return true
            }
          })
      }
      const accessoriesDocRef = doc(db, 'Pet Accessories', this.petImageName)
      const accessoriesDocSnap = await getDoc(accessoriesDocRef)
      if (accessoriesDocSnap.exists()) {
        this.petImageLink = accessoriesDocSnap.data().Duck1
      }
    },

    async fetchFood() {
      const querySnapshot = await getDocs(query(collection(db, 'Food')))
      const foodData = querySnapshot.docs.map((doc) => doc.data())
      this.storeFoodDetail = foodData
    },

    async buyEquipment(item) {
      if (!this.isHatched) {
        const docRef1 = doc(db, 'Leaderboard', this.useremail)
        const docSnap1 = await getDoc(docRef1)
        const numHours = docSnap1.data().TotalHours
        const numHoursLeft = 100 - numHours
        this.failureMessages.push(
          `You cannot buy any accessories before ${this.petName} is hatched! ${numHoursLeft} hours left to go!`
        )
      } else if (this.coins < item.Price) {
        this.failureMessages.push(`You dont have enough coins!`)
      } else if (item.Price == 0) {
        const docRef = doc(db, 'Users', this.useremail)
        await updateDoc(docRef, { ActivePetAccessory: item.Name })
        await this.fetchUserDataAndAccessories(this.useremail)
        this.successMessages.push(`You equipped ${item.Name}!`)
      } else {
        const docRef = doc(db, 'Users', this.useremail)
        const equipmentRef = collection(docRef, 'Equipment')
        const querySnapshot = await getDocs(equipmentRef)
        const itemDoc = querySnapshot.docs.find((doc) => doc.data().Name === item.Name)
        await updateDoc(docRef, { Coins: increment(-item.Price) }) // decrease user's coin
        await updateDoc(itemDoc.ref, { Price: 0 }) // set price as 0
        await updateDoc(docRef, { ActivePetAccessory: item.Name })
        await this.fetchUserDataAndAccessories(this.useremail)
        this.successMessages.push(`You bought ${item.Name}!`)
      }
      setTimeout(() => {
        this.clearMessages()
      }, 3000)
    },

    async buyFood(item) {
      if (this.coins < item.Price) {
        this.failureMessages.push(`You dont have enough coins!`)
      } else {
        const docRef = doc(db, 'Users', this.useremail)
        const userData = await getDoc(docRef)

        const currentPetHealth = new Date(userData.data().PetHealth.toDate())
        const newPetHealth = new Date(currentPetHealth)
        newPetHealth.setDate(newPetHealth.getDate() + item.HealthPoints)

        await updateDoc(docRef, { PetHealth: newPetHealth })
        await updateDoc(docRef, { Coins: increment(-item.Price) })

        await this.fetchUserDataAndAccessories(this.useremail)
        this.successMessages.push(`You bought ${item.Name}!`)
      }
      setTimeout(() => {
        this.clearMessages()
      }, 3000)
    },

    clearMessages() {
      if (this.successMessages.length > 0) {
        this.successMessages.shift()
      }
      if (this.failureMessages.length > 0) {
        this.failureMessages.shift()
      }
    },
    async fetchHatchedStatus() {
      const docRef = doc(db, 'Leaderboard', this.useremail)
      const docSnap = await getDoc(docRef)
      const numHours = docSnap.data().TotalHours
      const docRef1 = doc(db, 'Users', this.useremail)
      const docSnap1 = await getDoc(docRef1)
      const currAvatar = docSnap1.data().ActivePetAccessory
      if (numHours < 100) {
        //num hours of study less thqn 100, the egg cannot be hatched
        this.isHatched = false
      } else {
        //num hours greater than 100, the egg must be hatched
        this.isHatched = true
        if (currAvatar == 'Egg') {
          const docRef1 = doc(db, 'Users', this.useremail)
          await updateDoc(docRef1, {
            ActivePetAccessory: 'Duck'
          })
          this.fetchUserDataAndAccessories(this.useremail)
        }
      }
    }
  }
}
</script>

<style scoped>
@keyframes moveCloud {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(2rem);
  }
  100% {
    transform: translateX(0);
  }
}

.animate-cloud {
  animation: moveCloud 5s linear infinite; /* Adjust duration as needed */
}

@keyframes rotateNote {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(20deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.music-note {
  animation: rotateNote 2s ease-in-out infinite alternate;
}

.success-message,
.failure-message {
  z-index: 9999;
}
</style>
