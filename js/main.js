var fullNameInput = document.getElementById("fullName");
var phoneInput = document.getElementById("phone");
var emailInput = document.getElementById("email");
var addressInput = document.getElementById("address");
var groupInput = document.getElementById("group");
var noteInput = document.getElementById("note");
var favoriteInput = document.getElementById("favorite");
var emergencyInput = document.getElementById("emergency");
var addBtn = document.getElementById("add");
var updateBtn = document.getElementById("update-btn");
var modalCloseBtn = document.getElementById("modal-close");
var modalCancelBtn = document.getElementById("modal-cancel");
var modal = document.getElementById("exampleModal");
var container = document.getElementById("contacts-container");
var totalCount = document.getElementById("total-count");
var favoriteCount = document.getElementById("favorite-count");
var emergencyCount = document.getElementById("emergency-count");
var favContainer = document.getElementById("fav-container");
var emeContainer = document.getElementById("eme-container");
var searchInput = document.getElementById("search-bar");


var contactIndexToUpdate = -50;
var myModal = new bootstrap.Modal(modal);

var patterns = {
  name: /^[a-zA-Z\s]{2,50}$/,
  phone: /^((\+2)|(2)|)01(0|1|2|5)\d{8}$/,
  email: /^(([a-z0-9]+@[a-z]+\.[a-z]+)|())$/,
};

var contacts = [];
var favoriteContacts = [];
var emergencyContacts = [];

// * assign the local storage array to the contacts array and display the contacts
if (JSON.parse(localStorage.getItem("contacts")) != false) {
  contacts = JSON.parse(localStorage.getItem("contacts"));
  displayContacts(contacts);
}

// * clear the form when the modal is closed
modalCloseBtn.addEventListener("click", clearForm);
modalCancelBtn.addEventListener("click", clearForm);

// * real time validation
fullNameInput.addEventListener("input", () => {
  inputValidation(fullNameInput, patterns.name);
});
phoneInput.addEventListener("input", () => {
  inputValidation(phoneInput, patterns.phone);
});
emailInput.addEventListener("input", () => {
  inputValidation(emailInput, patterns.email);
});

// * update stats
updateStats();

// * run the addContact function when the add button is clicked
addBtn.addEventListener("click", addContact);

// * run the updated function when the update button is clicked
updateBtn.onclick = () => {
  updateContact(contactIndexToUpdate);
};

// * run the search function while typing in the input
searchInput.oninput = searchContacts;

function inputValidation(input, pattern) {
  if (pattern.test(input.value)) {
    input.classList.remove("border-danger");
    input.nextElementSibling.classList.replace("d-block", "d-none");
    return true;
  } else {
    input.classList.add("border-danger");
    input.nextElementSibling.classList.replace("d-none", "d-block");
    return false;
  }
}

function formValidation(index) {
  var name = inputValidation(fullNameInput, patterns.name);
  var phone = inputValidation(phoneInput, patterns.phone);
  var email = inputValidation(emailInput, patterns.email);

  for (var i = 0; i < contacts.length; i++) {
    if (phoneInput.value == contacts[i].phone && index !== i) {
      Swal.fire({
        title: "Duplicate Phone Number",
        text: `A contact with this phone number already exists: ${contacts[i].name}`,
        icon: "error",
      });
      phone = false;
      break;
    }
  }

  return name && phone && email;
}

function clearForm() {
  fullNameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
  addressInput.value = "";
  groupInput.value = "";
  noteInput.value = "";
  favoriteInput.checked = false;
  emergencyInput.checked = false;
}

