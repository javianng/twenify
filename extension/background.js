import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

// self.addEventListener('install', () => {
//     console.log('Service worker installed');
// });

// The app's Firebase configuration 

var firebaseConfig = {
  apiKey: 'AIzaSyBNS5lPob943BHz34F2YrNUKbmxHv-3pX4',
  authDomain: 'twenify.firebaseapp.com',
  projectId: 'twenify',
  storageBucket: 'twenify.appspot.com',
  messagingSenderId: '271571950873',
  appId: '1:271571950873:web:1f13a731c00db955beb988',
  measurementId: 'G-524KVXZE3M'
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig)

// Initialize Firestore Database
const db = getFirestore(app)

self.addEventListener('install', (event) => {
  console.log('Service worker installed')
  // Ensure the service worker doesn't install until the initial data fetch completes
  event.waitUntil(
    (async () => {
      try {
        // Attempt to fetch documents from the "blocked_websites" collection
        const querySnapshot = await getDocs(collection(db, 'blocked_websites'))
        if (querySnapshot.empty) {
          console.log('No documents found in "blocked_websites" collection.')
        } else {
          console.log('Fetched documents from "blocked_websites":')
          querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${JSON.stringify(doc.data())}`)
          })
        }
      } catch (error) {
        console.error('Error accessing Firestore:', error)
      }
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(updateBlockedWebsitesRules())
})

// async function fetchPomodoroStatus() {
//   const statusSnapshot = await getDocs(collection(db, 'pomodoro_status'));
//   const statusDoc = statusSnapshot.docs[0]; // Assuming there's only one document in the 'pomodoro_status' collection.
//   return statusDoc.data().status; // 'status' field should be a boolean.
// }


async function updateBlockedWebsitesRules() {
  try {
    const existingRulesResponse = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRules = existingRulesResponse || [];

    const removeRuleIds = existingRules.map(rule => rule.id);

    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds });

    // Fetch the current rules from Firestore
    const querySnapshot = await getDocs(collection(db, 'blocked_websites'));
    const newRules = querySnapshot.docs.map((doc, index) => ({
      id: index + 1,  // Rule ID starts at 1 and increments for each document
      priority: 1,
      action: { type: 'block' },
      condition: { urlFilter: doc.data().url, resourceTypes: ['main_frame'] }
    }));

    console.log('Rules to add:', newRules);

    // Update rules by  adding new ones
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: newRules
    });

    console.log('Blocking rules updated successfully');
  } catch (error) {
    console.error('Error fetching and updating rules:', error);
  }
}

// function getMainDomain(url) {
//     try {
//       // The URL constructor is used to parse the URL.
//       const { hostname } = new URL(url);
//       // This regular expression is designed to capture the main domain name.
//       const domainMatch = hostname.match(/(?:www\.)?(.+\..+)$/);
//       if (domainMatch) {
//         return domainMatch[1];
//       }
//     } catch (e) {
//       console.error('Invalid URL', e);
//     }
//     return null;
// }

// Function to periodically check Firestore for updates
function startPeriodicCheck() {
    const checkInterval = 1000 * 1; // Check every 1 second, adjust as needed

    async function checkForUpdates() {
        console.log('Checking for updates...');
        // const isPomodoroActive = await fetchPomodoroStatus(); // Get the current pomodoro status.
        // if (isPomodoroActive) {
        //   
        console.log('Pomodoro is active. Updating blocked websites rules.');
        await updateBlockedWebsitesRules(); // Ensure this function is designed to be safely callable multiple times
    }

    checkForUpdates(); // Initial check
    setInterval(checkForUpdates, checkInterval); // Set up periodic checks
}

self.addEventListener('activate', (event) => {
    event.waitUntil(
        // Ensure the service worker stays active until the initial check completes
        clients.claim().then(() => {
            startPeriodicCheck();
        })
    );
});


// async function updateBlockedWebsitesRules() {
//   try {
//     // Fetch the current rules from Firestore
//     const querySnapshot = await getDocs(collection(db, 'blocked_websites'));
//     const newRules = querySnapshot.docs.map((doc, index) => ({
//       id: index + 1,  // Rule ID starts at 1 and increments for each document
//       priority: 1,
//       action: { type: 'block' },
//       condition: { urlFilter: doc.data().url, resourceTypes: ['main_frame'] }
//     }));

//     // Retrieve existing rules from the service worker (assuming API support)
//     const { rules: existingRules } = await chrome.declarativeNetRequest.getDynamicRules();

//     const existingRuleIdsToRemove = existingRules
//       .filter(rule => !newRules.some(newRule => newRule.condition.urlFilter === rule.condition.urlFilter))
//       .map(rule => rule.id);

//     const newRuleIdsToAdd = newRules
//       .filter(newRule => !existingRules.some(rule => rule.condition.urlFilter === newRule.condition.urlFilter));

//     console.log('Rules to remove:', existingRuleIdsToRemove);
//     console.log('Rules to add:', newRuleIdsToAdd);

//     // Update rules by removing outdated and adding new ones
//     await chrome.declarativeNetRequest.updateDynamicRules({
//       removeRuleIds: existingRuleIdsToRemove,
//       addRules: newRuleIdsToAdd
//     });

//     console.log('Blocking rules updated successfully');
//   } catch (error) {
//     console.error('Error fetching and updating rules:', error);
//   }
// }

// let currentRuleIds = new Set(); // This set will track all active rule IDs

// async function updateBlockedWebsitesRules() {
//     try {
//         const querySnapshot = await getDocs(collection(db, 'blocked_websites'));
//         const rulesToAdd = [];
//         const rulesToRemove = Array.from(currentRuleIds); // Convert all current rule IDs to an array for removal

//         querySnapshot.docs.forEach((doc, index) => {
//             const ruleId = index + 1; // Generate a rule ID based on index
//             currentRuleIds.add(ruleId); // Add to the set of current rule IDs
//             rulesToAdd.push({
//                 id: ruleId,
//                 priority: 1,
//                 action: { type: 'block' },
//                 condition: { urlFilter: doc.data().url, resourceTypes: ['main_frame'] }
//             });
//         });

//         // Clear existing rules before setting new ones.
//         await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: rulesToRemove });

//         // Add new rules.
//         await chrome.declarativeNetRequest.updateDynamicRules({ addRules: rulesToAdd });
//         console.log('Successfully updated blocking rules', rulesToAdd);
//     } catch (error) {
//         console.error('Error fetching and updating rules:', error);
//     }
// }

// console.log(`Current Rules in Set:`, Array.from(currentRuleIds));
// console.log(`Rules to Add:`, rulesToAdd.map(r => r.condition.urlFilter));
// console.log(`Rules to Remove:`, rulesToRemove);


// async function updateBlockedWebsitesRules() {
//     try {
//       const querySnapshot = await getDocs(collection(db, 'blocked_websites'));
//       const rules = querySnapshot.docs.map((doc, index) => ({
//         id: parseInt(index + 1, 10), // Ensuring ID is an integer.
//         priority: 1,
//         action: { type: 'block' },
//         condition: { urlFilter: doc.data().url, resourceTypes: ['main_frame'] }
//       }));

//       console.log('Updating with rules:', rules);
  
//       // Clear existing rules before setting new ones.
//       await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: Array.from({length: rules.length}, (_, i) => i + 1) });
  
//       // Add new rules.
//       await chrome.declarativeNetRequest.updateDynamicRules({ addRules: rules });
//       console.log('Successfully updated blocking rules', rules);
//     } catch (error) {
//       console.error('Error fetching and updating rules:', error);
//     }
// }

// async function updateBlockedWebsitesRules() {
//   try {
//     const querySnapshot = await getDocs(collection(db, 'blocked_websites'))
//     const rules = []
//     querySnapshot.forEach((doc, index) => {
//       const data = doc.data()
//       if (data.url) {
//         rules.push({
//             id: parseInt(index + 1, 10),
//             priority: 1,
//             action: { type: 'block' },
//             condition: { urlFilter: data.url, resourceTypes: ['main_frame'] }
//           });
//       }
//     })

//     console.log('Updating with rules:', rules);

//     if (rules.length > 0) {
//       chrome.declarativeNetRequest.updateDynamicRules(
//         {
//           removeRuleIds: rules.map((rule) => rule.id),
//           addRules: rules
//         },
//         () => {
//           if (chrome.runtime.lastError) {
//             console.error('Error updating rules:', chrome.runtime.lastError)
//           } else {
//             console.log('Successfully updated blocking rules')
//           }
//         }
//       )
//     }
//   } catch (error) {
//     console.error('Error fetching and updating rules:', error)
//   }
// }

// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//     console.log('yes');
// } else {
//     firebase.app();
//     console.log('no');
// }

// var db = firebase.firestore();
// var websites = db.collection("blocked_websites");

// websites.get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         // Assuming 'url' is the field you want to print
//         console.log(doc.data().url);
//     });
// }).catch((error) => {
//     console.log("Error getting documents: ", error);
// });

// const db = firebase.firestore();

// self.addEventListener('install', (event) => {
//     console.log('Service worker installed');
//     event.waitUntil(
//       (async () => {
//         try {
//           const querySnapshot = await db.collection("blocked_websites").get();
//           querySnapshot.forEach((doc) => {
//             console.log(doc.id, " => ", doc.data().url); // Make sure the field name is 'url'
//           });
//         } catch (error) {
//           console.error("Error getting documents: ", error);
//         }
//       })()
//     );
// });

// try {
//     // Initialize Firebase
//     if (!firebase.apps.length) {
//       console.log('Initializing Firebase...');
//       firebase.initializeApp(firebaseConfig);
//     } else {
//       firebase.app(); // if already initialized, use that one
//     }

//     console.log('Firebase initialized successfully');
//   } catch (error) {
//     console.error('Firebase initialization error:', error);
//   }

// const FIREBASE_PROJECT_ID = 'twenify';
// const FIREBASE_API_KEY = 'AIzaSyBNS5lPob943BHz34F2YrNUKbmxHv-3pX4';

// const FIREBASE_URL = 'https://twenify.firebaseio.com';

// chrome.runtime.onInstalled.addListener(() => {
//     console.log('Extension installed and service worker activated.');
//     fetchBlockedWebsites();
// });

// chrome.runtime.onStartup.addListener(() => {
//     console.log('Service worker started up.');
//     fetchBlockedWebsites();
// });

// async function fetchBlockedWebsites() {
//     try {
//         const response = await fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/blocked_websites?key=${FIREBASE_API_KEY}`);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         if (data) {
//             // Convert object to array if necessary and update the net request rules
//             const urls = Object.values(data);
//             const rules = urls.map((url, index) => ({
//               id: index + 1,
//               priority: 1,
//               action: { type: 'block' },
//               condition: {
//                 urlFilter: `*://*.${url}/*`,
//                 resourceTypes: ['main_frame']
//               }
//             }));

//             chrome.declarativeNetRequest.updateDynamicRules({
//               removeRuleIds: rules.map(rule => rule.id),
//               addRules: rules
//             });
//         }
//     } catch (error) {
//         console.error("Error fetching blocked websites:", error);
//     }

// }

// // Call fetchBlockedWebsites to initialize the blocking on startup
// fetchBlockedWebsites();

// const firebaseConfig = {
//     apiKey: "AIzaSyBNS5lPob943BHz34F2YrNUKbmxHv-3pX4",
//     authDomain: "twenify.firebaseapp.com",
//     projectId: "twenify",
//     storageBucket: "twenify.appspot.com",
//     messagingSenderId: "271571950873",
//     appId: "1:271571950873:web:1f13a731c00db955beb988",
//     measurementId: "G-524KVXZE3M"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Set up Firestore collection snapshot listener
// onSnapshot(collection(db, 'blocked_websites'), (snapshot) => {
//     const rules = snapshot.docs.map((doc, index) => {
//       const url = doc.data().url; // Assuming 'url' field in your doc
//       return {
//         id: index + 1,
//         priority: 1,
//         action: { type: 'block' },
//         condition: {
//           urlFilter: `*://*.${url}/*`,
//           resourceTypes: ['main_frame']
//         }
//       };
//     });

//     // Update the rules dynamically
//     chrome.declarativeNetRequest.updateDynamicRules({
//       removeRuleIds: rules.map(rule => rule.id),
//       addRules: rules
//     });
// });
