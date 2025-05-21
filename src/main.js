import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')


// 监听更新，并在更新后重启
// 但不是必须的，可以等到用户下次启动

// import { check } from '@tauri-apps/plugin-updater'
// import { relaunch } from '@tauri-apps/plugin-process'


// const update = await check()

// if (update) {
//   console.log(`found update ${update.version} from ${update.date} with notes ${update.body}`)
//   let downloaded = 0
//   let contentLength = 0
//   // alternatively we could also call update.download() and update.install() separately
//   await update.downloadAndInstall(event => {
//     switch (event.event) {
//       case 'Started':
//         contentLength = event.data.contentLength
//         console.log(`started downloading ${event.data.contentLength} bytes`)
//         break
//       case 'Progress':
//         downloaded += event.data.chunkLength
//         console.log(`downloaded ${downloaded} from ${contentLength}`)
//         break
//       case 'Finished':
//         console.log('download finished')
//         break
//     }
//   })

//   console.log('update installed')
//   await relaunch()
// }
