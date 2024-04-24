import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { doc, getDoc } from 'firebase/firestore';

self.addEventListener('install', () => {
    console.log('Service worker installed');
});



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

// Define the user's email ID
const userEmail = "anushkaashirgade@u.nus.edu";

async function updateBlockedWebsitesRules() {
  try {
    // Fetch the user's document from Firestore using the email ID
    const userDocRef = doc(db, 'Users', userEmail);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      throw new Error('User document does not exist.');
    }

    const userData = userDocSnapshot.data();

    // Check if blocking is enabled for the user
    if (!userData.blocker_status) {
      console.log('Blocking is disabled for this user.');
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: Array.from({length: 100}, (_, i) => i + 1) // Removes first 100 rules as example
      });
      return; // Exit the function if blocking is disabled
    }

    // Get the array of blocked websites from the user's document
    const blockedWebsites = userData.BlockedWebsite || [];

    // Fetch existing rules from the extension
    const existingRulesResponse = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRules = existingRulesResponse || [];
    const removeRuleIds = existingRules.map(rule => rule.id);

    // Remove all existing rules
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds });

    // Map the blocked websites to new rules
    const newRules = blockedWebsites.map((url, index) => ({
      id: index + 1,  // Rule ID starts at 1 and increments for each website
      priority: 1,
      action: { type: 'block' },
      condition: { urlFilter: url, resourceTypes: ['main_frame'] }
    }));

    // Update rules by adding new ones
    await chrome.declarativeNetRequest.updateDynamicRules({ addRules: newRules });

    console.log('Blocking rules updated successfully with user-specific data');
  } catch (error) {
    console.error('Error fetching and updating rules:', error);
  }
}


// async function updateBlockedWebsitesRules() {
//   try {
//     const existingRulesResponse = await chrome.declarativeNetRequest.getDynamicRules();
//     const existingRules = existingRulesResponse || [];

//     const removeRuleIds = existingRules.map(rule => rule.id);

//     await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds });

//     // Fetch the current rules from Firestore
//     const querySnapshot = await getDocs(collection(db, 'blocked_websites'));
//     const newRules = querySnapshot.docs.map((doc, index) => ({
//       id: index + 1,  // Rule ID starts at 1 and increments for each document
//       priority: 1,
//       action: { type: 'block' },
//       condition: { urlFilter: doc.data().url, resourceTypes: ['main_frame'] }
//     }));

//     console.log('Rules to add:', newRules);

//     // Update rules by  adding new ones
//     await chrome.declarativeNetRequest.updateDynamicRules({
//       addRules: newRules
//     });

//     console.log('Blocking rules updated successfully');
//   } catch (error) {
//     console.error('Error fetching and updating rules:', error);
//   }
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

