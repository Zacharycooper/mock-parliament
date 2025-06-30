  import { getDatabase, ref, child, get, update, remove } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
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
    if(message == '' || title == ''){
        document.getElementById('fail').innerHTML = "Please fill all the boxes."
        return
    }
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
      if(localStorage.getItem('nerd')){
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
    <hr>
    <button class="btn btn-primary" onclick="references()">Edit References</button>
  </div>`
      }else{
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
  </div>`}
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

window.uploadScreen = async function(){
      document.getElementById('addsubmithere').innerHTML = `  <div id="submit" class="card p-4 shadow-sm">
      <button class="btn btn-primary" onclick="prompt()">Copy Prompt</button>
      <p id="success" class="text-success mt-2"></p>
      <hr>
    <h4 class="mb-3">Upload a response</h4>
    <div class="mb-3">
      <label class="form-label">Response HTML</label>
      <textarea id="response" class="form-control" rows="3"></textarea>
    </div>

    <button class="btn btn-success" onclick="responseSubmit()">Submit</button>
    <p id="fail" class="text-danger mt-2"></p>
    
  </div>`
}

window.prompt = async function(){
fetch('prompt.txt')
  .then(res => res.text())
  .then(text => navigator.clipboard.writeText(text));
document.getElementById('success').innerHTML = 'Copied! Just paste this into chatgpt directly after the most recent POLLS.'
}

window.references = async function(){
        const db = await getDatabase();
      let options = ``
  const rf = ref(db);
  document.getElementById('addsubmithere').innerHTML = `  <div id="submit" class="card p-4 shadow-sm">
    <div class="mb-3">
      <label class="form-label">Delete a reference</label>
      <select class="form-select" id="deletekind">
      </select>
    </div>
    <button class="btn btn-danger" onclick="deleteRef()">Delete reference</button>
    <p id="fail" class="text-danger mt-2"></p>
    <hr>
      <div class="mb-3">
      <label class="form-label">Add a reference</label>
      <input type="text" id="referenceadd" class="form-control" >
    </div>
    <button class="btn btn-success" onclick="addRef()">Add reference</button>
  </div>`

    await get(child(rf, `reference/amount`)).then(async (snapshot) => {
    if (snapshot.exists()) {
        const value = snapshot.val();
        for(let i = 1; i <= value; i++){
              await get(child(rf, `reference/no${i}`)).then(async (snapshot) => {
            options += `<option value="${snapshot.val()}">${snapshot.val()}</option>`
              })
        }
        document.getElementById('deletekind').innerHTML = options;
    }
})
}

window.deleteRef = async function(){
  const db = getDatabase();
  const rf = ref(db);
  const todelete = document.getElementById('deletekind').value.toLowerCase();

  if(todelete === 'general statement'){
    document.getElementById('fail').innerHTML = `You can't delete the "General Statement"`;
    return;
  }

  await remove(ref(db, `reference/${todelete}`));

  const amountSnap = await get(child(rf, `reference/amount`));
  if (!amountSnap.exists()) return;

  let amount = amountSnap.val();
  let foundIndex = -1;

  for (let i = 1; i <= amount; i++) {
    const snap = await get(child(rf, `reference/no${i}`));
    if (snap.exists() && snap.val().toLowerCase() === todelete) {
      foundIndex = i;
      await remove(ref(db, `reference/no${i}`));
      break;
    }
  }

  for (let i = foundIndex + 1; i <= amount; i++) {
    const nextSnap = await get(child(rf, `reference/no${i}`));
    if (nextSnap.exists()) {
      const nextValue = nextSnap.val();
      await update(ref(db), {
        [`reference/no${i - 1}`]: nextValue
      });
      await remove(ref(db, `reference/no${i}`));
    }
  }

  await update(ref(db), {
    'reference/amount': amount - 1
  });
  location.reload()
}

