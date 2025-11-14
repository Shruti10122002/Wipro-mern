// -------------------------------
// Seed data and storage helpers
// -------------------------------
const LS_USERS_KEY = 'sfs_users';
const SS_USER_KEY = 'sfs_current_user';

const activities = [
  { id: 1, activity: 'Create project file with tables from 12 to 19', subject: 'Maths' },
  { id: 2, activity: 'Write an essay on “My Garden” (250 words)', subject: 'English' },
  { id: 3, activity: 'Science journal: plant growth observation (week 2)', subject: 'Science' },
  { id: 4, activity: 'Map practice: States and Capitals', subject: 'Social' },
  { id: 5, activity: 'Code basic calculator (add/subtract) in JS', subject: 'Computer' },
  { id: 6, activity: 'Hindi: read Chapter 3 and list 10 new words', subject: 'Hindi' },
  { id: 7, activity: 'Practice 20 algebra problems', subject: 'Maths' },
  { id: 8, activity: 'Science model: simple electric circuit', subject: 'Science' },
];

// Ensure a default user exists for demo
function ensureDefaultUser() {
  const users = getUsers();
  if (!users.find(u => u.username === 'student')) {
    users.push({ name: 'John Doe', username: 'student', password: 'password123' });
    saveUsers(users);
  }
}
function getUsers() {
  try { return JSON.parse(localStorage.getItem(LS_USERS_KEY)) || []; }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
}
function setCurrentUser(user) {
  sessionStorage.setItem(SS_USER_KEY, JSON.stringify(user));
}
function getCurrentUser() {
  try { return JSON.parse(sessionStorage.getItem(SS_USER_KEY)); }
  catch { return null; }
}
function clearCurrentUser() {
  sessionStorage.removeItem(SS_USER_KEY);
}

// -------------------------------
// UI helpers
// -------------------------------
const q = sel => document.querySelector(sel);
const authSection = q('#auth');
const welcomeSection = q('#welcome');
const activitiesSection = q('#activities');

function showSection(which) {
  // Gate: only allow welcome/activities if logged in
  const user = getCurrentUser();
  if (!user && (which === 'welcome' || which === 'activities')) {
    which = 'auth';
  }

  authSection.classList.toggle('hidden', which !== 'auth');
  welcomeSection.classList.toggle('hidden', which !== 'welcome');
  activitiesSection.classList.toggle('hidden', which !== 'activities');

  updateNav();
  if (which === 'welcome' && user) {
    q('#welcome-name').textContent = user.name || user.username;
  }
}

// Update nav buttons depending on auth state
function updateNav() {
  const loggedIn = !!getCurrentUser();
  q('#nav-home').disabled = !loggedIn;
  q('#nav-activities').disabled = !loggedIn;
  q('#nav-logout').style.display = loggedIn ? 'inline-block' : 'none';
}

// -------------------------------
// Auth: Login / Register
// -------------------------------
function setupAuthForms() {
  const loginForm = q('#login-form');
  const registerForm = q('#register-form');
  const loginMsg = q('#login-msg');
  const registerMsg = q('#register-msg');

  // Tabs
  q('#show-login').addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    q('#show-login').classList.add('active');
    q('#show-register').classList.remove('active');
    loginMsg.textContent = '';
    registerMsg.textContent = '';
  });
  q('#show-register').addEventListener('click', () => {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    q('#show-register').classList.add('active');
    q('#show-login').classList.remove('active');
    loginMsg.textContent = '';
    registerMsg.textContent = '';
  });

  // Login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = q('#login-username').value.trim();
    const password = q('#login-password').value.trim();

    const user = getUsers().find(u => u.username === username && u.password === password);
    if (!user) {
      loginMsg.style.color = '#b91c1c';
      loginMsg.textContent = 'Invalid username or password.';
      return;
    }
    setCurrentUser(user);
    loginMsg.textContent = '';
    showSection('welcome');
  });

  // Register
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = q('#register-name').value.trim();
    const username = q('#register-username').value.trim();
    const password = q('#register-password').value;

    if (username.length < 3) {
      registerMsg.style.color = '#b91c1c';
      registerMsg.textContent = 'Username must be at least 3 characters.';
      return;
    }
    if (password.length < 4) {
      registerMsg.style.color = '#b91c1c';
      registerMsg.textContent = 'Password must be at least 4 characters.';
      return;
    }
    const users = getUsers();
    if (users.some(u => u.username === username)) {
      registerMsg.style.color = '#b91c1c';
      registerMsg.textContent = 'Username already exists.';
      return;
    }
    const newUser = { name, username, password };
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    registerMsg.textContent = '';
    showSection('welcome');
  });
}

// -------------------------------
// Activities: dropdown + list
// -------------------------------
function uniqueSubjects() {
  return Array.from(new Set(activities.map(a => a.subject))).sort();
}
function populateSubjects() {
  const select = q('#subject-select');
  select.innerHTML = '';
  const allOpt = document.createElement('option');
  allOpt.value = 'ALL';
  allOpt.textContent = 'All Subjects';
  select.appendChild(allOpt);

  uniqueSubjects().forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub;
    opt.textContent = sub;
    select.appendChild(opt);
  });
  select.value = 'ALL';
}
function renderActivities() {
  const list = q('#activities-list');
  const empty = q('#activities-empty');
  const subject = q('#subject-select').value;

  const items = activities.filter(a => subject === 'ALL' || a.subject === subject);
  list.innerHTML = '';
  if (items.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  items.forEach(a => {
    const div = document.createElement('div');
    div.className = 'activity';
    div.innerHTML = `
      <div class="badge">${a.id}</div>
      <div>
        <div class="meta"><strong>${a.subject}</strong></div>
        <div>${a.activity}</div>
      </div>
    `;
    list.appendChild(div);
  });
}
function setupActivities() {
  populateSubjects();
  renderActivities();
  q('#subject-select').addEventListener('change', renderActivities);
}

// -------------------------------
// Navigation buttons (onclick activities)
// -------------------------------
function setupNav() {
  q('#nav-home').addEventListener('click', () => showSection('welcome'));
  q('#nav-activities').addEventListener('click', () => showSection('activities'));
  q('#nav-logout').addEventListener('click', () => {
    clearCurrentUser();
    showSection('auth');
  });
  q('#welcome-to-activities').addEventListener('click', () => showSection('activities'));
  q('#back-to-welcome').addEventListener('click', () => showSection('welcome'));
}

// -------------------------------
// Init
// -------------------------------
(function init(){
  // footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  ensureDefaultUser();    // seed demo login: student / password123
  setupAuthForms();       // login/register handlers
  setupActivities();      // subject dropdown + list
  setupNav();             // nav button onclick

  // initial section
  showSection(getCurrentUser() ? 'welcome' : 'auth');
})();