function saveToLocalStorage() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function addContact() {
  var isValid = formValidation();

  if (isValid) {
    var contact = {
      name: fullNameInput.value,
      phone: phoneInput.value,
      email: emailInput.value,
      address: addressInput.value,
      group: groupInput.value,
      note: noteInput.value,
      favorite: favoriteInput.checked,
      emergency: emergencyInput.checked,
    };

    contacts.push(contact);
    saveToLocalStorage();
    clearForm();
    Swal.fire({
      title: "Added",
      text: "Contact has been added successfully!",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
    myModal.hide();
    displayContacts(contacts);
    updateStats();
  } else if (fullNameInput.value === "") {
    Swal.fire({
      title: "Missing Name",
      text: "Please enter a name for the contact!",
      icon: "error",
    });
  } else if (phoneInput.value === "") {
    Swal.fire({
      title: "Missing Phone",
      text: "Please enter a phone number!",
      icon: "error",
    });
  }
}

function displayContacts(list) {
  var collector = "";
  container.innerHTML = "";
  for (let i = 0; i < list.length; i++) {
    collector += `
                <div class="col-12 col-sm-6">
              <div class="card contact-card border shadow-sm h-100">
                <div class="card-body p-3">
                  <!-- Header -->
                  <div class="d-flex align-items-start gap-3 mb-3">
                    <div class="avatar-initials av-purple d-flex align-items-center justify-content-center">
                      ${list[i].name
                        .split(" ")
                        .map((x) => x.slice(0, 1))
                        .join("")
                        .toUpperCase()}

                        ${
                          list[i].favorite
                            ? `<span
                        class="badge-dot badge-dot-amber d-flex align-items-center justify-content-center position-absolute">
                        <i class="fa-solid fa-star"></i>
                      </span>`
                            : ``
                        }
                        ${
                          list[i].emergency
                            ? `<span
                        class="badge-dot badge-dot-red d-flex align-items-center justify-content-center position-absolute">
                        <i class="fa-solid fa-heart-pulse"></i>
                      </span>`
                            : ``
                        }
                      
                    </div>
                    <div>
                      <div class="contact-name">${list[i].name}</div>
                      <div class="contact-phone d-flex align-items-center gap-1 mt-1">
                        <i class="fa-solid fa-phone" style="font-size:12px;"></i> ${list[i].phone}
                      </div>
                    </div>
                  </div>
                  <!-- Details -->
                  <div class="contact-detail d-flex align-items-center gap-2 mb-2">
                    <i class="fa-solid fa-envelope" style="width:14px; font-size:12px;"></i> ${list[i].email}
                  </div>
                  <div class="contact-detail d-flex align-items-center gap-2 mb-2">
                    <i class="fa-solid fa-location-dot" style="width:14px; font-size:12px;"></i> ${list[i].address}
                  </div>
                  <!-- Tags -->
                  <div class="d-flex flex-wrap gap-2 mt-2 mb-3">
                    <span class="tag tag-friends">${list[i].group}</span>
                    ${
                      list[i].emergency
                        ? `<span class="tag tag-emergency d-flex align-items-center gap-1">
                      <i class="fa-solid fa-heart-pulse" style="font-size:9px;"></i> Emergency
                    </span>`
                        : ``
                    }
                  </div>
                  <!-- Actions -->
                  <div class="card-divider pt-2 d-flex align-items-center justify-content-between">
                    <div class="d-flex gap-2">
                      <a href="tel:${list[i].phone}"><button class="act-btn act-btn-call"><i class="fa-solid fa-phone"></i></button></a>
                      <a href="mailto:${list[i].email}"><button class="act-btn act-btn-mail"><i class="fa-solid fa-envelope"></i></button></a>
                    </div>
                    <div class="d-flex gap-1">
                      <button onclick="toggleFavorite(${i})" class="act-btn"><i class="${list[i].favorite ? `fa-solid fa-star" style="color: rgb(255, 212, 59);` : `fa-regular fa-star`}"></i></button>
                      <button onclick="toggleEmergency(${i})" class="act-btn ${list[i].emergency ? `act-btn-heart-active` : `act-btn-heart`}"><i class="fa-solid fa-heart-pulse"></i></button>
                      <button onclick="updateForm(${i})" class="act-btn"><i class="fa-solid fa-pen"></i></button>
                      <button onclick="deletionAlert(${i})" class="act-btn act-btn-del"><i class="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    `;
    container.innerHTML = collector;
  }
}

function deletionAlert(index) {
  Swal.fire({
    title: "Delete Contact?",
    text: `Are you sure you want to delete ${contacts[index].name}? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#929292",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteContact(index);
      Swal.fire({
        title: "Deleted!",
        text: "The contact has been deleted successfully.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

function deleteContact(index) {
  contacts.splice(index, 1);
  saveToLocalStorage();
  displayContacts(contacts);
  updateStats();
}

function updateStats() {
  var fav = 0;
  var eme = 0;
  var favCollector = "";
  var emeCollector = "";
  favoriteContacts = [];
  emergencyContacts = [];

  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].favorite) {
      fav += 1;
      favoriteContacts.push(contacts[i]);

      favCollector += `
                      <div class="side-contact d-flex align-items-center justify-content-between px-3 py-2">
                <div class="d-flex align-items-center gap-2">
                  <div class="side-avtr av-purple d-flex align-items-center justify-content-center rounded-3">${contacts[
                    i
                  ].name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")
                    .toUpperCase()}</div>
                  <div>
                    <div class="side-name">${contacts[i].name}</div>
                    <div class="side-phone">${contacts[i].phone}</div>
                  </div>
                </div>
                <a href="tel:${contacts[i].phone}"><button class="call-btn call-btn-green"><i class="fa-solid fa-phone"></i></button></a>
              </div>
      `;
    }
    if (contacts[i].emergency) {
      eme += 1;
      emergencyContacts.push(contacts[i]);

      emeCollector += `
                      <div class="side-contact d-flex align-items-center justify-content-between px-3 py-2">
                <div class="d-flex align-items-center gap-2">
                  <div class="side-avtr av-purple d-flex align-items-center justify-content-center rounded-3">${contacts[
                    i
                  ].name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")
                    .toUpperCase()}</div>
                  <div>
                    <div class="side-name">${contacts[i].name}</div>
                    <div class="side-phone">${contacts[i].phone}</div>
                  </div>
                </div>
                <a href="tel:${contacts[i].phone}"><button class="call-btn call-btn-red"><i class="fa-solid fa-phone"></i></button></a>
              </div>
      `;
    }
  }

  favContainer.innerHTML = favCollector;
  emeContainer.innerHTML = emeCollector;

  totalCount.textContent = contacts.length;
  favoriteCount.textContent = fav;
  emergencyCount.textContent = eme;

  if (favoriteContacts == false) {
    favContainer.innerHTML = `<p class="pt-3 pb-2 text-center text-secondary fs-14">No favorites yet.</p>`;
  }

  if (emergencyContacts == false) {
    emeContainer.innerHTML = `<p class="pt-3 pb-2 text-center text-secondary fs-14">No emergency yet.</p>`;
  }
}

function updateContact(index) {
  var isValid = formValidation(index);

  if (isValid) {
    contacts[index].name = fullNameInput.value;
    contacts[index].phone = phoneInput.value;
    contacts[index].email = emailInput.value;
    contacts[index].address = addressInput.value;
    contacts[index].group = groupInput.value;
    contacts[index].note = noteInput.value;
    contacts[index].favorite = favoriteInput.checked;
    contacts[index].emergency = emergencyInput.checked;
    updateBtn.classList.replace("d-block", "d-none");
    addBtn.classList.replace("d-none", "d-block");
    saveToLocalStorage();
    clearForm();
    myModal.hide();
    Swal.fire({
      title: "Updated",
      text: "Contact has been updated successfully!",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
    displayContacts(contacts);
    updateStats();
  } else if (fullNameInput.value === "") {
    Swal.fire({
      title: "Missing Name",
      text: "Please enter a name for the contact!",
      icon: "error",
    });
  } else if (phoneInput.value === "") {
    Swal.fire({
      title: "Missing Phone",
      text: "Please enter a phone number!",
      icon: "error",
    });
  }
}

function updateForm(index) {
  contactIndexToUpdate = index;
  myModal.show();
  fullNameInput.value = contacts[index].name;
  phoneInput.value = contacts[index].phone;
  emailInput.value = contacts[index].email;
  addressInput.value = contacts[index].address;
  groupInput.value = contacts[index].group;
  noteInput.value = contacts[index].note;
  favoriteInput.checked = contacts[index].favorite;
  emergencyInput.checked = contacts[index].emergency;
  addBtn.classList.replace("d-block", "d-none");
  updateBtn.classList.replace("d-none", "d-block");
}

function searchContacts() {
  var searchTerm = searchInput.value.trim().toLowerCase();
  var contact;
  var list = [];
  for (var s = 0; s < contacts.length; s++) {
    contact = contacts[s];
    if (
      contact.name.trim().toLowerCase().includes(searchTerm) ||
      contact.phone.trim().includes(searchTerm) ||
      contact.email.trim().toLowerCase().includes(searchTerm)
    ) {
      list.push(contact);
    }
  }

  displayContacts(list);
}

function toggleFavorite(index) {
  if (contacts[index].favorite) {
    contacts[index].favorite = false;
    displayContacts(contacts);
    saveToLocalStorage();
    updateStats();
    
  } else {
    contacts[index].favorite = true;
    displayContacts(contacts);
    saveToLocalStorage();
    updateStats();
  }
}

function toggleEmergency(index) {
  if (contacts[index].emergency) {
    contacts[index].emergency = false;
    displayContacts(contacts);
    saveToLocalStorage();
    updateStats();
    
  } else {
    contacts[index].emergency = true;
    displayContacts(contacts);
    saveToLocalStorage();
    updateStats();
  }
}