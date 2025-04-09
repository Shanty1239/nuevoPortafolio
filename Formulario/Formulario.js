const registros = [];

const formulario = document.getElementById('registro');

formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombres = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellido').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const tipoDocumento = document.getElementById('identificacion').value;
    const documento = document.getElementById('n_documento').value.trim();
    const correo = document.getElementById('c_electronico').value.trim();
    const fechaNacimiento = document.getElementById('f_nacimiento').value;

    if (
        !nombres || !apellidos || !telefono ||
        tipoDocumento === "Selecciona una opción..." || !documento ||
        !correo || !fechaNacimiento
    ) {
        Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: 'Por favor llena todos los campos antes de continuar',
            confirmButtonColor: '#007aff'
        });
        return;
    }

    const nuevoRegistro = {
        nombres,
        apellidos,
        telefono,
        tipoDocumento,
        documento,
        correo,
        fechaNacimiento
    };

    registros.push(nuevoRegistro);

    console.log("Registro guardado:", nuevoRegistro);
    console.log("Todos los registros:", registros);

    Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tus datos han sido guardados correctamente',
        confirmButtonColor: '#007aff'
    });

    formulario.reset();
});
