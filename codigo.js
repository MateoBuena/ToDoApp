
const IDBrequest = indexedDB.open("Notes", 1);

IDBrequest.addEventListener("upgradeneeded", () => {
    const db = IDBrequest.result;
    db.createObjectStore("note", {
        autoIncrement: true
    });
})

IDBrequest.addEventListener("success", () => {
    readObject();
})

const addObject = object => {
    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("note", "readwrite");
    const objectStore = IDBtransaction.objectStore("note");
    objectStore.add(object);
}

const readObject = () => {
    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("note", "readonly");
    const objectStore = IDBtransaction.objectStore("note");
    const cursor = objectStore.openCursor();
    const fragment = document.createDocumentFragment();
    document.querySelector(".container-notes").innerHTML = "";
    cursor.addEventListener("success", () => {
        if (cursor.result) {
            let Element = createHTML(cursor.result.key, cursor.result.value);
            fragment.appendChild(Element);
            cursor.result.continue();
        } else {
            document.querySelector(".container-notes").appendChild(fragment);
        }
    })
}

const deleteObject = key => {
    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("note", "readwrite");
    const objectStore = IDBtransaction.objectStore("note");
    objectStore.delete(key);
}

const createHTML = (id, Name) => {
    const div = document.createElement("DIV");
    const input = document.createElement("INPUT");
    const h2 = document.createElement("H2");
    const Delete = document.createElement("BUTTON");

    div.classList.add("flex-item-notes");
    input.classList.add("checkbox");
    input.setAttribute("type", "checkbox");
    h2.classList.add("note");
    Delete.classList.add("Delete");

    h2.textContent = Name.nombre;
    Delete.textContent = "Delete";

    div.appendChild(input);
    div.appendChild(h2);
    div.appendChild(Delete);

    Delete.addEventListener("click", () => {
        deleteObject(id);
        document.querySelector(".container-notes").removeChild(div);

    })

    input.addEventListener('change', (e) => {
        (e.target.checked) ? h2.style.textDecorationLine = 'line-through'
            : h2.style.textDecorationLine = 'none';
    })

    return div;
}

document.querySelector(".text").setAttribute("spellcheck", "false");

document.querySelector(".send").addEventListener("click", () => {
    let note = document.querySelector(".text").value;
    addObject({ nombre: note });
    readObject();
    document.querySelector(".text").value = "";
})

document.querySelector(".text").addEventListener("keyup", (e) => {
    if (e.key == 'Enter') {
        addObject({ nombre: e.target.value });
        readObject();
        document.querySelector(".text").value = "";
    }
})

