<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import Swal from 'sweetalert2';

const store = useUserStore();
const showModal = ref(false);
const isEditing = ref(false);
const form = ref({ id: null, name: '', username: '', email: '', phone: '' });

onMounted(async () => {
  store.loading = true;
  await store.fetchUsers();

  setTimeout(() => {
    store.loading = false;
  }, 1500);
});

const openCreate = () => {
  isEditing.value = false;
  form.value = { id: null, name: '', username: '', email: '', phone: '' };
  showModal.value = true;
};

const openEdit = (user) => {
  isEditing.value = true;
  form.value = { ...user };
  showModal.value = true;
};

const saveUser = () => {
  const nameRegex = /^[A-Za-z\s]{1,50}$/
  const usernameRegex = /^[A-Za-z._]{1,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{9}$/

  if (!nameRegex.test(form.value.name)) {
    Swal.fire('Error', 'Nombre inválido', 'error');
    return;
  }

  if (!usernameRegex.test(form.value.username)) {
    Swal.fire('Error', 'Username inválido', 'error');
    return;
  }

  if (!emailRegex.test(form.value.email)) {
    Swal.fire('Error', 'Email inválido', 'error');
    return;
  }

  if (!phoneRegex.test(form.value.phone)) {
    Swal.fire('Error', 'Teléfono inválido (9 dígitos)', 'error');
    return;
  }

  if (isEditing.value) {
    store.updateUser(form.value);
  } else {
    store.addUser(form.value);
  }

  showModal.value = false;
  Swal.fire('Éxito', 'Usuario guardado', 'success');
};

const confirmDelete = (id) => {
  Swal.fire({
    title: '¿Eliminar usuario?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar'
  }).then((result) => {
    if (result.isConfirmed) {
      store.deleteUser(id);
      Swal.fire('Eliminado', '', 'success');
    }
  });
};
</script>

<template>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <div class="header-crud">
      <div class="title-group">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 15 15" class="title-crud"> <path d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z" fill="currentColor"></path>
        </svg>
        <h1 class="title-crud">CRUD DE USUARIOS VUE</h1>
      </div>
      <button class="buttonAgregar" @click="openCreate">
        <span class="transition"></span>
        <span class="gradient"></span>
        <span class="material-icons">add_circle_outline</span>
        <span class="label">Agregar Usuario</span>
      </button>
    </div>

    <div v-if="store.loading" class="loader-container">
      <div class="spinner">
        <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div>    
      </div>
    </div>

    <table v-else class="table-crud">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Username</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in store.users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>
            <button class="buttonEditar" @click="openEdit(user)">
              <span class="transition"></span>
              <span class="gradient"></span>
              <span class="material-icons">edit</span>
            </button>
            <button class="buttonEliminar" @click="confirmDelete(user.id)">
              <span class="transition"></span>
              <span class="gradient"></span>
              <span class="material-icons">delete</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="container-modal">
      <div class="modal-content">
        <h2 class="title-modal">{{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
        <form @submit.prevent="saveUser">
          <input v-model="form.name" placeholder="Nombre" required />
          <input v-model="form.username" placeholder="Username" required />
          <input v-model="form.email" placeholder="Email" type="email" required />
          <input v-model="form.phone" placeholder="Teléfono" required />
          <div style="margin-top: 10px;">
            <button type="submit" class="buttonGuardar">
              <span class="transition"></span>
              <span class="gradient"></span>
              <span class="label">Guardar</span>
            </button>

            <button type="button" class="buttonCancelar" @click="showModal = false">
              <span class="transition"></span>
              <span class="gradient"></span>
              <span class="label">Cancelar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
</template>

<style scoped>

/* Tabla */
.table-crud {
  width: 100%;
  border-collapse: collapse;
  font-family: "Verdana", sans-serif;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.table-crud thead {
  background: #f3f4f6;
}

.table-crud th {
  text-align: left;
  padding: 12px;
  font-weight: bold;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.table-crud td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}
.table-crud tbody tr:hover {
  background: #f9fafb;
}


/*Diseño Modal*/
.container-modal {
  border: solid 1px #8d8d8d;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;

  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; 
  align-items: center; 
  justify-content: center;
}
.modal-content { 
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: white; 
  width: 300px;
  border-radius: 20px;
  margin-bottom: 20px;
}
input {
  font-size: 1rem;
  border-radius: 8px;
  border: solid 1px #8d8d8d;
  letter-spacing: 1px;

  display: block;
  margin-bottom: 10px;
  width: 90%;
  padding: 10px;
  margin-bottom: 20px;
}
.title-modal{
 font-size: 22px;
 font-weight: bold;
 margin: 7px;
}


/*Diseño Botones*/
button {
  font-size: 15px;
  padding: 1em 2.7em;
  font-weight: 500;
  background: #1f2937;
  color: white;
  border: none;
  position: relative;
  overflow: hidden;
  border-radius: 0.6em;
  cursor: pointer;
}
.buttonAgregar {
  background: #023d7f;
  color: white;
  padding: 0.7em 0.8em;
  border-radius: 0em;
  font-family: "Verdana", sans-serif;
  display: flex;
  align-items: center;
  gap: 6px; 
}
.buttonEditar {
  background: #1b5ed1;
  color: white;
  padding: 0.7em 1em;
  margin-right: 5%;
}
.buttonEliminar {
  background: #e02424;
  color: white;
  padding: 0.7em 1em;
  margin-right: 5%;
}
.buttonGuardar {
  background: #1b5ed1;
  color: white;
  padding: 1em 2em;
  margin-right: 5%;
}
.buttonCancelar {
  background: #6e7881;
  color: white;
  padding: 1em 2em;
}

.gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  border-radius: 0.6em;
  margin-top: -0.25em;
  background-image: linear-gradient(
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.3)
  );
}

.transition {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 500ms;
  background-color: rgba(16, 185, 129, 0.6);
  border-radius: 9999px;
  width: 0;
  height: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

button:hover .transition {
  width: 14em;
  height: 14em;
}

button:active {
  transform: scale(0.97);
}


/*Titulo*/
.title-crud{
 font-family: "Verdana", sans-serif;
 font-size: 20px;
 font-weight: 500;
 color:white;
 z-index: 2;
 margin: 0;
 font-weight: bold;
}
.title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.header-crud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #3fd5c0;
  padding: 15px 20px;
  margin-bottom: 30px;
}
.table-crud th {
  font-size: 14px;
  text-transform: uppercase;
}


/*Loader*/
.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  position: relative;
  width: 40px;
  height: 40px;
}

.spinner div {
  position: absolute;
  width: 4px;
  height: 12px;
  background: #023d7f;
  left: 50%;
  top: 50%;
  transform-origin: center -10px;
  animation: spinner-fzua35 1.2s linear infinite;
}

.spinner div:nth-child(1) { transform: rotate(0deg); }
.spinner div:nth-child(2) { transform: rotate(36deg); }
.spinner div:nth-child(3) { transform: rotate(72deg); }
.spinner div:nth-child(4) { transform: rotate(108deg); }
.spinner div:nth-child(5) { transform: rotate(144deg); }
.spinner div:nth-child(6) { transform: rotate(180deg); }
.spinner div:nth-child(7) { transform: rotate(216deg); }
.spinner div:nth-child(8) { transform: rotate(252deg); }
.spinner div:nth-child(9) { transform: rotate(288deg); }
.spinner div:nth-child(10) { transform: rotate(324deg); }

@keyframes spinner-fzua35 {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
</style>