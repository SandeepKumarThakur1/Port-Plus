// Mobile navigation (shared by every page)
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  menuButton?.addEventListener("click", () => {
    if (!mobileMenu) return;

    const isOpen = mobileMenu.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });
});
