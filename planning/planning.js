document.addEventListener("DOMContentLoaded", () => {
  // Elemen-elemen DOM
  const viewButtons = document.querySelectorAll(".view-btn");
  const planForm = document.getElementById("plan-form");
  const planInput = document.getElementById("plan-input");
  const planListTitle = document.getElementById("plan-list-title");
  const planList = document.getElementById("plan-list");

  // Elemen Sidebar
  const sidebarWeekly = document.getElementById("sidebar-weekly");
  const sidebarMonthly = document.getElementById("sidebar-monthly");
  const sidebarYearly = document.getElementById("sidebar-yearly");

  // State aplikasi
  let currentView = "weekly"; // 'weekly', 'monthly', 'yearly'
  let allPlans = JSON.parse(localStorage.getItem("allPlans")) || {
    weekly: [],
    monthly: [],
    yearly: [],
  };

  // --- Fungsi untuk menyimpan data ---
  const savePlans = () => {
    localStorage.setItem("allPlans", JSON.stringify(allPlans));
  };

  // --- Fungsi untuk merender semua tampilan ---
  const renderAll = () => {
    renderMainList();
    renderSidebar();
  };

  // --- Fungsi untuk merender list utama ---
  const renderMainList = () => {
    planList.innerHTML = "";
    const plansForCurrentView = allPlans[currentView];

    // Update judul
    planListTitle.textContent = `Rencana ${
      currentView.charAt(0).toUpperCase() + currentView.slice(1)
    }`;

    if (plansForCurrentView.length === 0) {
      planList.innerHTML = "<li>Belum ada rencana.</li>";
      return;
    }

    plansForCurrentView.forEach((planText, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${planText}</span>
        <button class="delete-btn" data-index="${index}">Hapus</button>
      `;
      planList.appendChild(li);
    });
  };

  // --- Fungsi untuk merender sidebar ---
  const renderSidebar = () => {
    const renderList = (element, plans) => {
      element.innerHTML = "";
      if (plans.length === 0) {
        element.innerHTML = "<li>-</li>";
        return;
      }
      plans.forEach((plan) => {
        const li = document.createElement("li");
        li.textContent = plan;
        element.appendChild(li);
      });
    };

    renderList(sidebarWeekly, allPlans.weekly);
    renderList(sidebarMonthly, allPlans.monthly);
    renderList(sidebarYearly, allPlans.yearly);
  };

  // --- Event Listeners ---

  // Tombol ganti view (Mingguan/Bulanan/Tahunan)
  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      viewButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      currentView = button.dataset.view;
      renderMainList();
    });
  });

  // Form untuk menambah rencana
  planForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newPlan = planInput.value.trim();
    if (newPlan) {
      allPlans[currentView].push(newPlan);
      savePlans();
      renderAll();
      planInput.value = "";
    }
  });

  // Tombol hapus (menggunakan event delegation)
  planList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.dataset.index;
      allPlans[currentView].splice(index, 1);
      savePlans();
      renderAll();
    }
  });

  // --- Inisialisasi Aplikasi ---
  renderAll();
});
