/* ========================================
   Before/After Comparison Slider
   ======================================== */

(function () {
  'use strict';

  var sliders = document.querySelectorAll('.comparison-slider');

  sliders.forEach(function (slider) {
    var before = slider.querySelector('.comparison-before');
    var handle = slider.querySelector('.comparison-handle');
    var isDragging = false;

    function getPosition(e) {
      var rect = slider.getBoundingClientRect();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var x = clientX - rect.left;
      var percent = Math.max(0, Math.min(x / rect.width * 100, 100));
      return percent;
    }

    function updateSlider(percent) {
      before.style.width = percent + '%';
      handle.style.left = percent + '%';
    }

    // Mouse events
    slider.addEventListener('mousedown', function (e) {
      isDragging = true;
      updateSlider(getPosition(e));
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      updateSlider(getPosition(e));
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
    });

    // Touch events
    slider.addEventListener('touchstart', function (e) {
      isDragging = true;
      updateSlider(getPosition(e));
    }, { passive: true });

    slider.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      updateSlider(getPosition(e));
      e.preventDefault();
    }, { passive: false });

    slider.addEventListener('touchend', function () {
      isDragging = false;
    });

    // Keyboard accessibility
    slider.setAttribute('tabindex', '0');
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-label', 'Сравнение до и после');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');
    slider.setAttribute('aria-valuenow', '50');

    slider.addEventListener('keydown', function (e) {
      var current = parseFloat(before.style.width) || 50;
      var step = 5;
      if (e.key === 'ArrowLeft') {
        updateSlider(Math.max(0, current - step));
        slider.setAttribute('aria-valuenow', Math.round(Math.max(0, current - step)));
      } else if (e.key === 'ArrowRight') {
        updateSlider(Math.min(100, current + step));
        slider.setAttribute('aria-valuenow', Math.round(Math.min(100, current + step)));
      }
    });

    // Initial position
    updateSlider(50);
  });

})();
