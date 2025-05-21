<template>
  <main class="container">
    <div style="margin: 0 auto">
      <button @click="fetchVersion">Fetch Version</button>
      <button class="btn" @click="greet" style="margin-left: 200px">Greet</button>
    </div>

    <h1 class="">Welcome to Tauri + Vue</h1>

    <div class="row">
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo vite" alt="Vite logo" />
      </a>
      <a href="https://tauri.app" target="_blank">
        <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <p>Click on the Tauri, Vite, and Vue logos to learn more.</p>

    <form class="row">
      <input id="greet-input" v-model="name" placeholder="Enter a name..." />
    </form>

    <p>{{ greetMsg }}</p>

    <div class="cart" style="background-color: antiquewhite; width: 24px; height: 24px; margin: 0 auto"></div>

    <Dialog v-model:open="isShow">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription> Make changes to your profile here. Click save when you're done. </DialogDescription>
        </DialogHeader>

        {{ version }}

        <DialogFooter> Save changes </DialogFooter>
      </DialogContent>
    </Dialog>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { invoke } from '@tauri-apps/api/core'

import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const greetMsg = ref('')
const name = ref('')

// async function greet() {
//   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//   greetMsg.value = await invoke('greet', { name: name.value })
// }

const PLUS_SIZE = 30 // 加号的宽度

async function greet() {
  const cart = document.querySelector('.cart')
  const btn = document.querySelector('.btn')
  // console.log(btn)
  const div = document.createElement('div')
  div.className = 'plus'
  div.innerHTML = `<i class="plusicon" style="display: block">+</i>`

  const btnRect = btn.getBoundingClientRect()

  console.log(btnRect)
  const left = btnRect.left + btnRect.width / 2 - PLUS_SIZE / 2,
    top = btnRect.top + btnRect.height / 2 - PLUS_SIZE / 2

  // 横向移动的距离是 加号的left加上它自身宽度的一半，减去购物车的left加上它自身宽度的一半。
  const cartRect = cart.getBoundingClientRect()

  console.log(cartRect)
  const x = cartRect.left + cartRect.width / 2 - PLUS_SIZE / 2 - left
  // 纵向移动的距离是 加号的top加上它自身高度的一半，减去购物车的top加上它自身高度的一半。
  const y = cartRect.top + cartRect.height / 2 - PLUS_SIZE / 2 - top

  console.log(left)
  console.log(x)

  div.style.setProperty('--left', `${left}px`)
  div.style.setProperty('--top', `${top}px`)
  div.style.setProperty('--x', `${x}px`)
  div.style.setProperty('--y', `${y}px`)

  console.log(div.style)

  div.addEventListener('animationend', () => {
    div.remove()
  })

  document.body.appendChild(div)
}

const isShow = ref()
const version = reactive({})

const fetchVersion = async () => {
  const update = await check()

  if (update) {
    isShow.value = true
    Object.assign(version, update)
    console.log(`found update ${update.version} from ${update.date} with notes ${update.body}`)
    let downloaded = 0
    let contentLength = 0
    // alternatively we could also call update.download() and update.install() separately
    await update.downloadAndInstall(event => {
      switch (event.event) {
        case 'Started':
          contentLength = event.data.contentLength
          console.log(`started downloading ${event.data.contentLength} bytes`)
          break
        case 'Progress':
          downloaded += event.data.chunkLength
          console.log(`downloaded ${downloaded} from ${contentLength}`)
          break
        case 'Finished':
          console.log('download finished')
          break
      }
    })

    console.log('update installed')
    // await relaunch()
  }
}
</script>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}
</style>
<style>
.plus {
  position: fixed;
  left: var(--left);
  top: var(--top);
  animation: moveY 0.8s cubic-bezier(0.5, -0.5, 1, 1);
}

.plusicon {
  animation: moveX 0.8s linear;
}

@keyframes moveY {
  to {
    transform: translateY(var(--y));
  }
}

@keyframes moveX {
  to {
    transform: translateX(var(--x));
  }
}

.horse-run {
  offset-path: path('M10,80 q100,120 120,20 q140,-50 160,0');
  animation: move 3s linear infinite;
}
@keyframes move {
  100% {
    offset-distance: 100%;
  }
}

:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.container {
  margin: 0;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: 0.75s;
}

.logo.tauri:hover {
  filter: drop-shadow(0 0 2em #24c8db);
}

.row {
  display: flex;
  justify-content: center;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

h1 {
  text-align: center;
}

input,
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}
button:active {
  border-color: #396cd8;
  background-color: #e8e8e8;
}

input,
button {
  outline: none;
}

#greet-input {
  margin-right: 5px;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }

  a:hover {
    color: #24c8db;
  }

  input,
  button {
    color: #ffffff;
    background-color: #0f0f0f98;
  }
  button:active {
    background-color: #0f0f0f69;
  }
}
</style>
