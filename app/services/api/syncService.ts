// // https://github.com/guestDI/offline-app-demo

// // --- Sync status event system ---
// // const listeners = []

// // export function subscribeToSyncStatus(listener) {
// //   listeners.push(listener)
// //   return () => {
// //     const idx = listeners.indexOf(listener)
// //     if (idx > -1) listeners.splice(idx, 1)
// //   }
// // }

// // function notifySyncStatus(status) {
// //   listeners.forEach(listener => listener(status))
// // }

// // --- End event system ---

// class SyncService {
//   isOnline: boolean
//   syncInProgress: boolean

//   constructor() {
//     this.isOnline = navigator.onLine
//     this.syncInProgress = false

//     // Listen for online/offline events
//     window.addEventListener('online', this.handleOnline.bind(this))
//     window.addEventListener('offline', this.handleOffline.bind(this))
//   }

//   handleOnline() {
//     this.isOnline = true
//     this.syncData()
//   }

//   handleOffline() {
//     this.isOnline = false
//   }

//   async syncData() {
//     if (!this.isOnline || this.syncInProgress) {
//       return
//     }

//     this.syncInProgress = true
//     // notifySyncStatus('in-progress')

//     try {
//       // Get pending operations from sync queue
//       const syncQueue = await indexedDBService.getSyncQueue()

//       for (const operation of syncQueue) {
//         await this.processOperation(operation)
//       }

//       // Clear sync queue after successful sync
//       await indexedDBService.clearSyncQueue()

//       // Fetch latest data from server
//       await this.pullFromServer()

//       notifySyncStatus('done')
//     } catch (error) {
//       notifySyncStatus('error')
//       console.error('Sync failed:', error)
//     } finally {
//       this.syncInProgress = false
//     }
//   }

//   async processOperation(operation) {
//     switch (operation.operation) {
//       case 'CREATE_NOTE':
//         await apiService.createNote(operation.data)
//         break
//       case 'UPDATE_NOTE':
//         await apiService.updateNote(operation.data.id, operation.data)
//         break
//       case 'DELETE_NOTE':
//         await apiService.deleteNote(operation.data.id)
//         break
//       default:
//         console.warn('Unknown operation:', operation.operation)
//     }
//   }

//   async pullFromServer() {
//     try {
//       const serverNotes = await apiService.getAllNotes()

//       // Compare with local data and resolve conflicts
//       const localNotes = await indexedDBService.getAllNotes()
//       const mergedNotes = this.resolveConflicts(localNotes, serverNotes)

//       // Update local database with resolved data
//       for (const note of mergedNotes) {
//         // Only update if the note has changed
//         const localNote = localNotes.find(n => n.id === note.id)
//         if (!localNote || localNote.updatedAt !== note.updatedAt) {
//           await indexedDBService.saveNote({
//             ...note,
//             needsSync: false, // Explicitly mark as synced
//           })
//         }
//       }
//     } catch (error) {
//       console.error('Failed to pull from server:', error)
//     }
//   }

//   resolveConflicts(localNotes, serverNotes) {
//     // Simple last-write-wins strategy
//     // In production, you might want more sophisticated conflict resolution
//     const merged = new Map()

//     // Add all local notes
//     localNotes.forEach(note => {
//       merged.set(note.id, note)
//     })

//     // Merge server notes, preferring newer timestamps
//     serverNotes.forEach(serverNote => {
//       const localNote = merged.get(serverNote.id)

//       if (
//         !localNote ||
//         new Date(serverNote.updatedAt) > new Date(localNote.updatedAt)
//       ) {
//         merged.set(serverNote.id, {...serverNote, needsSync: false})
//       }
//     })

//     return Array.from(merged.values())
//   }
// }

// export default new SyncService()
