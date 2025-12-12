// TripMate - Perencana Perjalanan Mini (Client-side CRUD + localStorage)
// Data disimpan sepenuhnya di browser (Azure SWA friendly).

const defaultActivities = [
  {
    id: 1,
    name: 'Cek-in hotel',
    date: '2025-01-12',
    location: 'Bandung, ID',
    notes: 'Jam 14:00; simpan bukti reservasi di email.'
  },
  {
    id: 2,
    name: 'Kunjungi Farmhouse',
    date: '2025-01-13',
    location: 'Lembang, ID',
    notes: 'Beli tiket online; parkir buka 08:00.'
  },
  {
    id: 3,
    name: 'Kuliner malam',
    date: '2025-01-13',
    location: 'Jl. Braga, Bandung',
    notes: 'Coba mie kocok & es cendol.'
  }
];

const STORAGE_KEY = 'tripmate_activities';
let memoryStorage = null; // fallback jika localStorage tidak tersedia

// State - deklarasi dulu, baru diinisialisasi setelah fungsi didefinisikan
let activities = [];
let nextId = 4;

// Elements - akan diinisialisasi setelah DOM ready
let addActivityForm, activityName, activityDate, activityLocation, activityNotes;
let scheduleList, activityCount;
let filterDate, searchText, clearFilters;
let editModal, editActivityForm, editActivityId, editActivityName, editActivityDate, editActivityLocation, editActivityNotes;
let closeModalBtn, cancelEditBtn;

function initElements() {
  addActivityForm = document.getElementById('addActivityForm');
  activityName = document.getElementById('activityName');
  activityDate = document.getElementById('activityDate');
  activityLocation = document.getElementById('activityLocation');
  activityNotes = document.getElementById('activityNotes');

  scheduleList = document.getElementById('scheduleList');
  activityCount = document.getElementById('activityCount');

  filterDate = document.getElementById('filterDate');
  searchText = document.getElementById('searchText');
  clearFilters = document.getElementById('clearFilters');

  editModal = document.getElementById('editModal');
  editActivityForm = document.getElementById('editActivityForm');
  editActivityId = document.getElementById('editActivityId');
  editActivityName = document.getElementById('editActivityName');
  editActivityDate = document.getElementById('editActivityDate');
  editActivityLocation = document.getElementById('editActivityLocation');
  editActivityNotes = document.getElementById('editActivityNotes');
  closeModalBtn = document.getElementById('closeModalBtn');
  cancelEditBtn = document.getElementById('cancelEditBtn');
}

// Utils
function saveActivities(data) {
  activities = data;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    memoryStorage = null;
  } catch (err) {
    console.warn('localStorage tidak tersedia, gunakan in-memory', err);
    memoryStorage = data;
  }
}

function loadActivities() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
  } catch (err) {
    console.warn('localStorage tidak tersedia, gunakan data default', err);
    if (memoryStorage) return memoryStorage;
  }
  // Jika tidak ada data tersimpan, gunakan default dan simpan
  const defaultData = [...defaultActivities];
  saveActivities(defaultData);
  return defaultData;
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
}

// CRUD: Create
function addActivity(payload) {
  const newActivity = {
    id: nextId++,
    name: payload.name.trim(),
    date: payload.date,
    location: payload.location.trim(),
    notes: payload.notes.trim()
  };
  const updatedActivities = [...activities, newActivity];
  saveActivities(updatedActivities);
  // Reset filter setelah menambah agar aktivitas baru langsung terlihat
  if (filterDate) filterDate.value = '';
  if (searchText) searchText.value = '';
  renderList();
}

// CRUD: Read + Render (with sort & filters)
function getFilteredActivities() {
  const query = searchText ? searchText.value.trim().toLowerCase() : '';
  const dateFilter = filterDate ? filterDate.value : '';

  return activities
    .filter((a) => {
      const matchDate = dateFilter ? a.date === dateFilter : true;
      const matchText =
        !query ||
        a.name.toLowerCase().includes(query) ||
        a.location.toLowerCase().includes(query) ||
        a.notes.toLowerCase().includes(query);
      return matchDate && matchText;
    })
    .sort((a, b) => {
      if (a.date === b.date) return a.name.localeCompare(b.name);
      return a.date.localeCompare(b.date);
    });
}

function renderList() {
  if (!scheduleList || !activityCount) {
    console.error('Elements not found: scheduleList or activityCount');
    return;
  }
  // debug ringan untuk memastikan render dipanggil
  // console.log('Render list, total activities:', activities.length);
  
  const filtered = getFilteredActivities();
  activityCount.textContent = `${filtered.length} aktivitas`;
  scheduleList.innerHTML = '';

  if (filtered.length === 0) {
    scheduleList.innerHTML = '<p class="empty-message">Belum ada aktivitas untuk kriteria ini.</p>';
    return;
  }

  filtered.forEach((item) => {
    const el = document.createElement('article');
    el.className = 'schedule-item';
    el.setAttribute('role', 'listitem');
    el.innerHTML = `
      <div class="schedule-date">
        <div class="date-chip">${formatDate(item.date)}</div>
        <div class="location-chip">${item.location}</div>
      </div>
      <div class="schedule-body">
        <h3 class="activity-name">${item.name}</h3>
        <p class="activity-notes">${item.notes || '— Tidak ada catatan —'}</p>
      </div>
      <div class="schedule-actions">
        <button class="btn-icon edit-btn" data-id="${item.id}" title="Ubah (pindahkan tanggal/lokasi)">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
            <path d="M11.5 2.5a2.121 2.121 0 0 1 3 3L6.5 13.5 2.5 14.5l1-4L11.5 2.5z"/>
          </svg>
        </button>
        <button class="btn-icon delete-btn" data-id="${item.id}" title="Hapus aktivitas">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M8 6l1-2h6l1 2"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `;
    scheduleList.appendChild(el);
  });

  // Wire actions
  scheduleList.querySelectorAll('.edit-btn').forEach((btn) =>
    btn.addEventListener('click', (e) => openEditModal(parseInt(e.currentTarget.dataset.id)))
  );
  scheduleList.querySelectorAll('.delete-btn').forEach((btn) =>
    btn.addEventListener('click', (e) => deleteActivity(parseInt(e.currentTarget.dataset.id)))
  );
}

