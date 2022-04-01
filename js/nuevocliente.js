(function () {
  let DB;

  // selectores

  const formulario = document.querySelector("#formulario");

  document.addEventListener("DOMContentLoaded", () => {
    conectarDB();

    formulario.addEventListener("submit", validarCliente);
  });

  function validarCliente(e) {
    e.preventDefault();
    //leer los input
    const nombre = document.querySelector("#nombre").value;
    const correo = document.querySelector("#email").value;
    const telefono = document.querySelector("#telefono").value;
    const empresa = document.querySelector("#empresa").value;

    if (nombre === "" || correo === "" || telefono === "" || empresa === "") {
      imprimirAlerta("Todos los campos son obligatorios", "error");
      return;
    }
    // crear objeto con la informacion
    const cliente = {
      nombre,
      correo,
      telefono,
      empresa,
      id: Date.now(),
    };

    crearNuevoCliente(cliente);
  }

  // agregar nuevo cliente en indexDB
  function crearNuevoCliente(cliente) {
    const transaction = DB.transaction(["clientes"], "readwrite");
    const objectStore = transaction.objectStore("clientes");

    objectStore.add(cliente);

    transaction.onerror = function () {
      imprimirAlerta("Hubo un error", "error");
    };

    transaction.oncomplete = function () {
      imprimirAlerta("Cliente Agregado", "exito");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    };
  }

  function conectarDB() {
    const abrirConexion = window.indexedDB.open("clientes", 1);

    abrirConexion.onerror = function () {
      console.log("hubo un error");
    };

    abrirConexion.onsuccess = function () {
      DB = abrirConexion.result;
    };
  }
})();
