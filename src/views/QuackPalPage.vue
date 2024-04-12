<template>
  <PageLayout>
    <div class="flex flex-row justify-between px-8 p-4 h-full w-screen">
      <div class="w-44 flex flex-col gap-4 h-full">
        <div class="bg-[#FEF8EB] p-3 rounded-xl flex items-center justify-center gap-3">
          <img src="/icons/coins.svg" alt="" class="h-9 w-9" />
          <p class="text-2xl font-semibold text-tPurple">{{ coins.toFixed(0) }}</p>
        </div>
        <div
          v-if="storeFoodDetail"
          class="bg-white p-4 rounded-lg flex flex-col gap-7 overflow-auto h-fit"
        >
          <div v-for="(data, index) in storeFoodDetail" :key="index">
            <div
              class="w-36 h-36 bg-tYellow p-2 flex flex-col items-center justify-center rounded-lg"
            >
              <p>{{ data.Name }}</p>
              <div class="overflow-hidden flex justify-center">
                <img :src="data.href" alt="" />
              </div>
              <p>{{ data.Price }} Coins</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center h-full justify-center gap-5 w-full">
        <p class="text-4xl text-white font-semibold">{{ petName }}</p>
        <div class="w-96 h-96 relative">
          <img src="/shopAvatarBackdrop.png" alt="" class="absolute" />
          <div class="absolute bottom-[5.7rem] right-28">
            <img src="/bird.svg" alt="" class="h-40 animate-bounce" />
          </div>
        </div>
        <Healthbar :futureDate="petHealth" />
      </div>

      <div class="w-44 flex justify-end">
        <div v-if="subcollectionEquipment" class="w-40 flex flex-col gap-4 overflow-scroll h-full">
          <div v-for="(data, index) in subcollectionEquipment" :key="index">
            <!-- Item -->
            <button @click="buyEquipment(data)">
              <div
                class="w-36 h-36 bg-white p-2 flex flex-col items-center justify-center rounded-lg"
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
  increment
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
      subcollectionEquipment: null
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
      }
    })
  },

  methods: {
    async fetchUserDataAndAccessories(useremail) {
      try {
        const docRef = doc(db, 'Users', useremail)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          this.coins = docSnap.data().Coins
          this.petName = docSnap.data().PetName
          this.petHealth = docSnap.data().PetHealth.toDate()

          const subcollectionRef = collection(docRef, 'Equipment')
          const subcollectionSnapshot = await getDocs(subcollectionRef)
          this.subcollectionEquipment = subcollectionSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
          console.log(this.subcollectionEquipment)
        } else {
          console.log('User not found')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    },

    async fetchFood() {
      const querySnapshot = await getDocs(query(collection(db, 'Food')))
      const foodData = querySnapshot.docs.map((doc) => doc.data())
      this.storeFoodDetail = foodData
    },

    async buyEquipment(item) {
      if (this.coins < item.Price) {
        console.log('Not enough coins')
        return
      } else if (item.Price == 0) {
        // set item as default equiped
      } else {
        const docRef = doc(db, 'Users', this.useremail)
        const equipmentRef = collection(docRef, 'Equipment')
        const querySnapshot = await getDocs(equipmentRef)
        const itemDoc = querySnapshot.docs.find((doc) => doc.data().Name === item.Name)

        await updateDoc(docRef, { Coins: increment(-item.Price) }) // decrease user's coin
        await updateDoc(itemDoc.ref, { Price: 0 }) // set price as 0
        console.log('Bought')

        await this.fetchUserDataAndAccessories(this.useremail) // refresh details
      }
    }
  }
}
</script>