// CRUD: Update (edit/move)
function openEditModal(id) {
  const item = activities.find((a) => a.id === id);
  if (!item) return;
  editActivityId.value = id;
  editActivityName.value = item.name;
  editActivityDate.value = item.date;
  editActivityLocation.value = item.location;
  editActivityNotes.value = item.notes;
  editModal.style.display = 'flex';
  
  // Update character counters
  updateCharCount(editActivityName, document.getElementById('editNameCharCount'), 100);
  updateCharCount(editActivityLocation, document.getElementById('editLocationCharCount'), 80);
  updateCharCount(editActivityNotes, document.getElementById('editNotesCharCount'), 500);
}

function updateActivity(payload) {
  const idx = activities.findIndex((a) => a.id === payload.id);
  if (idx === -1) return;
  const updated = [...activities];
  updated[idx] = { ...updated[idx], ...payload };
  saveActivities(updated);
  closeEditModal();
  renderList();
}

// CRUD: Delete
function deleteActivity(id) {
  if (!confirm('Hapus aktivitas ini dari rencana?')) return;
  saveActivities(activities.filter((a) => a.id !== id));
  renderList();
}

// Helpers
function closeEditModal() {
  editModal.style.display = 'none';
  editActivityForm.reset();
}

function resetFilters() {
  filterDate.value = '';
  searchText.value = '';
  renderList();
}

// Character counter functions
function updateCharCount(inputElement, counterElement, maxLength) {
  if (inputElement && counterElement) {
    const length = inputElement.value.length;
    counterElement.textContent = length;
    if (length > maxLength * 0.9) {
      counterElement.style.color = '#fca5a5';
    } else {
      counterElement.style.color = '';
    }
  }
}

function initCharCounters() {
  // Form tambah
  if (activityName) {
    const nameCounter = document.getElementById('nameCharCount');
    activityName.addEventListener('input', () => updateCharCount(activityName, nameCounter, 100));
  }
  if (activityLocation) {
    const locationCounter = document.getElementById('locationCharCount');
    activityLocation.addEventListener('input', () => updateCharCount(activityLocation, locationCounter, 80));
  }
  if (activityNotes) {
    const notesCounter = document.getElementById('notesCharCount');
    activityNotes.addEventListener('input', () => updateCharCount(activityNotes, notesCounter, 500));
  }

  // Form edit
  if (editActivityName) {
    const editNameCounter = document.getElementById('editNameCharCount');
    editActivityName.addEventListener('input', () => updateCharCount(editActivityName, editNameCounter, 100));
  }
  if (editActivityLocation) {
    const editLocationCounter = document.getElementById('editLocationCharCount');
    editActivityLocation.addEventListener('input', () => updateCharCount(editActivityLocation, editLocationCounter, 80));
  }
  if (editActivityNotes) {
    const editNotesCounter = document.getElementById('editNotesCharCount');
    editActivityNotes.addEventListener('input', () => updateCharCount(editActivityNotes, editNotesCounter, 500));
  }
}

// Event bindings
function initEventListeners() {
  if (addActivityForm) {
    addActivityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!activityName.value.trim() || !activityDate.value || !activityLocation.value.trim()) {
        alert('Mohon lengkapi nama, tanggal, dan lokasi.');
        return;
      }

      addActivity({
        name: activityName.value,
        date: activityDate.value,
        location: activityLocation.value,
        notes: activityNotes.value || ''
      });
      addActivityForm.reset();
      // Reset counters
      updateCharCount(activityName, document.getElementById('nameCharCount'), 100);
      updateCharCount(activityLocation, document.getElementById('locationCharCount'), 80);
      updateCharCount(activityNotes, document.getElementById('notesCharCount'), 500);
      alert('Aktivitas ditambahkan ke jadwal!');
    });
  }

  if (filterDate) filterDate.addEventListener('change', renderList);
  if (searchText) searchText.addEventListener('input', renderList);
  if (clearFilters) clearFilters.addEventListener('click', resetFilters);

  if (editActivityForm) {
    editActivityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = {
        id: parseInt(editActivityId.value, 10),
        name: editActivityName.value.trim(),
        date: editActivityDate.value,
        location: editActivityLocation.value.trim(),
        notes: editActivityNotes.value.trim()
      };
      if (!payload.name || !payload.date || !payload.location) {
        alert('Nama, tanggal, dan lokasi wajib diisi.');
        return;
      }
      updateActivity(payload);
      alert('Aktivitas diperbarui.');
    });
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeEditModal);
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditModal);
  if (editModal) {
    editModal.addEventListener('click', (e) => {
      if (e.target === editModal) closeEditModal();
    });
  }
}

// Initialize app
function initApp() {
  // Inisialisasi activities setelah semua fungsi didefinisikan
  activities = loadActivities();
  nextId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 4;
  
  initElements();
  initCharCounters();
  initEventListeners();
  renderList();
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}



