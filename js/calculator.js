/* ========================================
   Smile Calculator — Interactive Cost Estimator
   ======================================== */

(function () {
  'use strict';

  var services = [
    { id: 'hygiene', name: 'Профессиональная гигиена', desc: 'Чистка, удаление камня, полировка', price: 6000, time: '1 визит, 40-60 мин' },
    { id: 'caries', name: 'Лечение кариеса', desc: 'Лечение жевательных и фронтальных зубов', price: 4500, time: '1 визит, 30-50 мин' },
    { id: 'restoration', name: 'Реставрация зуба', desc: 'Восстановление формы и эмали', price: 9000, time: '1 визит, 40-60 мин' },
    { id: 'crown', name: 'Металлокерамическая коронка', desc: 'Надёжное и эстетичное протезирование', price: 12000, time: '2 визита, 7-10 дней' },
    { id: 'prosthesis', name: 'Бюгельный протез', desc: 'Комфортное съёмное протезирование', price: 48000, time: '3-4 визита, 2-3 недели' },
    { id: 'implant', name: 'Имплантация зуба', desc: 'Полная замена корня зуба', price: 35000, time: '2-3 визита, 3-6 мес' },
    { id: 'whitening', name: 'Отбеливание зубов', desc: 'Профессиональное отбеливание', price: 15000, time: '1 визит, 60-90 мин' },
    { id: 'seal', name: 'Пломбирование каналов', desc: 'Эндодонтическое лечение', price: 3500, time: '1-2 визита, 40-70 мин' }
  ];

  var container = document.getElementById('calculator');
  if (!container) return;

  var servicesList = container.querySelector('.calc-services');
  var totalEl = container.querySelector('.calc-total-price');
  var timelineEl = container.querySelector('.timeline');
  var selected = {};

  function renderServices() {
    servicesList.innerHTML = '';
    services.forEach(function (service) {
      var isSelected = !!selected[service.id];
      var item = document.createElement('div');
      item.className = 'calc-item' + (isSelected ? ' selected' : '');
      item.setAttribute('data-id', service.id);
      item.innerHTML =
        '<div class="calc-checkbox">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
        '</div>' +
        '<div class="calc-item-info">' +
          '<div class="calc-item-name">' + service.name + '</div>' +
          '<div class="calc-item-desc">' + service.desc + '</div>' +
        '</div>' +
        '<div class="calc-item-price">' + formatPrice(service.price) + '</div>';

      item.addEventListener('click', function () {
        toggleService(service.id);
      });

      servicesList.appendChild(item);
    });
  }

  function toggleService(id) {
    if (selected[id]) {
      delete selected[id];
    } else {
      selected[id] = true;
    }
    updateUI();
  }

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
  }

  function formatPriceAnimated(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function updateUI() {
    // Update checkboxes
    document.querySelectorAll('.calc-item').forEach(function (item) {
      var id = item.getAttribute('data-id');
      if (selected[id]) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });

    // Calculate total
    var total = 0;
    var selectedServices = [];
    services.forEach(function (service) {
      if (selected[service.id]) {
        total += service.price;
        selectedServices.push(service);
      }
    });

    // Animate total price
    animateTotal(total);

    // Update timeline
    renderTimeline(selectedServices);
  }

  function animateTotal(target) {
    var current = parseInt(totalEl.textContent.replace(/\s/g, ''), 10) || 0;
    var diff = target - current;
    var steps = 30;
    var step = 0;

    function tick() {
      step++;
      var progress = step / steps;
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(current + diff * eased);
      totalEl.innerHTML = formatPriceAnimated(value) + ' <span class="currency">₽</span>';
      if (step < steps) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  function renderTimeline(selectedServices) {
    if (!timelineEl) return;
    timelineEl.innerHTML = '';

    if (selectedServices.length === 0) {
      timelineEl.innerHTML = '<div style="color: rgba(255,255,255,0.3); font-size: 0.85rem; padding: 1rem 0;">Выберите услуги для просмотра графика</div>';
      return;
    }

    // Sort by time complexity (simple first)
    var timeOrder = { '1 визит, 30-50 мин': 1, '1 визит, 40-60 мин': 1, '1 визит, 60-90 мин': 1, '1-2 визита, 40-70 мин': 2, '2 визита, 7-10 дней': 3, '2-3 визита, 3-6 мес': 4, '3-4 визита, 2-3 недели': 3 };
    selectedServices.sort(function (a, b) {
      return (timeOrder[a.time] || 1) - (timeOrder[b.time] || 1);
    });

    selectedServices.forEach(function (service, index) {
      var item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML =
        '<div class="timeline-dot"></div>' +
        '<div class="timeline-item-title">' + service.name + '</div>' +
        '<div class="timeline-item-time">' + service.time + '</div>';
      item.style.opacity = '0';
      item.style.transform = 'translateX(-10px)';
      timelineEl.appendChild(item);

      // Stagger animation
      setTimeout(function () {
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, index * 100);
    });
  }

  // Initialize
  renderServices();
  updateUI();

})();
