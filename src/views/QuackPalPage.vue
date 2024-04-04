<template>
  <PageLayout>
    <div class="flex flex-row justify-between px-8 p-4 h-full w-screen">
      <div class="w-44 flex flex-col gap-4 h-full">
        <div class="bg-[#FEF8EB] p-3 rounded-xl flex items-center justify-center gap-3">
          <img src="/icons/coins.svg" alt="" class="h-9 w-9" />
          <p class="text-2xl font-semibold text-tPurple">1700</p>
        </div>
        <div class="bg-white p-4 rounded-lg flex flex-col gap-7 overflow-scroll h-fit">
          <!-- Item -->
          <div
            class="w-36 h-36 bg-tYellow p-2 flex flex-col items-center justify-center rounded-lg"
          >
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
          <!-- Item -->
          <div
            class="w-36 h-36 bg-tYellow p-2 flex flex-col items-center justify-center rounded-lg"
          >
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
          <!-- Item -->
          <div
            class="w-36 h-36 bg-tYellow p-2 flex flex-col items-center justify-center rounded-lg"
          >
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
          <!-- Item -->
          <div
            class="w-36 h-36 bg-tYellow p-2 flex flex-col items-center justify-center rounded-lg"
          >
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
          <!-- Item -->
          <div
            class="w-36 h-36 bg-tYellow p-2 flex flex-col items-center justify-center rounded-lg"
          >
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center h-full justify-center gap-5 w-full">
        <p class="text-4xl text-white font-semibold">Henry</p>
        <div class="rounded-full aspect-1 bg-[#D69663] w-96 h-96 flex items-center justify-center">
          <img src="/bird.svg" alt="" class="w-[70%]" />
        </div>
        <div class="flex items-center gap-2 w-full justify-center">
          <img src="/icons/heart-solid.svg" class="h-9 w-9" alt="" />
          <div class="w-96 h-9 bg-white rounded-lg relative">
            <div class="absolute h-9 w-40 bg-green-400 rounded-lg" />
          </div>
        </div>
      </div>

      <div class="w-44 flex justify-end">
        <div class="w-40 flex flex-col gap-4 overflow-scroll h-full">
          <!-- Item -->
          <div class="w-36 h-36 bg-white p-2 flex flex-col items-center justify-center rounded-lg">
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
          <!-- Item -->
          <div class="w-36 h-36 bg-white p-2 flex flex-col items-center justify-center rounded-lg">
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
          <!-- Item -->
          <div class="w-36 h-36 bg-white p-2 flex flex-col items-center justify-center rounded-lg">
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
          <!-- Item -->
          <div class="w-36 h-36 bg-white p-2 flex flex-col items-center justify-center rounded-lg">
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
          <!-- Item -->
          <div class="w-36 h-36 bg-white p-2 flex flex-col items-center justify-center rounded-lg">
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
          <!-- Item -->
          <div class="w-36 h-36 bg-white p-2 flex flex-col items-center justify-center rounded-lg">
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
          <!-- Item -->
          <div class="w-36 h-36 bg-white p-2 flex flex-col items-center justify-center rounded-lg">
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
          <!-- Item -->
          <div class="w-36 h-36 bg-white p-2 flex flex-col items-center justify-center rounded-lg">
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
          <!-- Item -->
          <div class="w-36 h-36 bg-white p-2 flex flex-col items-center justify-center rounded-lg">
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
          <!-- Item -->
          <div class="w-36 h-36 bg-white p-2 flex flex-col items-center justify-center rounded-lg">
            <p>Seeds</p>
            <div class="overflow-hidden flex justify-center">
              <img src="/test.png" alt="" />
            </div>
            <p>50 Coins</p>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script>
import PageLayout from '@/components/PageLayout.vue'

export default {
  name: 'QuackPalPage',

  components: {
    PageLayout
  }
}
</script>

<style scoped></style>
