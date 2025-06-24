const citas = [];
let idcontador = 0;
let editandoId = null;

const IMAGENES_MASCOTAS = {
  perros: "./Animales/perro.png",
  gatos: "./Animales/gato.png",
  peces: "./Animales/pez.png",
  pajaros: "./Animales/pajaro.png",
  hamsters: "./Animales/hamsters.png",
  conejos: "./Animales/conejo.png",
  tortugas: "./Animales/tortuga.png",
  lagartos: "./Animales/lagarto.png",
  serpientes: "./Animales/serpienten.png",
};

function guardarcita() {
  const nombre = document.getElementById("nombre").value;
  const dueno = document.getElementById("dueno").value;
  const tel = document.getElementById("tel").value;
  const hrcita = document.getElementById("fecha-hora").value;
  const dolor = document.getElementById("dolor").value;
  const tipo = document.getElementById("tipo").value;
  const estado = document.getElementById("estado").value;

  // Validaciones
  if (!nombre.trim()) {
    Swal.fire({ icon: "warning", title: "Campo requerido", text: "Por favor digite el nombre de su mascota..." });
    return;
  }
  if (!dueno.trim()) {
    Swal.fire({ icon: "warning", title: "Campo requerido", text: "Por favor digite su nombre..." });
    return;
  }
  if (!tel.trim()) {
    Swal.fire({ icon: "warning", title: "Campo requerido", text: "Por favor digite un número telefónico..." });
    return;
  }
  if (!hrcita.trim()) {
    Swal.fire({ icon: "warning", title: "Campo requerido", text: "Por favor seleccione una fecha y hora..." });
    return;
  }
  if (!dolor.trim()) {
    Swal.fire({ icon: "warning", title: "Campo requerido", text: "Por favor digite los síntomas..." });
    return;
  }
  if (!tipo.trim()) {
    Swal.fire({ icon: "warning", title: "Campo requerido", text: "Por favor seleccione el tipo de mascota..." });
    return;
  }

  const imagen = IMAGENES_MASCOTAS[tipo.toLowerCase()];

  // Lógica simplificada para editar vs crear
  if (editandoId !== null) {
    // Editando cita existente
    const index = citas.findIndex(c => c.id === editandoId);
    if (index !== -1) {
      citas[index] = { id: editandoId, nombre, dueno, tel, hrcita, dolor, tipo, imagen, estado };
    }
    editandoId = null;
  } else {
    // Creando nueva cita
    const nuevaCita = { id: idcontador++, nombre, dueno, tel, hrcita, dolor, tipo, imagen, estado };
    citas.unshift(nuevaCita);
  }

  Swal.fire({ icon: "success", title: "¡Cita registrada!", showConfirmButton: false, timer: 1500 });
  limpiar();
  pintarTarjetas();
  cerrarModal();
}

function limpiar() {
  document.getElementById("nombre").value = "";
  document.getElementById("dueno").value = "";
  document.getElementById("tel").value = "";
  document.getElementById("fecha-hora").value = "";
  document.getElementById("dolor").value = "";
  document.getElementById("tipo").value = "";
  document.getElementById("estado").value = "abierta";
  document.getElementById("estado").style.display = "none";
  document.getElementById("estado-label").style.display = "none";
}

function abrirModal() {
  limpiar();
  editandoId = null;
  document.getElementById('imagenmascota').style.display = 'none';
  document.getElementById("modalTabla").style.display = "block";
  fechaHora();
}

function cerrarModal() {
  document.getElementById("modalTabla").style.display = "none";
}

function imagen() {
  const tipo = document.getElementById("tipo").value.toLowerCase();
  const img = document.getElementById("imagenmascota");
  const url = IMAGENES_MASCOTAS[tipo];

  if (url) {
    img.src = url;
    img.style.display = "block";
  } else {
    img.src = "";
    img.style.display = "none";
  }
}

function editarCitaPorId(id) {
  const cita = citas.find(c => c.id === id);
  
  if (cita) {
    // Llenar formulario
    document.getElementById('nombre').value = cita.nombre;
    document.getElementById('dueno').value = cita.dueno;
    document.getElementById('tel').value = cita.tel;
    document.getElementById('fecha-hora').value = cita.hrcita;
    document.getElementById('dolor').value = cita.dolor;
    document.getElementById('tipo').value = cita.tipo;
    document.getElementById('estado').value = cita.estado;

    // Mostrar campos de edición
    document.getElementById('estado').style.display = 'block';
    document.getElementById('estado-label').style.display = 'block';
    
    // Mostrar imagen
    imagen();
    
    // Configurar modo edición
    editandoId = id;
    document.getElementById('modalTabla').style.display = 'block';
  }
}

function filtrarPorNombre() {
  const buscador = document.getElementById("buscador").value.toLowerCase();
  const citasFiltradas = citas.filter(cita =>
    cita.nombre.toLowerCase().includes(buscador)
  );
  pintarTarjetas(citasFiltradas);
}

function fechaHora() {
  const input = document.getElementById("fecha-hora");
  const ahora = new Date();
  ahora.setHours(8, 0, 0, 0);
  const hoyISO = ahora.toISOString().slice(0, 16);
  input.min = hoyISO;

  input.addEventListener("change", () => {
    const fechaHoraSeleccionada = new Date(input.value);
    const hora = fechaHoraSeleccionada.getHours();
    const minutos = fechaHoraSeleccionada.getMinutes();

    if (hora < 8 || hora > 20 || (hora === 20 && minutos > 0)) {
      Swal.fire({
        icon: "warning",
        title: "Hora no válida",
        text: "La hora debe estar entre 08:00 y 20:00.",
      });
      input.value = "";
    }
  });
}

function eliminarCitaPorId(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la cita permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((resultado) => {
    if (resultado.isConfirmed) {
      const index = citas.findIndex(c => c.id === id);
      if (index !== -1) {
        citas.splice(index, 1);
        pintarTarjetas();
        Swal.fire({ icon: 'success', title: 'Cita eliminada', showConfirmButton: false, timer: 1200 });
      }
    }
  });
}

function pintarTarjetas(lista = citas) {
  const contenedor = document.getElementById("card");
  contenedor.innerHTML = "";

  // Filtro por estado
  const filtro = document.getElementById("filtroEstado")?.value?.toLowerCase() || "";
  const citasFiltradas = filtro
    ? lista.filter(c => c.estado.toLowerCase() === filtro)
    : lista;

  citasFiltradas.forEach((cita) => {
    const div = document.createElement("div");
    div.className = "tarjeta";

    div.innerHTML = `
      <img src="${cita.imagen}" alt="${cita.tipo}">
      <h3>${cita.nombre}</h3>
      <p><strong>Num:</strong> ${cita.id}</p>
      <p><strong>Dueño:</strong> ${cita.dueno}</p>
      <p><strong>Tel:</strong> ${cita.tel}</p>
      <p><strong>Fecha:</strong> ${cita.hrcita}</p>
      <p><strong>Síntomas:</strong> ${cita.dolor}</p>
      <p><strong>Tipo:</strong> ${cita.tipo}</p>
      <p><strong>Estado:</strong> ${cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}</p>
      <button class="editar" onclick="editarCitaPorId(${cita.id})">Editar</button>
      <button class="eliminar" onclick="eliminarCitaPorId(${cita.id})">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });
}