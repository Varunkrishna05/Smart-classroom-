/* ==========================================================================
   AI-POWERED COGNITIVE SMART CLASSROOM & ADAPTIVE TIMETABLE SYSTEM
   Core JavaScript Engine & Interactive Application Controller
   ========================================================================== */

// --- Global Application State ---
const state = {
  currentRole: 'admin',
  theme: 'dark',
  timetableWeights: {
    concentration: 85,
    teacherAbsence: 0,
    examProximity: 1
  },
  liveMetrics: {
    focused: 28,
    confused: 6,
    bored: 3,
    engagementScore: 82
  },
  iotStates: {
    ac: true,
    lights: true,
    co2: true
  }
};

// --- Initializer ---
document.addEventListener('DOMContentLoaded', () => {
  initThreeClassroom();
  initCharts();
  renderTimetableGrid();
  renderSeatingMatrix();
  startCvSimulation();
});

// ==========================================================================
// 1. THREE.JS 3D CLASSROOM SPATIAL VISUALIZER
// ==========================================================================
let scene, camera, renderer, desksGroup;

function initThreeClassroom() {
  const container = document.getElementById('three-classroom-container');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f172a);
  scene.fog = new THREE.FogExp2(0x0f172a, 0.03);

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 12, 18);
  camera.lookAt(0, 0, -2);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0x6366f1, 1.2);
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0x06b6d4, 1.5, 30);
  pointLight.position.set(0, 8, -4);
  scene.add(pointLight);

  // Floor Grid
  const floorGeo = new THREE.PlaneGeometry(24, 20);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.8,
    metalness: 0.2
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Smart Board at Front
  const boardGeo = new THREE.BoxGeometry(10, 3.5, 0.2);
  const boardMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: 0x0369a1,
    emissiveIntensity: 0.6,
    roughness: 0.3
  });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0, 4, -9.5);
  scene.add(board);

  // Teacher Podium
  const podGeo = new THREE.BoxGeometry(3, 1.2, 1.5);
  const podMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
  const podium = new THREE.Mesh(podGeo, podMat);
  podium.position.set(0, 0.6, -6.5);
  scene.add(podium);

  // Student Desks Grid (5 Rows x 6 Desks)
  desksGroup = new THREE.Group();
  const colors = [0x10b981, 0x10b981, 0x06b6d4, 0xf59e0b, 0xf43f5e]; // Focus states

  let deskId = 1;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const deskMesh = createDeskNode(
        (col - 2.5) * 2.8,
        (row - 1.5) * 3,
        colors[Math.floor(Math.random() * colors.length)],
        deskId++
      );
      desksGroup.add(deskMesh);
    }
  }
  scene.add(desksGroup);

  // Animation Loop
  let angle = 0;
  function animate() {
    requestAnimationFrame(animate);
    angle += 0.002;
    camera.position.x = Math.sin(angle) * 16;
    camera.position.z = Math.cos(angle) * 16 + 2;
    camera.lookAt(0, 1, -1);
    renderer.render(scene, camera);
  }
  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

function createDeskNode(x, z, auraColor, id) {
  const group = new THREE.Group();

  // Table top
  const deskGeo = new THREE.BoxGeometry(1.6, 0.1, 1.0);
  const deskMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
  const desk = new THREE.Mesh(deskGeo, deskMat);
  desk.position.set(0, 1.2, 0);
  desk.castShadow = true;
  group.add(desk);

  // Chair & Student Sphere (Node)
  const headGeo = new THREE.SphereGeometry(0.35, 16, 16);
  const headMat = new THREE.MeshStandardMaterial({
    color: auraColor,
    roughness: 0.2,
    emissive: auraColor,
    emissiveIntensity: 0.3
  });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.set(0, 1.8, 0.2);
  group.add(head);

  group.position.set(x, 0, z);
  return group;
}


// ==========================================================================
// 2. CHART.JS ANALYTICS & VISUALIZATIONS
// ==========================================================================
let adminEmotionChartObj, facultyEnergyChartObj, studentRadarChartObj, parentTrendChartObj;

