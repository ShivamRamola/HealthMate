// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.querySelector('.modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const openModalButton = document.querySelector('#open-modal');
    const closeModalButton = document.querySelector('#close-modal');

    if (modal && modalOverlay && openModalButton && closeModalButton) {
        openModalButton.addEventListener('click', () => {
            modal.classList.add('active');
            modalOverlay.classList.add('active');
        });

        closeModalButton.addEventListener('click', () => {
            modal.classList.remove('active');
            modalOverlay.classList.remove('active');
        });

        modalOverlay.addEventListener('click', () => {
            modal.classList.remove('active');
            modalOverlay.classList.remove('active');
        });
    } else {
        console.warn('Modal elements not found. Check your HTML structure.');
    }
});
