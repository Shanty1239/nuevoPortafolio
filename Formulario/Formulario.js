const registros = [];
const formulario = document.getElementById('registro');
const tabla = document.querySelector("#tabla_datos tbody");

formulario.addEventListener('submit', function (e) {
  e.preventDefault();

  const nombres = document.getElementById('nombre').value.trim();
  const apellidos = document.getElementById('apellido').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const tipoDocumento = document.getElementById('identificacion').value;
  const documento = document.getElementById('n_documento').value.trim();
  const correo = document.getElementById('c_electronico').value.trim();
  const fechaNacimiento = document.getElementById('f_nacimiento').value;
  const genero = document.querySelector('input[name="genero"]:checked')?.value;

  if (!nombres || !apellidos || !telefono || tipoDocumento === "Selecciona una opción..." ||
      !documento || !correo || !fechaNacimiento || !genero) {
    Swal.fire({
      icon: 'error',
      title: 'Campos incompletos',
      text: 'Por favor llena todos los campos antes de continuar',
      confirmButtonColor: '#007aff'
    });
    return;
  }

  const nuevoRegistro = {
    item: Date.now() + Math.random() * 1000,
    nombres,
    apellidos,
    telefono,
    tipoDocumento,
    documento,
    correo,
    fechaNacimiento,
    genero
  };

  registros.push(nuevoRegistro);
  agregarFila(nuevoRegistro);

  Swal.fire({
    icon: 'success',
    title: 'Registro exitoso',
    text: 'Tus datos han sido guardados correctamente',
    confirmButtonColor: '#007aff'
  });

  formulario.reset();
});

function agregarFila(registro) {
  const fila = document.createElement('tr');
  fila.setAttribute("data-id", registro.item);

  fila.innerHTML = `
    <td>${registro.item}</td>
    <td>${registro.nombres}</td>
    <td>${registro.apellidos}</td>
    <td>${registro.telefono}</td>
    <td>${registro.tipoDocumento}</td>
    <td>${registro.documento}</td>
    <td>${registro.correo}</td>
    <td>${registro.fechaNacimiento}</td>
    <td>${registro.genero}</td>
    <td>
      <button onclick='editarRegistro(${registro.item})'>Editar</button>
      <button onclick='eliminarRegistro(${registro.item})'>Eliminar</button>
    </td>
  `;
  tabla.appendChild(fila);
}

function eliminarRegistro(id) {
  const index = registros.findIndex(r => r.item === id);
  if (index !== -1) {
    registros.splice(index, 1);
    document.querySelector(`tr[data-id='${id}']`).remove();
  }
}

function editarRegistro(id) {
  const registro = registros.find(r => r.item === id);
  if (!registro) return;

  
  document.getElementById('nombre').value = registro.nombres;
  document.getElementById('apellido').value = registro.apellidos;
  document.getElementById('telefono').value = registro.telefono;
  document.getElementById('identificacion').value = registro.tipoDocumento;
  document.getElementById('n_documento').value = registro.documento;
  document.getElementById('c_electronico').value = registro.correo;
  document.getElementById('f_nacimiento').value = registro.fechaNacimiento;
  document.querySelector(`input[name="genero"][value="${registro.genero}"]`).checked = true;

 
  eliminarRegistro(id);
}