function initCharts() {
  // Admin Doughnut Chart - Emotion Distribution
  const ctx1 = document.getElementById('adminEmotionChart')?.getContext('2d');
  if (ctx1) {
    adminEmotionChartObj = new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['Focused (68%)', 'Confused (14%)', 'Bored (12%)', 'Sleepy (6%)'],
        datasets: [{
          data: [68, 14, 12, 6],
          backgroundColor: ['#10b981', '#06b6d4', '#f59e0b', '#f43f5e'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#9ca3af', font: { family: 'Inter' } } }
        },
        cutout: '70%'
      }
    });
  }

  // Faculty Energy Usage Bar Chart
  const ctx2 = document.getElementById('facultyEnergyChart')?.getContext('2d');
  if (ctx2) {
    facultyEnergyChartObj = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['08 AM', '10 AM', '12 PM', '02 PM', '04 PM'],
        datasets: [
          {
            label: 'Baseline HVAC & Lights (kWh)',
            data: [12, 18, 22, 19, 15],
            backgroundColor: 'rgba(99, 102, 241, 0.4)',
            borderRadius: 6
          },
          {
            label: 'AI Saved Energy (kWh)',
            data: [8, 12, 15, 13, 10],
            backgroundColor: '#10b981',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: '#9ca3af' }, grid: { display: false } },
          y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        },
        plugins: { legend: { labels: { color: '#9ca3af' } } }
      }
    });
  }

  // Student Proficiency Radar Chart
  const ctx3 = document.getElementById('studentRadarChart')?.getContext('2d');
  if (ctx3) {
    studentRadarChartObj = new Chart(ctx3, {
      type: 'radar',
      data: {
        labels: ['Physics', 'Neural Networks', 'Calculus', 'Data Structures', 'Embedded Systems'],
        datasets: [{
          label: 'Proficiency Score',
          data: [92, 88, 76, 95, 84],
          backgroundColor: 'rgba(99, 102, 241, 0.25)',
          borderColor: '#6366f1',
          pointBackgroundColor: '#06b6d4'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.1)' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: '#9ca3af' },
            ticks: { display: false }
          }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  // Parent Engagement Trend Line Chart
  const ctx4 = document.getElementById('parentEngagementTrendChart')?.getContext('2d');
  if (ctx4) {
    parentTrendChartObj = new Chart(ctx4, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          label: 'Child Engagement Score (%)',
          data: [84, 91, 88, 95, 89],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: '#9ca3af' }, grid: { display: false } },
          y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' }, min: 50, max: 100 }
        },
        plugins: { legend: { display: false } }
      }
    });
  }
}


// ==========================================================================
// 3. ADAPTIVE TIMETABLE ENGINE ALGORITHM SIMULATION
// ==========================================================================
const baseScheduleData = [
  { time: '09:00 - 10:00 AM', mon: { subject: 'Quantum Physics', faculty: 'Dr. Sharma', room: 'CR-301', tag: 'tag-high-cog', tagText: 'High Cog' }, tue: { subject: 'Neural Networks', faculty: 'Prof. Ananya', room: 'CR-Lab 2', tag: 'tag-optimal', tagText: 'Optimal' }, wed: { subject: 'Applied Math III', faculty: 'Dr. Verma', room: 'CR-301', tag: 'tag-high-cog', tagText: 'High Cog' }, thu: { subject: 'Quantum Physics', faculty: 'Dr. Sharma', room: 'CR-301', tag: 'tag-optimal', tagText: 'Optimal' }, fri: { subject: 'Deep Learning', faculty: 'Prof. Ananya', room: 'CR-Lab 1', tag: 'tag-optimal', tagText: 'Optimal' } },
  { time: '10:15 - 11:15 AM', mon: { subject: 'Data Structures', faculty: 'Prof. Rao', room: 'CR-302', tag: 'tag-optimal', tagText: 'Optimal' }, tue: { subject: 'Quantum Physics', faculty: 'Dr. Sharma', room: 'CR-301', tag: 'tag-high-cog', tagText: 'High Cog' }, wed: { subject: 'Embedded IoT', faculty: 'Prof. Gupta', room: 'IoT Lab', tag: 'tag-optimal', tagText: 'Optimal' }, thu: { subject: 'Applied Math III', faculty: 'Dr. Verma', room: 'CR-301', tag: 'tag-high-cog', tagText: 'High Cog' }, fri: { subject: 'Compiler Design', faculty: 'Dr. Mehta', room: 'CR-302', tag: 'tag-optimal', tagText: 'Optimal' } },
  { time: '11:30 - 12:30 PM', mon: { subject: 'Embedded IoT', faculty: 'Prof. Gupta', room: 'IoT Lab', tag: 'tag-optimal', tagText: 'Optimal' }, tue: { subject: 'Compiler Design', faculty: 'Dr. Mehta', room: 'CR-302', tag: 'tag-optimal', tagText: 'Optimal' }, wed: { subject: 'Data Structures', faculty: 'Prof. Rao', room: 'CR-302', tag: 'tag-optimal', tagText: 'Optimal' }, thu: { subject: 'Neural Networks', faculty: 'Prof. Ananya', room: 'CR-Lab 2', tag: 'tag-optimal', tagText: 'Optimal' }, fri: { subject: 'Interactive Workshop', faculty: 'Guest Speaker', room: 'Auditorium', tag: 'tag-shifted', tagText: 'AI Shifted' } }
];

