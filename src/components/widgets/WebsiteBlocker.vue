<template>
    <div class="blocker-widget" ref="blockerWidget">
      <div class="widget-header">Website Blocker</div>
      <div class="url-list-container" ref="urlContainer">
        <ul>
          <li v-for="(item, index) in blockedUrls" :key="index" class="url-item">
            <span class="url-text">{{ item }}</span>
            <button @click="deleteUrl(index)" class="delete-button">Delete</button>
          </li>
        </ul>
      </div>
      <div class="widget-footer">
        <input
          type="text"
          v-model="newUrl"
          placeholder="Enter Website URL"
          @keypress.enter.prevent="addUrl"
          class="url-input"
        />
        <button @click="addUrl" class="block-button">Block</button>
      </div>
    </div>
  </template>
  
  
<script>
    import { ref, reactive, onMounted, watchEffect } from 'vue';
    import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { initializeApp } from 'firebase/app';
    import { updateDoc } from 'firebase/firestore';
  
    var firebaseConfig = {
        apiKey: 'AIzaSyBNS5lPob943BHz34F2YrNUKbmxHv-3pX4',
        authDomain: 'twenify.firebaseapp.com',
        projectId: 'twenify',
        storageBucket: 'twenify.appspot.com',
        messagingSenderId: '271571950873',
        appId: '1:271571950873:web:1f13a731c00db955beb988',
        measurementId: 'G-524KVXZE3M'
    };
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth();
  
    export default {
      setup() {
        const user = ref(null);
        const useremail = ref('');
        const newUrl = ref('');
        const blockedUrls = reactive([]);
        const blockerWidget = ref(null);

        onAuthStateChanged(auth, (userAuth) => {
            if (userAuth) {
                user.value = userAuth;
                useremail.value = userAuth.email;
                // Watch the user document for changes once authenticated
                watchUserDocument(useremail.value);
            }
        });

        watchEffect(() => {
          if (useremail.value) {
            const userDocRef = doc(db, 'Users', useremail.value);
            onSnapshot(userDocRef, (docSnapshot) => {
              if (docSnapshot.exists() && docSnapshot.data().BlockedWebsite) {
                blockedUrls.splice(0, blockedUrls.length, ...docSnapshot.data().BlockedWebsite);
              }
            }, (error) => {
            console.error("Error fetching document: ", error);
            });
          }
         });

        onMounted(() => {
            if (blockerWidget.value) {
                dragElement(blockerWidget.value);
            }
        });

        const addUrl = async () => {
            if (newUrl.value.trim() === '') return;
            const updatedBlockedUrls = [...blockedUrls, newUrl.value]; // Create a new array with the new URL
            const userDocRef = doc(db, 'Users', useremail.value);
            await updateDoc(userDocRef, {
                BlockedWebsite: updatedBlockedUrls
            });
            newUrl.value = ''; // Clear the input
        };

        const deleteUrl = async (index) => {
          // Use index to identify the URL to delete
          const urlToDelete = blockedUrls[index];
          if (urlToDelete !== undefined) {
            const updatedBlockedUrls = blockedUrls.filter((url) => url !== urlToDelete);
            const userDocRef = doc(db, 'Users', useremail.value);
            await updateDoc(userDocRef, {
              BlockedWebsite: updatedBlockedUrls
            });
          }
        };

        const dragElement = (elmnt) => {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            const header = elmnt.querySelector('.widget-header');
            header.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px';
                elmnt.style.top = (elmnt.offsetTop - pos2) + 'px';
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        };
    
        return { newUrl, blockedUrls, addUrl, deleteUrl, blockerWidget };
        }
  };
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

.blocker-widget {
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
}

.url-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; /* Add space between items */
}

.url-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
  margin-right: 10px; /* Add space between the URL and the delete button */
}

.delete-button, .widget-footer button {
  background-color: #ffc54e; /* Maintain yellow color for all buttons */
  color: black;
  border: none;
  padding: 5px 20px; /* Standardize button width by padding */
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px; /* Standardize text size */
  white-space: nowrap; /* Prevent text wrapping */
}

.delete-button {
  padding: 3.75px 20px; /* 75% of the block button's height */
  background-color: lightgrey;
}

.blocker-widget input[type='text'] {
  background-color: #fff; /* Input field color white */
  color: black; /* Text color for input */
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  width: calc(100% - 90px); /* Adjust width to fit with button */
}

.widget-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.widget-footer button:hover {
  background-color: #e6db74; /* Light yellow for hover effect */
}

.widget-footer button:focus {
  outline: none;
}
</style>