window.addRef = async function() {
  const db = getDatabase();
  const rf = ref(db);
  const toadd = document.getElementById('referenceadd').value;

  const snapshot = await get(child(rf, `reference/amount`));
  let amount = snapshot.exists() ? snapshot.val() : 0;
  amount += 1;

  await update(ref(db), {
    [`reference/amount`]: amount,
    [`reference/no${amount}`]: toadd
  });

  location.reload();
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

async function writeUserData(message, title2, oldReference, party) {
    const db = getDatabase();
    const rf = ref(db);
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    let reference = ''
if (oldReference.includes('(')) {
  reference = oldReference.replace(/\s*\(.*?\)/, "");
}else{
  reference = oldReference
}
const title = escapeHtml(title2)

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

window.responseSubmit = async function() {
  const variable = document.getElementById('response').value
  const db = getDatabase();
  const rf = ref(db);
  const now = new Date();
  const date = `${now.getDate()}${now.getMonth() + 1}`;

  const amtRef = child(rf, `response/amount`);
  const amtRef2 = child(rf, `response/${date}/amount`);

  try {
    const amtSnap = await get(amtRef);
    const newAmount = amtSnap.exists() ? amtSnap.val() + 1 : 1;
    const amtSnap2 = await get(amtRef2);
    const newAmount2 = amtSnap2.exists() ? amtSnap2.val() + 1 : 1;
    await update(ref(db), { "response/amount": newAmount });
    await update(ref(db), { [`response/${date}/amount`]: newAmount2});
    await update(ref(db), { [`response/${date}/${newAmount2}`]: variable });
  } catch (err) {
    console.error(err);
  }
  location.reload()
}

function escapeHtml(str) {
  return str.replace(/&/g, "")
            .replace(/"/g, "")
            .replace(/'/g, "")
            .replace(/</g, "")
            .replace(/>/g, "");
}


async function loaddata() {
if(window.location.pathname.endsWith("statements.html")){
  const db = await getDatabase();
  const rf = ref(db);
  const currentDate = new Date();
  const nerd = localStorage.getItem("nerd");
  let output = '';

  if(!nerd){
  for (let i = 0; i < 7; i++) {
    const dateObj = new Date(currentDate);
    dateObj.setDate(currentDate.getDate() - i);
    const day = dateObj.getDate();
    const month = dateObj.getMonth();

    const snapshot = await get(child(rf, `statements/${month}-${day}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      output += `<h1>${day}/${month + 1}</h1><hr>`;


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
        let ai = '<p class="badge bg-danger text-wrap">This statement has not been put in the ai.</p>'
        if(entry.hasbeenai == true){
        const snapshot = await get(child(rf, `statements/${month}-${day}/${key}/dateai`));
      if (snapshot.exists()) {
        const when = snapshot.val()
        const link = when.replace('/','')
        ai = `<p class="badge bg-success text-wrap">This statement was put into the ai on <b>${when}</b>.</p>`
      }  
      }
        output += `
          <p>${party}</p>
          <h3>${key}</h3>
          <p>${entry.reference}</p>
          <p>${entry.statement}</p>
          ${ai}
          <hr>
        `;
      }
    }
  }

  if(output == ''){
  document.getElementById('statements').innerHTML = 'Would You look at that! No statements within the last 7 days...';
  }else{
  document.getElementById('statements').innerHTML = output;
  }
}else{
    for (let i = 0; i < 7; i++) {
    const dateObj = new Date(currentDate);
    dateObj.setDate(currentDate.getDate() - i);
    const day = dateObj.getDate();
    const month = dateObj.getMonth();

    const snapshot = await get(child(rf, `statements/${month}-${day}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      output += `<h1>${day}/${month + 1}</h1><hr>`;


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
        let button = ''
        if(entry.hasbeenai == false){
          button = `<button class='btn btn-success' onclick="doai('${key}', ${month}, ${day})">Mark as Ai'd</button>`
        }else{
            button = `<button class='btn btn-warning' onclick="noai('${key}', ${month}, ${day})">Remove Ai'd</button>`
        }
        output += `
          <p>${party}</p>
          <h3>${key}</h3>
          <p>${entry.reference}</p>
          <p>${entry.statement}</p>
          ${button}
          <hr>
        `;
      }
    }
  }

  if(output == ''){
  document.getElementById('statements').innerHTML = 'Would You look at that! No statements within the last 7 days...';
  }else{
  document.getElementById('statements').innerHTML = output;
  }
}}else if(window.location.pathname.endsWith("statementResponses.html")){
  const db = await getDatabase();
const rf = ref(db);
const currentDate = new Date();
const nerd = localStorage.getItem("nerd");
let output = '';

for (let i = 0; i < 21; i++) {
  const dateObj = new Date(currentDate);
  dateObj.setDate(currentDate.getDate() - i);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const dateCode = `${day}${month}`; 
  const snapshot = await get(child(rf, `response/${dateCode}`));

  if (snapshot.exists()) {
    const data = snapshot.val();
    const divId = `${dateCode}`;
    let deleteBtn = '';
    const keys = Object.keys(data)
  .filter(k => k !== 'amount')
  .map(Number)
  .sort((a, b) => b - a);

          let i = 1;
      for (const key of keys) {
        if (key === "amount") continue;
        const entry = data[key];
        const content = entry
    if (nerd) {
      deleteBtn = `<button class='btn btn-danger d-flex justify-content-center mb-3' onclick="deleteRes('${divId}','${key}')">Delete Response</button>`;
    }
    output += `<div id="${divId}-${key}">${content}${deleteBtn}</div><hr>`;

    i++;
      
  }}
}

if (!output) {
  output = 'Would You look at that! No responses within the last 21 days...';
}

document.getElementById('statements').innerHTML = output;

}else{
  console.err("Unable to load information (Can't declare loaded webpage)")
}
}

window.deleteRes = async function(id, key){
    const db = await getDatabase();
  const rf = ref(db);
      const snapshot = await get(child(rf, `response/${id}/amount`));
    if (snapshot.exists()) {
      let value = snapshot.val()
      if(value - 1 == 0){
        await remove(ref(db, `response/${id}`))
        const snapshot = await get(child(rf, `response/amount`));
        let value2 = snapshot.val()
        await update(ref(db), {
  [`response/amount`]: value2 - 1})
      }else{
        await update(ref(db), {
  [`response/${id}/amount`]: value - 1
});
  await remove(ref(db, `response/${id}/${key}`));
    }
  }
    location.reload()
}

window.doai = async function(title, month, day) {
    const dateObj = new Date();
  const day2 = dateObj.getDate();
  const month2 = dateObj.getMonth() + 1;
    const db = getDatabase();
try {
await update(ref(db), {
  [`statements/${month}-${day}/${title}/hasbeenai`]: true,
  [`statements/${month}-${day}/${title}/dateai`]: `${day2.toString()}/${month2.toString()}`
});
} catch (err) {
  console.error("Update error:", err);
}
location.reload();
}

window.noai = async function(title, month, day) {
    const db = getDatabase();
try {
await update(ref(db), {
  [`statements/${month}-${day}/${title}/hasbeenai`]: false
});
} catch (err) {
  console.error("Update error:", err);
}
location.reload();
}


loaddata()