function renderTimetableGrid(dataset = baseScheduleData) {
  const tbody = document.getElementById('timetable-tbody');
  if (!tbody) return;

  tbody.innerHTML = dataset.map(row => `
    <tr>
      <td style="font-weight: 700; color: var(--accent-cyan); text-align: center;">${row.time}</td>
      ${['mon', 'tue', 'wed', 'thu', 'fri'].map(day => `
        <td>
          <div class="slot-subject">${row[day].subject}</div>
          <div class="slot-faculty">${row[day].faculty}</div>
          <div class="slot-room"><i class="fa-solid fa-location-dot"></i> ${row[day].room}</div>
          <span class="slot-tag ${row[day].tag}">${row[day].tagText}</span>
        </td>
      `).join('')}
    </tr>
  `).join('');
}

function updateSliderVal(type, val) {
  if (type === 'concentration') {
    document.getElementById('val-concentration').innerText = val + '%';
    state.timetableWeights.concentration = parseInt(val);
  } else if (type === 'teacher') {
    document.getElementById('val-teacher').innerText = val + '%';
    state.timetableWeights.teacherAbsence = parseInt(val);
  } else if (type === 'exam') {
    const labels = ['Low', 'Medium (Exam in 3 Days)', 'CRITICAL (Exam Tomorrow)'];
    document.getElementById('val-exam').innerText = labels[val - 1];
    state.timetableWeights.examProximity = parseInt(val);
  }
}

function recalculateTimetable() {
  const modifiedDataset = JSON.parse(JSON.stringify(baseScheduleData));

  // If teacher absence > 20%, replace Quantum Physics with AI Self-Study Lab
  if (state.timetableWeights.teacherAbsence > 20) {
    modifiedDataset[0].mon = { subject: 'AI Self-Paced Revision', faculty: 'AI Tutor Bot', room: 'Digital Library', tag: 'tag-shifted', tagText: 'Substitute AI' };
  }

  // If Exam Proximity is High, boost math and physics slots
  if (state.timetableWeights.examProximity === 3) {
    modifiedDataset[2].fri = { subject: 'Math Exam Masterclass', faculty: 'Dr. Verma', room: 'CR-301', tag: 'tag-high-cog', tagText: 'Exam Boost' };
  }

  renderTimetableGrid(modifiedDataset);
  alert('AI Constraint Solver: Timetable dynamically optimized across 12 institutional soft constraints!');
}

function triggerTimetableOptimization() {
  recalculateTimetable();
}


// ==========================================================================
// 4. SMART SEAT RECOMMENDATION MATRIX ENGINE
// ==========================================================================
const studentSeats = [
  { name: 'Aarav P.', category: 'advanced', label: 'Advanced', row: 1 },
  { name: 'Meera K.', category: 'needs-front', label: 'Vision Care', row: 1 },
  { name: 'Rohan S.', category: 'beginner', label: 'Beginner', row: 1 },
  { name: 'Rahul S.', category: 'advanced', label: 'Advanced', row: 1 },
  { name: 'Priya N.', category: 'intermediate', label: 'Intermediate', row: 1 },
  { name: 'Vikram B.', category: 'intermediate', label: 'Intermediate', row: 1 },
  
  { name: 'Ananya D.', category: 'intermediate', label: 'Intermediate', row: 2 },
  { name: 'Siddharth M.', category: 'advanced', label: 'Advanced', row: 2 },
  { name: 'Kavya L.', category: 'beginner', label: 'Beginner', row: 2 },
  { name: 'Dev R.', category: 'intermediate', label: 'Intermediate', row: 2 },
  { name: 'Neha G.', category: 'advanced', label: 'Advanced', row: 2 },
  { name: 'Arjun P.', category: 'needs-front', label: 'Hearing Care', row: 2 }
];

function renderSeatingMatrix() {
  const container = document.getElementById('seating-matrix-container');
  if (!container) return;

  container.innerHTML = studentSeats.map(seat => `
    <div class="seat-node ${seat.category}">
      <div class="seat-student-name">${seat.name}</div>
      <div class="seat-category-pill">${seat.label}</div>
    </div>
  `).join('');
}


