(function () {
  let DB;
  let idCliente;
  const nombreInput = document.querySelector("#nombre");
  const emailInput = document.querySelector("#email");
  const telefonoInput = document.querySelector("#telefono");
  const empresaInput = document.querySelector("#empresa");

  const formulario = document.querySelector("#formulario");

  document.addEventListener("DOMContentLoaded", () => {
    // //verificar el id de la url
    conectarDB();

    // actualiza el registro
    formulario.addEventListener("submit", actualizarCliente);

    const parametrosURL = new URLSearchParams(window.location.search);
    idCliente = parametrosURL.get("id");

    if (idCliente) {
      setTimeout(() => {
        obtenerCliente(idCliente);
      }, 300);
    }
  });

  function actualizarCliente(e) {
    e.preventDefault();

    if (
      nombreInput.value === "" ||
      emailInput.value === "" ||
      empresaInput.value === "" ||
      telefonoInput.value === ""
    ) {
      imprimirAlerta("Todos los campos son obligatorios", "error");
      return;
    }

    // actualizar cliente

    const clienteActualizado = {
      nombre: nombreInput.value,
      correo: emailInput.value,
      empresa: empresaInput.value,
      telefono: telefonoInput.value,
      id: Number(idCliente),
    };
    const transaction = DB.transaction(["clientes"], "readwrite");
    const objectStore = transaction.objectStore("clientes");
    objectStore.put(clienteActualizado);

    transaction.oncomplete = function () {
      imprimirAlerta("Cliente actualizado", "exito");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    };

    transaction.onerror = function () {
      imprimirAlerta("Ocurrio un error", "error");
    };
  }

  function obtenerCliente(id) {
    const transaction = DB.transaction(["clientes"], "readwrite");
    const objectStore = transaction.objectStore("clientes");

    const cliente = objectStore.openCursor();

    cliente.onsuccess = function (e) {
      const cursor = e.target.result;

      if (cursor) {
        if (cursor.value.id === Number(id)) {
          llenarFormulario(cursor.value);
        }

        cursor.continue();
      }
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

  function llenarFormulario(DatosCliente) {
    const { nombre, correo, telefono, empresa } = DatosCliente;
    nombreInput.value = nombre;
    emailInput.value = correo;
    telefonoInput.value = telefono;
    empresaInput.value = empresa;
  }
})();
