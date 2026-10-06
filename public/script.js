async function loadContacts() {
    try {
        const response = await fetch("/contacts");
        const data = await response.json();

        const tableBody = document.getElementById("contactTableBody");

        tableBody.innerHTML = "";

        data.contacts.forEach((contact, index) => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${contact.name}</td>
                <td>${contact.phone}</td>
                <td>${contact.email}</td>
                <td>
                    <button class="edit-btn"
                        onclick="editContact('${contact._id}', '${contact.name}', '${contact.phone}', '${contact.email}')">
                        Edit
                    </button>

                    <button class="delete-btn"
                        onclick="deleteContact('${contact._id}')">
                        Delete
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading contacts:", error);
    }
}


async function addContact() {

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !phone || !email) {
        alert("Please fill all fields");
        return;
    }

    const contactId = "C" + Date.now();

    try {

        const response = await fetch("/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contactId,
                name,
                phone,
                email
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Error adding contact");
            return;
        }

        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("email").value = "";

        loadContacts();

    } catch (error) {
        console.error(error);
        alert("Server error");
    }
}


async function deleteContact(id) {

    const confirmDelete = confirm("Are you sure you want to delete this contact?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`/contacts/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Error deleting contact");
            return;
        }

        loadContacts();

    } catch (error) {
        console.error(error);
        alert("Server error");
    }
}


async function editContact(id, oldName, oldPhone, oldEmail) {

    const name = prompt("Enter name:", oldName);

    if (name === null) return;

    const phone = prompt("Enter phone:", oldPhone);

    if (phone === null) return;

    const email = prompt("Enter email:", oldEmail);

    if (email === null) return;

    try {

        const response = await fetch(`/contacts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                phone,
                email
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Error updating contact");
            return;
        }

        loadContacts();

    } catch (error) {
        console.error(error);
        alert("Server error");
    }
}


loadContacts();