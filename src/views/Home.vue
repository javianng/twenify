<template>
  <div
    style="
      background: linear-gradient(
        180deg,
        #27004d 0%,
        #30015d 19%,
        #7505e2 48.5%,
        #9e4af1 69%,
        #5b0093 100%
      );
    "
    class="flex justify-center"
  >
    <div class="max-w-6xl p-8">
      <div v-if="!user" class="flex justify-end gap-4 text-white">
        <router-link to="/register"
          ><p class="hover:text-tYellow duration-150">New User</p></router-link
        >
        <p>|</p>
        <router-link to="/sign-in"
          ><p class="hover:text-tYellow duration-150">Log In</p></router-link
        >
      </div>
      <router-link v-else to="/dashboard" class="flex justify-end gap-4 text-white"
        ><p>Dashboard</p></router-link
      >
      <div class="min-h-[50vh] items-center flex justify-center">
        <div class="flex flex-col gap-8">
          <div class="items-center flex justify-center">
            <img src="/twenifyLogoName.png" alt="logo" class="max-w-4xl" />
          </div>
          <p class="text-white text-xl text-center">
            Unlock your twenty-fifth hour of productivity with twenify - the all in one productivity
            website that streamline tasks, boosts efficiency, and enhances your workday.
          </p>
        </div>
      </div>
      <div class="flex justify-center py-8">
        <a
          href="#feature"
          class="border-2 border-tBeige hover:border-tYellow transition duration-150 py-2 px-4 rounded-full p"
        >
          <p class="text-white text-xl">↓ View Our Features</p>
        </a>
      </div>
      <div class="flex flex-row min-h-[50vh] items-center hover:scale-105 duration-150">
        <div class="border-l-8 border-tYellow">
          <div class="px-6 max-w-[66%] flex flex-col gap-4">
            <h1 class="text-7xl font-bold text-white" id="feature">Customisable Pomodoro Timer</h1>
            <p class="text-white text-xl pb-5">
              a customisable timer that you can use to set your work and break sessions according to
              your needs!
            </p>
          </div>
        </div>
      </div>
      <div class="flex flex-row min-h-[50vh] items-center hover:scale-105 duration-150">
        <div class="border-r-8 border-tYellow flex justify-end text-end">
          <div class="px-6 max-w-[66%] flex flex-col gap-4">
            <h1 class="text-7xl font-bold text-white">Integrated Calender & To-Do List</h1>
            <p class="text-white text-xl pb-5">
              Seamlessly integrate with Google Calendar to keep track of your workloads throughout
              the week as well as the tasks for the day!
            </p>
          </div>
        </div>
      </div>
      <div class="flex flex-row min-h-[50vh] items-center hover:scale-105 duration-150">
        <div class="border-l-8 border-tYellow">
          <div class="px-6 max-w-[66%] flex flex-col gap-4">
            <h1 class="text-7xl font-bold text-white">Productivity Analytics & Leaderboard</h1>
            <p class="text-white text-xl pb-5">
              Track your productivity on a day to day basis, and see how you perform alongside your
              peers. Time to get to the top of the leaderboard!
            </p>
          </div>
        </div>
      </div>
      <div class="flex flex-row min-h-[50vh] items-center hover:scale-105 duration-150">
        <div class="border-r-8 border-tYellow flex justify-end text-end">
          <div class="px-6 max-w-[66%] flex flex-col gap-4">
            <h1 class="text-7xl font-bold text-white">Website Blocking Capabilities</h1>
            <p class="text-white text-xl pb-5">
              Block out specific websites that tend to cause you to be distracted, allowing you to
              stay fully focussed on the task that you have at hand!
            </p>
          </div>
        </div>
      </div>
      <div class="min-h-[50vh] flex flex-col gap-5">
        <div class="border-l-8 border-tYellow hover:scale-105 duration-150">
          <div class="px-6 max-w-[66%] flex flex-col gap-4">
            <h1 class="text-7xl font-bold text-white">A Friend for the Road Ahead</h1>
            <p class="text-white text-xl pb-5">
              Grow your own personal virtual duck! The more study sessions that you put in, the more
              your QuackCoins you can collect to customise your duck.
            </p>
          </div>
        </div>
        <div class="flex flex-row w-full">
          <img src="/bird.svg" alt="" class="max-w-[25%] hover:scale-105 duration-150" />
          <div class="flex flex-col gap-5 justify-center items-center text-white text-xl w-full">
            <p>
              Ready to unlock the <span class="text-tYellow"> twenty-fifth hour </span> of your day?
            </p>
            <div class="flex flex-row gap-4">
              <router-link to="/register">
                <Button buttonText="New User" />
              </router-link>
              <router-link to="/sign-in">
                <Button buttonText="Log In" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default {
  components: {
    Button
  },

  name: 'Home',

  data() {
    return {
      user: false
    }
  },

  mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user
      }
    })
  }
}
</script>
