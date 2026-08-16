// Global state
let currentView = 'landing';
let currentUser = null;
let attendanceRecords = [];

// Mock data
const students = [
    { id: '1', name: 'Alice Johnson', rollNumber: 'CS001' },
    { id: '2', name: 'Bob Smith', rollNumber: 'CS002' },
    { id: '3', name: 'Charlie Brown', rollNumber: 'CS003' },
    { id: '4', name: 'Diana Wilson', rollNumber: 'CS004' },
    { id: '5', name: 'Emma Davis', rollNumber: 'CS005' },
];

const subjects = [
    { id: '1', name: 'Data Structures', code: 'CS201' },
    { id: '2', name: 'Database Systems', code: 'CS301' },
    { id: '3', name: 'Web Development', code: 'CS401' },
    { id: '4', name: 'Machine Learning', code: 'CS501' },
];

// Generate mock attendance data
function generateMockAttendance() {
    const records = [];
    const dates = [];
    
    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }

    students.forEach(student => {
        subjects.forEach(subject => {
            dates.forEach(date => {
                // Random attendance with 75% presence probability
                const isPresent = Math.random() > 0.25;
                records.push({
                    studentId: student.id,
                    subjectId: subject.id,
                    date,
                    present: isPresent
                });
            });
        });
    });

    return records;
}

// Initialize app
function initApp() {
    attendanceRecords = generateMockAttendance();
    setupLucideIcons();
    showPage('landing');
    initializeProfessorControls();
}

// Setup Lucide icons
function setupLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Page management
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page === 'landing' ? 'landing-page' : 
                          page === 'student' ? 'student-dashboard' : 
                          'professor-dashboard').classList.add('active');
    currentView = page;
    
    // Refresh icons after page change
    setTimeout(setupLucideIcons, 100);
}

// Login handler
function handleLogin(userType) {
    currentUser = userType;
    if (userType === 'student') {
        showPage('student');
        updateStudentDashboard();
    } else {
        showPage('professor');
        updateProfessorDashboard();
    }
}

// Logout handler
function handleLogout() {
    currentUser = null;
    showPage('landing');
}

// Student Dashboard Functions
function updateStudentDashboard() {
    const currentStudentId = '1'; // Mock logged in student
    const attendanceStats = getAttendanceStats(currentStudentId);
    
    // Update overview cards
    const averageAttendance = attendanceStats.reduce((sum, stat) => sum + stat.percentage, 0) / attendanceStats.length;
    document.getElementById('overall-attendance').textContent = Math.round(averageAttendance) + '%';
    document.getElementById('total-subjects').textContent = subjects.length;
    document.getElementById('classes-attended').textContent = 
        attendanceStats.reduce((sum, stat) => sum + stat.attendedClasses, 0);
    
    const lowAttendanceSubjects = attendanceStats.filter(stat => stat.percentage < 75);
    document.getElementById('low-attendance-count').textContent = lowAttendanceSubjects.length;
    
    // Update alert
    const alertContainer = document.getElementById('attendance-alert');
    if (lowAttendanceSubjects.length > 0) {
        alertContainer.style.display = 'block';
        const subjectsDiv = document.getElementById('low-attendance-subjects');
        subjectsDiv.innerHTML = lowAttendanceSubjects.map(stat => 
            `<div>• ${stat.subject.name} (${stat.subject.code}): ${stat.percentage}%</div>`
        ).join('');
    } else {
        alertContainer.style.display = 'none';
    }
    
    // Update subject analytics
    updateSubjectAnalytics(attendanceStats);
}

function getAttendanceStats(studentId) {
    return subjects.map(subject => {
        const subjectRecords = attendanceRecords.filter(
            record => record.studentId === studentId && record.subjectId === subject.id
        );
        
        const totalClasses = subjectRecords.length;
        const attendedClasses = subjectRecords.filter(record => record.present).length;
        const percentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
        
        return {
            subject,
            totalClasses,
            attendedClasses,
            percentage: Math.round(percentage * 100) / 100
        };
    });
}

