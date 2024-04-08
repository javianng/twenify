<template>
    <PageLayout>
      <div class="flex flex-col items-center gap-8 pt-12" v-if="user">
        <h1 class="text-center text-5xl font-medium text-white">Friends Page</h1>
        <div class="flex flex-col items-center">
            <div>
            <Button id="btnSend" @click="changeToSendRequest()" v-if="user" buttonText="Send Request"></Button>
            <Button id="btnPending" @click="changeToPendingRequest()" v-if="user" buttonText="Pending Request"></Button>
        </div>
        </div>

        <div class="flex flex-col gap-2" v-show = "SendRequestPage && !PendingRequestPage">
          <div class="flex items-center gap-4">
            <p class="font-bold text-white w-20">Friend's Email</p>
            <input
              type="text"
              v-model="friendsEmail"
              placeholder="Email"
              class="rounded-lg p-2"
              @input = "handleInputChange"
            />
            <Button id="btn" @click=" fetchData(friendsEmail)" v-if="user" buttonText="Search"></Button>
          </div>
          <br>
          <div class="flex flex-col items-left">
            <p v-if= "isAlreadyFriend  && friendsEmail !== '' && searchedPressed" class="font-bold text-white"> Is Already A Friend!</p>
            <p v-if = "isMyself  && friendsEmail !== '' && searchedPressed" class="font-bold text-white"> Can't be friends with yourself</p>
            <p v-if ="friendExists === true && friendsEmail !== '' && searchedPressed && !isAlreadyFriend && !isMyself" class="font-bold text-white">
            Send Friend Request to {{friendUsername}}
            <Button id="btnSendReq"  @click="sendRequest(friendsEmail)" buttonText="Send Request" > </Button>
            </p>
            <p v-if ="friendExists === false && friendsEmail !== '' && searchedPressed && !isAlreadyFriend && !isMyself" class="font-bold text-white">
            Email was not found
            </p>
        </div>
        </div>
        
        
        <div class="flex flex-col gap-2" v-show = "!SendRequestPage && PendingRequestPage">
            <p class="font-bold text-white w-70 items-left" v-if="RequestEmail.length > 0 ">
                <table class = "incomingRequestTable" >
                    <thead>
                        <tr>
                            <th> Request From: </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for = "(email, index) in RequestEmail" :key = "email">
                            <td> {{RequestNames[index]}}</td>
                            <td>{{email}} </td>
                            <td> <button class = "acceptBtn" @click="acceptFriend(email)"> Accept</button></td>
                            <td> <button class = "declineBtn" @click="declineFriend(email)"> Decline</button></td>
                        </tr>
                    </tbody>
                </table>
            </p>
            <p class="font-bold text-white w-70 items-left" v-else>
                No Incoming Requests!
            </p>

            <p class="font-bold text-white w-70 items-left" v-if="newFriendsEmail.length > 0 "> 
                <br>
                <table class = "acceptedRequestTable">
                    <thead>
                        <tr>
                            <th> New Friends: </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for = "(email, index) in newFriendsEmail" :key = "email">
                            <td> {{newFriendsName[index]}}</td>
                            <td>{{email}} </td>
                        </tr>
                    </tbody>
                </table>
                <button class = "dismissBtn" @click="dismiss()"> Dismiss </button>
            </p>
            <p class="font-bold text-white w-70 items-left" v-else>
                <br>
                No New Friends!
            </p>
        </div>
      </div>
    </PageLayout>
  </template>
  
  <script>
  import firebaseApp from '../firebase.js'
  import PageLayout from '@/components/PageLayout.vue'
  import Button from '@/components/Button.vue'
  import { doc, getFirestore, updateDoc, getDoc, arrayUnion } from 'firebase/firestore'
  import { getAuth, onAuthStateChanged, updatePassword } from 'firebase/auth'
  
  const db = getFirestore(firebaseApp)
  
  export default {
    name: 'FriendsPage',
    components: {
      PageLayout,
      Button
    },
    computed: {
      usernamePlaceholder() {
        return this.userData && this.userData.Name ? this.userData.Name : 'New Username'
      }
    },
    data() {
      return {
        user: false,
        useremail: null,
        newPassword: '',
        friendsEmail: '',
        friendExists: '',
        friendUsername:'',
        searchedPressed: false,
        isMyself: false,
        isAlreadyFriend: false,
        SendRequestPage: true,
        PendingRequestPage: false,
        RequestEmail: [],
        RequestNames:[],
        newFriendsEmail:[],
        newFriendsName:[],
      }
    },
    async mounted() {
      const auth = getAuth()
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.user = user
          this.useremail = auth.currentUser.email
        }
      })
    },
  
    methods: {
      async fetchData(friendsEmail) {
        this.searchedPressed = true;
        try {
          const docRef = doc(db, 'Users', friendsEmail);
          const docSnap = await getDoc(docRef);
          const docRef2 = doc(db, 'Friends', this.useremail);
          const docSnap2 = await getDoc(docRef2);
          if (docSnap.exists()) {
            this.friendExists = true;
            this.friendUsername = docSnap.data().Name;
            if (friendsEmail == this.useremail) {
                this.isMyself = true;
            } else {
                this.isMyself = false;
            }
            if (docSnap2.data().Friends.includes(friendsEmail)){
                this.isAlreadyFriend = true; 
            } else {
                this.isAlreadyFriend = false;
            }
          } else {
            this.friendExists = false;
            this.isAlreadyFriend = false;
            this.isMyself = false; 
          }
        } catch (error) {
          console.error('Error fetching user:', error)
        }
      },
      handleInputChange() {
        if(this.friendsEmail ==='') {
            this.searchedPressed = false;
            this.isAlreadyFriend = false;
            this.isMyself = false; 
        }
    },
    async sendRequest(friendsEmail) {
        //update the user's pending acceptance list
        const docRef1 = doc(db, 'Friends', this.useremail);
        const docSnap1 = await getDoc(docRef1)
        const oldCopy1 = docSnap1.data().PendingAcceptance;
        oldCopy1.push(friendsEmail);
        await updateDoc(docRef1,{PendingAcceptance: oldCopy1});

        const docRef2 = doc(db, 'Friends', friendsEmail);
        const docSnap2 = await getDoc(docRef2);
        const oldCopy2 = docSnap2.data().IncomingRequests;
        oldCopy2.push(this.useremail);
        await updateDoc(docRef2,{IncomingRequests: oldCopy2});

        this.friendsEmail = '';
        this.handleInputChange()

    },
    async changeToPendingRequest() {
        this.SendRequestPage = false;
        this.PendingRequestPage = true;

        this.RequestEmail=[];
        this.RequestNames=[];
        this.newFriendsEmail=[];
        this.newFriendsName= [];

        const DocRef = doc(db, 'Friends', this.useremail);
        const docSnap = await getDoc(DocRef);
        this.RequestEmail = docSnap.data().IncomingRequests;
        for (const email of this.RequestEmail) {
            const DocRef2 = doc(db, 'Users', email);
            const docSnap2 =  await getDoc(DocRef2);
            this.RequestNames.push(docSnap2.data().Name);
        }  
        this.newFriendsEmail = docSnap.data().NewFriends;
        for (const email of this.newFriendsEmail) {
            const DocRef3 = doc(db, 'Users', email);
            const docSnap3 =  await getDoc(DocRef3);
            this.newFriendsName.push(docSnap3.data().Name);
        }

    },

    changeToSendRequest(){
        this.SendRequestPage = true;
        this.PendingRequestPage = false;
    },
    async acceptFriend(email) {
        const DocRef = doc(db, 'Friends', this.useremail);
        const docSnap = await getDoc(DocRef);
        
        const Friends = docSnap.data().Friends;
        Friends.push(email);
        await updateDoc(DocRef, {Friends: Friends});
        const newFriends = docSnap.data().NewFriends;
        
        newFriends.push(email);
        await updateDoc(DocRef, {Friends: Friends});
        await updateDoc(DocRef, {NewFriends: newFriends});

        const IncomingRequestsUpdated = docSnap.data().IncomingRequests.filter(item => item !== email);
        await updateDoc(DocRef, {IncomingRequests: IncomingRequestsUpdated});

        const DocRef2 = doc(db, 'Friends', email);
        const docSnap2 = await getDoc(DocRef2);
        const Friends2 = docSnap2.data().Friends;
        Friends2.push(this.useremail);

        const newFriends2 = docSnap2.data().NewFriends;
        newFriends2.push(this.useremail);
        await updateDoc(DocRef2, {Friends: Friends2});
        await updateDoc(DocRef2, {NewFriends: newFriends2});
        
        const PendingAcceptanceUpdated = docSnap2.data().PendingAcceptance.filter(item => item !== this.useremail);
        await updateDoc(DocRef2, {PendingAcceptance: PendingAcceptanceUpdated});



        const index = this.RequestEmail.indexOf(email);
        if( index != -1) {
            this.RequestEmail.splice(index,-1);
        }
        this.changeToPendingRequest();
    },
    async declineFriend(email) {
        //remove from my incoming requests
        const DocRef = doc(db, 'Friends', this.useremail);
        const docSnap = await getDoc(DocRef);
        const IncomingRequestsUpdated = docSnap.data().IncomingRequests.filter(item => item !== email);
        await updateDoc(DocRef, {IncomingRequests: IncomingRequestsUpdated});

        //remove from their pending acceptance
        const DocRef2 = doc(db, 'Friends', email);
        const docSnap2 = await getDoc(DocRef2);
        const PendingAcceptanceUpdated = docSnap2.data().PendingAcceptance.filter(item => item !== this.useremail);
        await updateDoc(DocRef2, {PendingAcceptance: PendingAcceptanceUpdated});
        this.changeToPendingRequest();
    },
    async dismiss() {
        const DocRef = doc(db, 'Friends', this.useremail);
        await updateDoc(DocRef, {NewFriends: []});
        this.changeToPendingRequest();
    }
    }
  }
  </script>

<style>
#btnSend {
    margin-right: 10px;
}

#btnPending, #btnSendReq {
    margin-left: 10px;
}
.incomingRequestTable, 
.acceptedRequestTable {
  width: 100%;
  border-collapse: collapse;
}

.incomingRequestTable th,
.incomingRequestTable td,
.acceptedRequestTable th,
.acceptedRequestTable td{
  padding: 8px;
  border-bottom: 1px solid #ccc;
}

.incomingRequestTable th, 
.acceptedRequestTable th {
  font-weight: bold;
  text-align: left;
}
.acceptBtn {
    color: rgb(0, 180, 161);
}
.declineBtn{
    color:rgb(186, 50, 83);
}
.dismissBtn{
    color: #ffc665
}
</style>