// ==========================================================================
// 5. OPENCV COMPUTER VISION SIMULATOR
// ==========================================================================
function startCvSimulation() {
  const canvas = document.getElementById('cvOverlayCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function drawBoundingBoxes() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bounding Box 1 (Focused)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 50, 70, 70);
    ctx.fillStyle = '#10b981';
    ctx.font = '10px Inter';
    ctx.fillText('Focused (96%)', 40, 45);

    // Bounding Box 2 (Confused)
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(180, 60, 65, 65);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('Confused (78%)', 180, 55);

    // Bounding Box 3 (Bored)
    ctx.strokeStyle = '#f43f5e';
    ctx.strokeRect(310, 40, 75, 75);
    ctx.fillStyle = '#f43f5e';
    ctx.fillText('Distracted (82%)', 310, 35);
  }

  drawBoundingBoxes();
  window.addEventListener('resize', drawBoundingBoxes);
}


// ==========================================================================
// 6. ROLE SWITCHER & UI CONTROLS
// ==========================================================================
function switchRole(role) {
  state.currentRole = role;

  // Update button active state
  document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  // Hide all views
  document.querySelectorAll('.dashboard-view').forEach(view => view.classList.remove('active'));

  // Show target view
  const targetView = document.getElementById(`${role}-view`);
  if (targetView) targetView.classList.add('active');

  // Update Header User Profile text
  const nameEl = document.getElementById('user-display-name');
  const roleEl = document.getElementById('user-display-role');

  if (role === 'admin') {
    nameEl.innerText = 'Dr. Aparna R (Admin)';
    roleEl.innerText = 'System Architect';
  } else if (role === 'faculty') {
    nameEl.innerText = 'Prof. Ananya V (Faculty)';
    roleEl.innerText = 'Computer Science Dept';
  } else if (role === 'student') {
    nameEl.innerText = 'Rahul Sharma (Student)';
    roleEl.innerText = 'Roll No: 2026-CS-104';
  } else if (role === 'parent') {
    nameEl.innerText = 'Suresh Sharma (Parent)';
    roleEl.innerText = 'Parent of Rahul S.';
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  document.getElementById('theme-icon').className = next === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

function toggleIoTDevice(device, isChecked) {
  alert(`IoT Command Sent: ${device} is now ${isChecked ? 'ENABLED (Auto Rule)' : 'DISABLED (Manual Override)'}`);
}


// ==========================================================================
// 7. AI CONVERSATIONAL TUTOR CHATBOT DRAWER
// ==========================================================================
function toggleAiChat() {
  const box = document.getElementById('aiChatBox');
  if (box) box.classList.toggle('active');
}

function handleChatKeyPress(e) {
  if (e.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
  const input = document.getElementById('chatInputText');
  const text = input.value.trim();
  if (!text) return;

  const container = document.getElementById('chatMessageContainer');

  // Append User Msg
  const userDiv = document.createElement('div');
  userDiv.className = 'chat-msg user';
  userDiv.innerText = text;
  container.appendChild(userDiv);

  input.value = '';
  container.scrollTop = container.scrollHeight;

  // Simulate AI Response
  setTimeout(() => {
    const botDiv = document.createElement('div');
    botDiv.className = 'chat-msg bot';

    if (text.toLowerCase().includes('schrödinger') || text.toLowerCase().includes('quantum')) {
      botDiv.innerHTML = `<strong>AI Response:</strong> Schrödinger's equation \(i\\hbar \\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi\) describes how the quantum state of a physical system changes with time. Would you like a 3-question quiz on wavefunctions?`;
    } else if (text.toLowerCase().includes('quiz')) {
      botDiv.innerHTML = `<strong>AI Quick Quiz:</strong><br>1. What does the squared magnitude of the wavefunction \(|\\Psi|^2\) represent?<br><em>A) Energy  B) Probability Density  C) Mass</em>`;
    } else {
      botDiv.innerHTML = `<strong>AI Tutor:</strong> I have analyzed your learning profile. For "${text}", I recommend reviewing Chapter 4 Notes and practicing the 3 differentiated flashcards generated in your Student Dashboard.`;
    }

    container.appendChild(botDiv);
    container.scrollTop = container.scrollHeight;
  }, 700);
}

function openHomeworkModal() {
  alert('AI Homework Generator Modal: Generating 3 level-differentiated assignments (Beginner, Intermediate, Advanced) based on today\'s Quantum Physics lecture!');
}

function openSummaryModal(type) {
  if (type === 'formula') {
    alert('Physics Formulas:\n1. E = hf\n2. p = h / λ\n3. iħ(∂Ψ/∂t) = HΨ');
  } else if (type === 'flashcard') {
    alert('AI Flashcard 1/5:\nQ: What is Wave-Particle Duality?\nA: The concept in quantum mechanics that every particle or quantic entity may be described as either a particle or a wave.');
  } else if (type === 'quiz') {
    alert('AI MCQ:\nQ: Which uncertainty relation holds true?\nA) Δx·Δp >= h/4π (Correct)');
  }
}
