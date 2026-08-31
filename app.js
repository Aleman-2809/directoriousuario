const API_URL = 'https://jsonplaceholder.typicode.com/users';
let allUsers = [];

const renderTable = (users) => {
  const $tbody = $('#usersTable tbody');
  $tbody.empty();

  users.forEach((u) => {
    const row = `
      <tr data-id="${u.id}">
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.company.name}</td>
      </tr>`;
    $tbody.append(row);
  });
};
const loadUsers = async () => {
  try {
    const { data } = await axios.get(API_URL);
    allUsers = data;
    renderTable(allUsers);
    console.log(`✅ Usuarios cargados: ${allUsers.length}`, allUsers[0]);
  } catch (error) {
    console.error('❌ Error cargando usuarios:', error.message);
  }
};


const addUser = async ({ name, email, company }) => {
  try {
    const { data } = await axios.post(API_URL, {
      name,
      email,
      company: { name: company },
    });

    const newUser = {
      ...data,
      id: data.id || Date.now(),
      name,
      email,
      company: { name: company },
      phone: 'No registrado',
      address: { street: 'No registrada', city: 'No registrada' },
    };

    allUsers = [newUser, ...allUsers];
    renderTable(allUsers);
    console.log('🆕 Usuario registrado:', newUser);
  } catch (error) {
    console.error('❌ Error registrando usuario:', error.message);
  }
};

$(document).ready(() => {
  
  console.log('📋 Directorio vacío. Registra usuarios con el formulario.');

  
  $('#addUserForm').on('submit', (e) => {
    e.preventDefault();

    const name = $('#newName').val().trim();
    const email = $('#newEmail').val().trim();
    const company = $('#newCompany').val().trim();

    if (!name || !email || !company) {
      console.error('❌ Todos los campos son obligatorios');
      return;
    }

    addUser({ name, email, company });
    e.target.reset();
  });

  $('#filterInput').on('input', function () {
    const term = $(this).val().toLowerCase();
    const filtered = allUsers.filter((u) => u.name.toLowerCase().includes(term));
    renderTable(filtered);
    console.log(`🔍 Filtro: "${term}" - Coincidencias: ${filtered.length}`);
  });

 
  $('#usersTable tbody').on('click', 'tr', function () {
    const id = $(this).data('id');
    const user = allUsers.find((u) => u.id === id);
    if (!user) return;

    const { phone, address } = user;
    const { street, city } = address;

    $('#userDetail')
      .html(`
        <button id="closeDetail">✕</button>
        <h3>${user.name}</h3>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Dirección:</strong> ${street}, ${city}</p>
      `)
      .removeClass('hidden');

    console.log('👤 Detalle usuario:', user);
  });


  $('#userDetail').on('click', '#closeDetail', () => {
    $('#userDetail').addClass('hidden');
  });
});
