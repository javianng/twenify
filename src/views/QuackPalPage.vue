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
            <img src="/bird.svg" alt="" class="h-40" />
          </div>
        </div>
        <Healthbar :futureDate="petHealth" />
      </div>

      <div class="w-44 flex justify-end">
        <div v-if="storeAccesssoriesDetail" class="w-40 flex flex-col gap-4 overflow-scroll h-full">
          <div v-for="(data, index) in storeAccesssoriesDetail" :key="index">
            <!-- Item -->
            <div
              class="w-36 h-36 bg-white p-2 flex flex-col items-center justify-center rounded-lg"
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
  arrayUnion
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
      useremail: null,
      storeAccesssoriesDetail: null,
      storeFoodDetail: null,
      petName: null,
      petHealth: null,
      coins: 0
    }
  },

  async mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user
        this.useremail = auth.currentUser.email
        await this.fetchData(this.useremail)
        await this.fetchFood()
        await this.fetchAccessories()
      }
    })
  },

  methods: {
    async fetchData(useremail) {
      try {
        const docRef = doc(db, 'Users', useremail)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          this.petName = docSnap.data().PetName
          this.petHealth = docSnap.data().PetHealth.toDate()
          this.coins = docSnap.data().Coins
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

    async fetchAccessories() {
      const querySnapshot = await getDocs(query(collection(db, 'Accessories')))
      const accessoriesData = querySnapshot.docs.map((doc) => doc.data())
      this.storeAccesssoriesDetail = accessoriesData
    },

    async buyItem(item, type) {
      if (this.coins < item.Price) {
        console.log('Not enough coins')
        return
      }
      this.coins -= item.Price

      try {
        const userRef = doc(db, 'Users', this.useremail)
        await updateDoc(userRef, {
          Coins: this.coins,
          [type]: arrayUnion(item)
        })
        console.log('Purchase successful')
      } catch (error) {
        console.error('Error updating document:', error)
      }
    }
  }
}
</script>
