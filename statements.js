  import { getDatabase, ref, child, get, set, update } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAICI6FPCMq970a2mArMLeu89OwAzlf_Ss",
    authDomain: "mock-parliament-statements.firebaseapp.com",
    databaseURL: "https://mock-parliament-statements-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mock-parliament-statements",
    storageBucket: "mock-parliament-statements.firebasestorage.app",
    messagingSenderId: "931136840418",
    appId: "1:931136840418:web:3dbc4247219b913a49f4bb",
    measurementId: "G-F062WSY1KL"
  };


const app = initializeApp(firebaseConfig); 
const analytics = getAnalytics(app);
let submit = 0


window.submit = async function() {
    const party = document.getElementById('party').value
    const insertP = document.getElementById('pin').value
    const message = document.getElementById('statement').value
    const title = document.getElementById('title').value;
    const reference = document.getElementById('kind').value;
    let password = await getData(party)
    if(password == insertP){
        await writeUserData(message, title, reference, party)
        location.reload();
    }else{
        document.getElementById('fail').innerHTML = "Incorrect Pin. If you forgot it, Contact Zac."
    }
  }

window.screen = async function(){
      const db = await getDatabase();
      let options = ``
  const rf = ref(db);
    if(submit == 0){
    document.getElementById('addsubmithere').innerHTML = `  <div id="submit" class="card p-4 shadow-sm">
    <h4 class="mb-3">Submit a Statement</h4>

    <div class="mb-3">
      <label class="form-label">Select Party</label>
      <select class="form-select" id="party">
        <option value="Adam">Adam Sheridan</option>
        <option value="Dan">Dan Carroll</option>
        <option value="Marcus">Marcus McGloughlin</option>
        <option value="Cameron">Cameron Leighton</option>
        <option value="Walsh">Will Walsh</option>
        <option value="Stevens">Will Stevens</option>
        <option value="Ayaan">Ayaan Gupta</option>
        <option value="Zac">Zachary Cooper</option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">Party-specific PIN</label>
      <input type="password" id="pin" class="form-control" minlength="6" maxlength="6">
    </div>

    <div class="mb-3">
      <label class="form-label">Statement Context</label>
      <select class="form-select" id="kind">
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">Title</label>
      <input type="text" id="title" class="form-control">
    </div>

    <div class="mb-3">
      <label class="form-label">Statement</label>
      <textarea id="statement" class="form-control" rows="3"></textarea>
    </div>

    <button class="btn btn-success" onclick="submit()">Submit</button>
    <p id="fail" class="text-danger mt-2"></p>
  </div>`
  document.getElementById('coolsubmitthing').innerHTML = 'Cancel submit'
  document.getElementById('coolsubmitthing').classList.toggle('btn-primary');
  document.getElementById('coolsubmitthing').classList.toggle('btn-danger');
  await get(child(rf, `reference/amount`)).then(async (snapshot) => {
    if (snapshot.exists()) {
        const value = snapshot.val();
        for(let i = 1; i <= value; i++){
              await get(child(rf, `reference/no${i}`)).then(async (snapshot) => {
            options += `<option value="${snapshot.val()}">${snapshot.val()}</option>`
              })
        }
        document.getElementById('kind').innerHTML = options;
    }
})
submit = 1
}else{
     document.getElementById('addsubmithere').innerHTML = ``
     document.getElementById('coolsubmitthing').innerHTML = 'Submit Statement'
  document.getElementById('coolsubmitthing').classList.toggle('btn-primary');
  document.getElementById('coolsubmitthing').classList.toggle('btn-danger');
  submit = 0
}
}


function getData(data) {
  const dbRef = ref(getDatabase());
  return get(child(dbRef, `users/${data}`)).then((snapshot) => {
    if (snapshot.exists()) {
     return snapshot.val()
    } else {
      return null;
    }
  }).catch((error) => {
    console.error(error);
    return null;
  });
}

async function writeUserData(message, title, reference, party) {
    const db = getDatabase();
    const rf = ref(db);
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    await get(child(rf, `statements/${month}-${day}/amount`)).then(async (snapshot) => {
    if (!snapshot.exists()) {
         get(child(rf, `statements/amount`)).then(async (snapshot) => {
            const value = snapshot.val();
        await update(ref(db), {
        [`statements/amount`]: value + 1
        });
         })
    }
  }).catch((error) => {
    console.error(error);
    return null;
  });
  await get(child(rf, `statements/${month}-${day}/amount`)).then(async (snapshot) => {
    if (snapshot.exists()) {
       const amount = snapshot.val();
await update(ref(db), {
  [`statements/${month}-${day}/amount`]: amount + 1
});
    }else{
await update(ref(db), {
  [`statements/${month}-${day}/amount`]: 1
});
    }
  }).catch((error) => {
    console.error(error);
    return null;
  });
await update(ref(db), {
  [`statements/${month}-${day}/${title}`]: {
    party: party,
    reference: reference,
    statement: message,
    hasbeenai: false
  }
});

}


async function loaddata() {
  const db = await getDatabase();
  const rf = ref(db);
  const currentDate = new Date();
  let output = '';

  for (let i = 0; i < 7; i++) {
    const dateObj = new Date(currentDate);
    dateObj.setDate(currentDate.getDate() - i);
    const day = dateObj.getDate();
    const month = dateObj.getMonth();

    const snapshot = await get(child(rf, `statements/${month}-${day}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      output += `<h1>${month + 1}/${day}</h1><hr>`;


      for (const key in data) {
        if (key === "amount") continue;
        let party = null
        const entry = data[key];
        if(entry.party == "Zac"){
            party = "Zachary Cooper Party"
        }else if(entry.party == "Adam"){
            party = "Adam Sheridan Party"
        }else if(entry.party == "Dan"){
            party = "Dan Carroll Party"
        }else if(entry.party == "Marcus"){
            party = "Marcus McGloughlin Party"
        }else if(entry.party == "Cameron"){
            party = "Cameron Leighton Party"
        }else if(entry.party == "Walsh"){
            party = "William Walsh party"
        }else if(entry.party == "Stevens"){
            party = "William Stevens Party"
        }else if(entry.party == "Ayaan"){
            party = "Ayaan Gupta Party"
        }
        output += `
          <p>${party}</p>
          <h3>${key}</h3>
          <p>${entry.reference}</p>
          <p>${entry.statement}</p><hr>
        `;
      }
    }
  }

  if(output == ''){
  document.getElementById('statements').innerHTML = 'Would You look at that! No statements within the last 7 days...';
  }else{
  document.getElementById('statements').innerHTML = output;
  }
}

loaddata()