function updateSubjectAnalytics(attendanceStats) {
    const container = document.getElementById('subject-analytics');
    container.innerHTML = attendanceStats.map(stat => {
        const classesNeeded = stat.percentage < 75 ? 
            Math.ceil((75 * stat.totalClasses - 100 * stat.attendedClasses) / 25) : 0;
        
        return `
            <div class="subject-item">
                <div class="subject-header">
                    <div class="subject-info">
                        <h3>${stat.subject.name}</h3>
                        <p>${stat.subject.code}</p>
                    </div>
                    <div class="subject-stats">
                        <div class="percentage ${stat.percentage >= 75 ? 'good' : 'low'}">
                            ${stat.percentage}%
                        </div>
                        <div class="class-count">
                            ${stat.attendedClasses}/${stat.totalClasses} classes
                        </div>
                    </div>
                </div>
                
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(stat.percentage, 100)}%"></div>
                    </div>
                    <div class="progress-labels">
                        <span>0%</span>
                        <span class="required">Required: 75%</span>
                        <span>100%</span>
                    </div>
                </div>

                ${stat.percentage < 75 ? `
                    <div class="action-required">
                        <div>
                            <strong>Action Required:</strong> You need to attend ${classesNeeded} more classes
                            to reach 75% attendance.
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Professor Dashboard Functions
function updateProfessorDashboard() {
    const stats = getOverallStats();
    
    // Update overview cards
    document.getElementById('prof-total-students').textContent = stats.totalStudents;
    document.getElementById('prof-total-subjects').textContent = stats.totalSubjects;
    document.getElementById('prof-overall-attendance').textContent = stats.overallAttendanceRate + '%';
    document.getElementById('prof-classes-conducted').textContent = stats.totalClassesConducted;
}

function getOverallStats() {
    const totalRecords = attendanceRecords.length;
    const presentRecords = attendanceRecords.filter(r => r.present).length;
    const attendanceRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;
    
    return {
        totalStudents: students.length,
        totalSubjects: subjects.length,
        overallAttendanceRate: Math.round(attendanceRate * 100) / 100,
        totalClassesConducted: Math.floor(totalRecords / students.length)
    };
}

function initializeProfessorControls() {
    // Populate subject dropdown
    const subjectSelect = document.getElementById('subject-select');
    subjectSelect.innerHTML = '<option value="">Select a subject</option>' +
        subjects.map(subject => 
            `<option value="${subject.id}">${subject.name} (${subject.code})</option>`
        ).join('');
    
    // Set today's date
    const dateSelect = document.getElementById('date-select');
    dateSelect.value = new Date().toISOString().split('T')[0];
    
    // Generate quick date buttons
    generateQuickDateButtons();
}

function generateQuickDateButtons() {
    const container = document.getElementById('quick-date-buttons');
    const dates = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    
    container.innerHTML = dates.map(date => {
        const dateObj = new Date(date);
        const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `<button class="quick-date-btn" onclick="selectQuickDate('${date}')">${label}</button>`;
    }).join('');
}

function selectQuickDate(date) {
    document.getElementById('date-select').value = date;
    updateQuickDateButtons(date);
    updateAttendanceTable();
}

function updateQuickDateButtons(selectedDate) {
    document.querySelectorAll('.quick-date-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedBtn = Array.from(document.querySelectorAll('.quick-date-btn'))
        .find(btn => btn.onclick.toString().includes(selectedDate));
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
}

function updateAttendanceTable() {
    const selectedSubject = document.getElementById('subject-select').value;
    const selectedDate = document.getElementById('date-select').value;
    const container = document.getElementById('attendance-table-container');
    const bulkActions = document.getElementById('bulk-actions');
    
    if (!selectedSubject) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="calendar"></i>
                <p>Please select a subject to mark attendance</p>
            </div>
        `;
        bulkActions.style.display = 'none';
        setupLucideIcons();
        return;
    }
    
    bulkActions.style.display = 'flex';
    
    const subject = subjects.find(s => s.id === selectedSubject);
    const dateObj = new Date(selectedDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    container.innerHTML = `
        <div class="attendance-table">
            <div class="table-header">
                <h3>${subject.name} - ${formattedDate}</h3>
            </div>
            <div class="table-body">
                ${students.map(student => {
                    const isPresent = getAttendanceForDate(student.id, selectedSubject, selectedDate);
                    const initials = student.name.split(' ').map(n => n[0]).join('');
                    
                    return `
                        <div class="student-row">
                            <div class="student-info">
                                <div class="student-avatar">${initials}</div>
                                <div class="student-details">
                                    <h4>${student.name}</h4>
                                    <p>${student.rollNumber}</p>
                                </div>
                            </div>
                            <div class="attendance-control">
                                <input type="checkbox" 
                                       class="attendance-checkbox" 
                                       id="attendance-${student.id}"
                                       ${isPresent ? 'checked' : ''}
                                       onchange="handleAttendanceChange('${student.id}', this.checked)">
                                <label for="attendance-${student.id}" 
                                       class="attendance-label ${isPresent ? 'present' : 'absent'}">
                                    ${isPresent ? 'Present' : 'Absent'}
                                </label>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function getAttendanceForDate(studentId, subjectId, date) {
    const record = attendanceRecords.find(
        r => r.studentId === studentId && r.subjectId === subjectId && r.date === date
    );
    return record?.present || false;
}

function handleAttendanceChange(studentId, present) {
    const selectedSubject = document.getElementById('subject-select').value;
    const selectedDate = document.getElementById('date-select').value;
    
    if (selectedSubject && selectedDate) {
        updateAttendance(studentId, selectedSubject, selectedDate, present);
        
        // Update label
        const label = document.querySelector(`label[for="attendance-${studentId}"]`);
        label.textContent = present ? 'Present' : 'Absent';
        label.className = `attendance-label ${present ? 'present' : 'absent'}`;
    }
}

function updateAttendance(studentId, subjectId, date, present) {
    // Remove existing record
    attendanceRecords = attendanceRecords.filter(record => 
        !(record.studentId === studentId && record.subjectId === subjectId && record.date === date)
    );
    
    // Add new record
    attendanceRecords.push({ studentId, subjectId, date, present });
    
    // Update professor dashboard stats
    if (currentView === 'professor') {
        updateProfessorDashboard();
    }
}

function markAllPresent() {
    const selectedSubject = document.getElementById('subject-select').value;
    const selectedDate = document.getElementById('date-select').value;
    
    if (selectedSubject && selectedDate) {
        students.forEach(student => {
            updateAttendance(student.id, selectedSubject, selectedDate, true);
        });
        updateAttendanceTable();
    }
}

function markAllAbsent() {
    const selectedSubject = document.getElementById('subject-select').value;
    const selectedDate = document.getElementById('date-select').value;
    
    if (selectedSubject && selectedDate) {
        students.forEach(student => {
            updateAttendance(student.id, selectedSubject, selectedDate, false);
        });
        updateAttendanceTable();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);