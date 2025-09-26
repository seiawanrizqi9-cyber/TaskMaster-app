document.addEventListener("DOMContentLoaded", () => {
  const monthSelect = document.getElementById("month-select");
  const yearSelect = document.getElementById("year-select");
  const calendarGrid = document.getElementById("calendarGrid");

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  let calendarTasks = JSON.parse(localStorage.getItem("calendarTasks")) || {};
  let currentDate = new Date();

  // --- Inisialisasi Pilihan Bulan dan Tahun ---
  function initializeSelectors() {
    // Isi pilihan bulan
    months.forEach((month, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = month;
      monthSelect.appendChild(option);
    });

    // Isi pilihan tahun (5 tahun ke belakang dan 5 tahun ke depan)
    const currentYear = currentDate.getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      yearSelect.appendChild(option);
    }

    // Atur ke bulan dan tahun saat ini
    monthSelect.value = currentDate.getMonth();
    yearSelect.value = currentDate.getFullYear();

    // Tambahkan event listener untuk render ulang saat pilihan berubah
    monthSelect.addEventListener("change", renderCalendar);
    yearSelect.addEventListener("change", renderCalendar);
  }

  // --- Render Kalender ---
  function renderCalendar() {
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearSelect.value);

    // Hapus tanggal lama, tapi pertahankan nama hari
    const dayNames = calendarGrid.querySelectorAll(".day-name");
    calendarGrid.innerHTML = "";
    dayNames.forEach((name) => calendarGrid.appendChild(name));

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Buat kotak kosong untuk hari sebelum tanggal 1
    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyBox = document.createElement("div");
      emptyBox.className = "date-box other-month";
      calendarGrid.appendChild(emptyBox);
    }

    // Buat kotak untuk setiap tanggal
    for (let day = 1; day <= daysInMonth; day++) {
      const dateBox = document.createElement("div");
      dateBox.className = "date-box";
      const dateKey = `${year}-${month}-${day}`;

      // Buat daftar task untuk tanggal ini
      const taskList = document.createElement("ul");
      if (calendarTasks[dateKey]) {
        calendarTasks[dateKey].forEach((taskText, index) => {
          const li = document.createElement("li");
          const taskSpan = document.createElement("span");
          taskSpan.textContent = taskText;

          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "×"; // Tombol hapus
          deleteBtn.className = "delete-task-btn";

          deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Mencegah prompt tambah task muncul

            // Hapus task dari array
            calendarTasks[dateKey].splice(index, 1);

            // Jika array kosong, hapus properti tanggalnya
            if (calendarTasks[dateKey].length === 0) {
              delete calendarTasks[dateKey];
            }
            saveTasks();
            renderCalendar();
          });

          li.appendChild(taskSpan);
          li.appendChild(deleteBtn);
          taskList.appendChild(li);
        });
      }

      dateBox.innerHTML = `<div class="date-number">${day}</div>`;
      dateBox.appendChild(taskList);

      // Event untuk menambah task
      dateBox.addEventListener("click", () => {
        const taskText = prompt(
          `Tambah task untuk ${day} ${months[month]} ${year}:`
        );
        if (taskText && taskText.trim() !== "") {
          if (!calendarTasks[dateKey]) {
            calendarTasks[dateKey] = [];
          }
          calendarTasks[dateKey].push(taskText.trim());
          saveTasks();
          renderCalendar();
        }
      });

      calendarGrid.appendChild(dateBox);
    }
  }

  // --- Simpan ke localStorage ---
  function saveTasks() {
    localStorage.setItem("calendarTasks", JSON.stringify(calendarTasks));
  }

  // --- Mulai Aplikasi ---
  initializeSelectors();
  renderCalendar();
});
