(function () {
  let DB;
  const listadoClientes = document.querySelector("#listado-clientes");

  document.addEventListener("DOMContentLoaded", () => {
    crearDB();

    if (window.indexedDB.open("clientes", 1)) {
      listarClientes();
    }

    listadoClientes.addEventListener("click", eliminarRegistro);
  });
  // eliminar registro

  function eliminarRegistro(e) {
    if (e.target.classList.contains("eliminar")) {
      const idEliminar = Number(e.target.dataset.cliente);

      const confirmar = confirm("deseas eliminar este cliente?");

      console.log(confirmar);

      if (confirmar) {
        const transaction = DB.transaction(["clientes"], "readwrite");
        const objectStore = transaction.objectStore("clientes");

        objectStore.delete(idEliminar);

        transaction.oncomplete = function () {
          e.target.parentElement.parentElement.remove();
        };

        transaction.onerror = function () {};
      }
    }
  }

  // CREAR LA BASE DE DATOS DE INDEXdb

  function crearDB() {
    const crearDB = window.indexedDB.open("clientes", 1);

    crearDB.onerror = () => {
      console.log("hubo un error");
    };

    crearDB.onsuccess = function () {
      console.log("DB creada");

      DB = crearDB.result;
    };

    crearDB.onupgradeneeded = function (e) {
      const db = e.target.result;
      const objectStore = db.createObjectStore("clientes", {
        keyPath: "id",
        autoIncrement: true,
      });

      objectStore.createIndex("nombre", "nombre", { unique: false });
      objectStore.createIndex("correo", "correo", { unique: true });
      objectStore.createIndex("telefono", "telefono", { unique: false });
      objectStore.createIndex("empresa", "empresa", { unique: false });
      objectStore.createIndex("id", "id", { unique: true });

      console.log("DB lista y creada");
    };
  }

  function listarClientes() {
    // abrir conexion
    const abrirConexion = window.indexedDB.open("clientes", 1);

    abrirConexion.onerror = function () {
      console.log("hubo un error");
    };

    // const objectStore = DB.transaction("clientes").objectStore("clientes")

    abrirConexion.onsuccess = function (e) {
      DB = abrirConexion.result;

      const objectStore = DB.transaction("clientes").objectStore("clientes");

      objectStore.openCursor().onsuccess = function (e) {
        const cursor = e.target.result;
        if (cursor) {
          const { nombre, correo, telefono, empresa, id } = cursor.value;
          listadoClientes.innerHTML += `
           <tr>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
              <p class="text-sm leading-10 text-gray-700"> ${correo} </p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
              <p class="text-gray-700">${telefono}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
              <p class="text-gray-600">${empresa}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
              <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
          </td>
      </tr>
  `;

          // const table = document.createElement("tr");
          // const tNombre = document.createElement("td");
          // tNombre.textContent = nombre;

          // const tCorreo = document.createElement("td");
          // tCorreo.textContent = correo;

          // const tTelefono = document.createElement("td");
          // tTelefono.textContent = telefono;

          // const tEmpresa = document.createElement("td");
          // tEmpresa.textContent = empresa;

          // const tId = document.createElement("td");
          // tId.textContent = id;

          // table.appendChild(tNombre);
          // table.appendChild(tCorreo);
          // table.appendChild(tTelefono);
          // table.appendChild(tEmpresa);
          // table.appendChild(tId);

          // document.querySelector("#listado-clientes").appendChild(table);

          cursor.continue();
        }

        // if (cursor) {
        //   const { nombre, propietario, telefono, fecha, hora, sintomas, id } =
        //     cursor.value;

        //   ve al siguiente elemento

        //   cursor.continue();
        // }
      };
    };
  }
})();
