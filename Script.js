const DB_KEY = "@ReclameItz:data";
let currentPhoto = "";

// SIMULAÇÃO DE LOGIN
function handleLogin() {
    localStorage.setItem("@ReclameItz:isLogged", "true");
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'block';
    loadComplaints();
}

function logout() {
    localStorage.removeItem("@ReclameItz:isLogged");
    location.reload();
}

// PREVIEW DA IMAGEM
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentPhoto = e.target.result;
            document.getElementById('photoLabel').innerText = "Foto selecionada!";
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// SALVAR RECLAMAÇÃO NO FEED
document.getElementById('complaintForm').onsubmit = (e) => {
    e.preventDefault();
    
    const newEntry = {
        id: Date.now(),
        title: document.getElementById('title').value,
        neighborhood: document.getElementById('neighborhood').value,
        category: document.getElementById('category').value,
        photo: currentPhoto || "https://via.placeholder.com/400x200?text=Sem+Foto",
        status: "Aberto",
        date: new Date().toLocaleDateString()
    };

    const data = JSON.parse(localStorage.getItem(DB_KEY) || "[]");
    data.unshift(newEntry);
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    
    currentPhoto = "";
    document.getElementById('modalOverlay').classList.remove('active');
    loadComplaints();
};

function loadComplaints() {
    const data = JSON.parse(localStorage.getItem(DB_KEY) || "[]");
    const container = document.getElementById('complaintsList');
    
    container.innerHTML = data.map(item => `
        <div class="complaint-card">
            <img src="${item.photo}" class="card-image">
            <div class="card-content">
                <div class="card-header">
                    <span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span>
                    <small>${item.date}</small>
                </div>
                <h3>${item.title}</h3>
                <p style="font-size: 0.85rem; color: #666;"><i class='bx bx-map-pin'></i> ${item.neighborhood}</p>
            </div>
        </div>
    `).join('');
}

// Verificar se já está logado ao abrir
if(localStorage.getItem("@ReclameItz:isLogged")) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'block';
    loadComplaints();
}

// Eventos de modal (mesmos do anterior)
document.getElementById('openModal').onclick = () => document.getElementById('modalOverlay').classList.add('active');
document.getElementById('closeModal').onclick = () => document.getElementById('modalOverlay').classList.remove('active');
