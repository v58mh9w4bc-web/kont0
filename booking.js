// Полный список услуг салона
const SERVICES = [
    { id: 'mens_haircut', name: 'Мужская стрижка', duration: 30, category: 'Мужской зал' },
    { id: 'beard_trim', name: 'Стрижка бороды', duration: 30, category: 'Мужской зал' },
    { id: 'beard_modeling', name: 'Моделирование бороды', duration: 60, category: 'Мужской зал' },
    { id: 'royal_shave', name: 'Королевское бритье', duration: 60, category: 'Мужской зал' },
    { id: 'gray_camouflage', name: 'Камуфляж седины', duration: 60, category: 'Мужской зал' },
    
    { id: 'womens_haircut', name: 'Женская стрижка', duration: 60, category: 'Женский зал' },
    { id: 'complex_coloring', name: 'Сложное окрашивание', duration: 180, category: 'Женский зал' },
    { id: 'balayage', name: 'Балаяж / Шатуш', duration: 180, category: 'Женский зал' },
    { id: 'styling', name: 'Укладка', duration: 60, category: 'Женский зал' },
    { id: 'hair_lamination', name: 'Ламинирование волос', duration: 120, category: 'Женский зал' },
    
    { id: 'manicure', name: 'Маникюр', duration: 90, category: 'Ногтевой сервис' },
    { id: 'pedicure', name: 'Педикюр', duration: 90, category: 'Ногтевой сервис' },
    { id: 'nail_extension', name: 'Наращивание ногтей', duration: 120, category: 'Ногтевой сервис' },
    { id: 'nail_design', name: 'Дизайн ногтей', duration: 60, category: 'Ногтевой сервис' },
    { id: 'nail_strengthening', name: 'Укрепление ногтей', duration: 60, category: 'Ногтевой сервис' },
    
    { id: 'facial_cleaning', name: 'Чистка лица', duration: 90, category: 'Косметология' },
    { id: 'peeling', name: 'Пилинги', duration: 60, category: 'Косметология' },
    { id: 'face_massage', name: 'Массаж лица', duration: 60, category: 'Косметология' },
    { id: 'facial_treatment', name: 'Уходовые процедуры', duration: 90, category: 'Косметология' },
    { id: 'mesotherapy', name: 'Мезотерапия', duration: 60, category: 'Косметология' },
    
    { id: 'brow_shaping', name: 'Оформление бровей', duration: 60, category: 'Брови и ресницы' },
    { id: 'brow_coloring', name: 'Окрашивание бровей', duration: 60, category: 'Брови и ресницы' },
    { id: 'brow_lamination', name: 'Ламинирование бровей', duration: 90, category: 'Брови и ресницы' },
    { id: 'lash_extension', name: 'Наращивание ресниц', duration: 120, category: 'Брови и ресницы' },
    { id: 'lash_lamination', name: 'Ламинирование ресниц', duration: 90, category: 'Брови и ресницы' },
    
    { id: 'makeup', name: 'Визаж', duration: 60, category: 'Дополнительно' },
    { id: 'wedding_look', name: 'Свадебный образ', duration: 180, category: 'Дополнительно' },
    { id: 'evening_makeup', name: 'Вечерний макияж', duration: 90, category: 'Дополнительно' },
    { id: 'stylist_consultation', name: 'Консультация стилиста', duration: 60, category: 'Дополнительно' },
];

// Рабочие часы салона
const WORKING_HOURS = { start: 9, end: 21 };

// Текущее состояние бронирования
let bookingState = {
    service: null,
    master: null,
    date: null,
    time: null,
    name: null,
    phone: null
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    setMinDate();
});

// Инициализация данных в localStorage
function initializeData() {
    if (!localStorage.getItem('masters')) {
        const defaultMasters = [
            { id: 1, name: 'Анна Иванова', services: ['womens_haircut', 'complex_coloring', 'balayage', 'styling', 'hair_lamination'] },
            { id: 2, name: 'Дмитрий Петров', services: ['mens_haircut', 'beard_trim', 'beard_modeling', 'royal_shave', 'gray_camouflage'] },
            { id: 3, name: 'Елена Смирнова', services: ['manicure', 'pedicure', 'nail_extension', 'nail_design', 'nail_strengthening'] },
            { id: 4, name: 'Ольга Козлова', services: ['facial_cleaning', 'peeling', 'face_massage', 'facial_treatment', 'mesotherapy'] },
            { id: 5, name: 'Мария Новикова', services: ['brow_shaping', 'brow_coloring', 'brow_lamination', 'lash_extension', 'lash_lamination'] },
        ];
        localStorage.setItem('masters', JSON.stringify(defaultMasters));
    }
    
    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify([]));
    }
}

// Установка минимальной даты (сегодня)
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        dateInput.min = today;
        dateInput.value = today;
    }
}

// Открытие модального окна
function openBookingModal() {
    document.getElementById('bookingModal').classList.add('active');
    loadServices();
    goToStep(1);
}

// Закрытие модального окна
function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
    resetBooking();
}

// Сброс состояния бронирования
function resetBooking() {
    bookingState = { service: null, master: null, date: null, time: null, name: null, phone: null };
}

// Переход между шагами
function goToStep(step) {
    document.querySelectorAll('.booking-step').forEach(el => el.classList.add('hidden'));
    document.getElementById(`step${step}`).classList.remove('hidden');
    
    // Обновление прогресс-бара
    document.getElementById('currentStep').textContent = step;
    document.getElementById('progressBar').style.width = `${step * 25}%`;
    
    // Обновление summary на шаге 4
    if (step === 4) {
        updateSummary();
    }
}

// Обновление summary
function updateSummary() {
    document.getElementById('summaryService').textContent = bookingState.service.name;
    document.getElementById('summaryMaster').textContent = bookingState.master.name;
    document.getElementById('summaryDate').textContent = formatDate(bookingState.date);
    document.getElementById('summaryTime').textContent = bookingState.time;
    document.getElementById('summaryDuration').textContent = bookingState.service.duration;
}

// Загрузка списка услуг с выезжающими подпунктами
function loadServices() {
    const container = document.getElementById('servicesList');
    const groupedServices = {};
    
    SERVICES.forEach(service => {
        if (!groupedServices[service.category]) {
            groupedServices[service.category] = [];
        }
        groupedServices[service.category].push(service);
    });
    
    let html = '';
    let categoryIndex = 0;
    
    Object.keys(groupedServices).forEach(category => {
        const categoryId = `category-${categoryIndex}`;
        const isExpanded = categoryIndex === 0 ? 'expanded' : '';
        
        html += `
            <div class="border border-gray-200 rounded-lg overflow-hidden mb-2">
                <div class="service-item p-4 bg-gray-50 flex justify-between items-center" onclick="toggleCategory('${categoryId}')">
                    <div>
                        <h5 class="font-semibold text-gray-800">${category}</h5>
                        <p class="text-xs text-gray-500">${groupedServices[category].length} услуг</p>
                    </div>
                    <span class="text-gray-400 text-2xl category-arrow" id="${categoryId}-arrow">▼</span>
                </div>
                <div class="subservice-container ${isExpanded}" id="${categoryId}">
                    <div class="p-2 bg-white">`;
        
        groupedServices[category].forEach(service => {
            html += `
                <button onclick="selectService('${service.id}')" 
                    class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition mb-1 border border-transparent hover:border-gray-300">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="font-medium text-gray-800">${service.name}</div>
                            <div class="text-xs text-gray-500">${service.duration} мин</div>
                        </div>
                        <span class="text-gray-400">→</span>
                    </div>
                </button>`;
        });
        
        html += `
                    </div>
                </div>
            </div>`;
        
        categoryIndex++;
    });
    
    container.innerHTML = html;
    
    // Открыть первую категорию по умолчанию
    if (categoryIndex > 0) {
        const firstArrow = document.getElementById('category-0-arrow');
        if (firstArrow) firstArrow.textContent = '▲';
    }
}

// Переключение категории
function toggleCategory(categoryId) {
    const container = document.getElementById(categoryId);
    const arrow = document.getElementById(`${categoryId}-arrow`);
    
    if (container.classList.contains('expanded')) {
        container.classList.remove('expanded');
        arrow.textContent = '▼';
    } else {
        container.classList.add('expanded');
        arrow.textContent = '▲';
    }
}

// Выбор услуги
function selectService(serviceId) {
    bookingState.service = SERVICES.find(s => s.id === serviceId);
    loadMasters();
    goToStep(2);
}

// Загрузка мастеров (с фильтрацией по услуге)
function loadMasters() {
    const container = document.getElementById('mastersList');
    const masters = JSON.parse(localStorage.getItem('masters') || '[]');
    
    // Фильтрация: показываем только мастеров, которые оказывают выбранную услугу
    const availableMasters = masters.filter(master => 
        master.services.includes(bookingState.service.id)
    );
    
    if (availableMasters.length === 0) {
        container.innerHTML = '<p class="text-gray-600">К сожалению, нет доступных мастеров для этой услуги.</p>';
        return;
    }
    
    let html = '';
    availableMasters.forEach(master => {
        html += `<button onclick="selectMaster(${master.id})" 
            class="w-full text-left p-5 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-md transition">
            <div class="flex justify-between items-center">
                <div>
                    <div class="font-semibold text-lg text-gray-800">${master.name}</div>
                    <div class="text-sm text-gray-500 mt-1">Специалист по выбранной услуге</div>
                </div>
                <span class="text-gray-400 text-2xl">→</span>
            </div>
        </button>`;
    });
    
    container.innerHTML = html;
}

// Выбор мастера
function selectMaster(masterId) {
    const masters = JSON.parse(localStorage.getItem('masters') || '[]');
    bookingState.master = masters.find(m => m.id === masterId);
    
    // Обновление информации о мастере и длительности
    document.getElementById('selectedMaster').textContent = bookingState.master.name;
    document.getElementById('serviceDuration').textContent = bookingState.service.duration;
    
    goToStep(3);
    loadTimeSlots();
}

// Загрузка временных слотов
function loadTimeSlots() {
    const container = document.getElementById('timeSlotsList');
    const dateInput = document.getElementById('bookingDate');
    
    if (!dateInput.value) {
        container.innerHTML = '<p class="text-gray-600 col-span-4 text-center py-4">Выберите дату</p>';
        return;
    }
    
    bookingState.date = dateInput.value;
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const serviceDuration = bookingState.service.duration;
    
    let html = '';
    for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const isBooked = checkIfBooked(bookings, bookingState.master.id, bookingState.date, timeStr, serviceDuration);
            
            // Проверка, что слот не выходит за рабочее время
            const endTime = calculateEndTime(hour, minute, serviceDuration);
            if (endTime.hour >= WORKING_HOURS.end) continue;
            
            html += `<button onclick="selectTime('${timeStr}')" 
                class="time-slot p-3 border-2 rounded-lg font-medium text-sm ${isBooked ? 'disabled bg-gray-100 text-gray-400 border-gray-200' : 'border-gray-300 hover:border-gray-500 hover:bg-gray-50'}" 
                ${isBooked ? 'disabled' : ''}>
                ${timeStr}
            </button>`;
        }
    }
    
    container.innerHTML = html;
}

// Проверка занятости слота
function checkIfBooked(bookings, masterId, date, time, duration) {
    const [hours, minutes] = time.split(':').map(Number);
    const slotStart = hours * 60 + minutes;
    const slotEnd = slotStart + duration;
    
    return bookings.some(booking => {
        if (booking.masterId !== masterId || booking.date !== date) return false;
        
        const [bookingHours, bookingMinutes] = booking.time.split(':').map(Number);
        const bookingStart = bookingHours * 60 + bookingMinutes;
        const bookingEnd = bookingStart + booking.duration;
        
        // Проверка пересечения временных интервалов
        return (slotStart < bookingEnd && slotEnd > bookingStart);
    });
}

// Расчет времени окончания
function calculateEndTime(hour, minute, duration) {
    const totalMinutes = hour * 60 + minute + duration;
    return {
        hour: Math.floor(totalMinutes / 60),
        minute: totalMinutes % 60
    };
}

// Выбор времени
function selectTime(time) {
    bookingState.time = time;
    goToStep(4);
}

// Подтверждение бронирования
function confirmBooking() {
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    
    if (!name) {
        alert('Пожалуйста, введите ваше имя');
        return;
    }
    
    if (!phone) {
        alert('Пожалуйста, введите номер телефона');
        return;
    }
    
    bookingState.name = name;
    bookingState.phone = phone;
    
    // Сохранение бронирования
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const newBooking = {
        id: Date.now(),
        serviceId: bookingState.service.id,
        serviceName: bookingState.service.name,
        duration: bookingState.service.duration,
        masterId: bookingState.master.id,
        masterName: bookingState.master.name,
        date: bookingState.date,
        time: bookingState.time,
        clientName: bookingState.name,
        phone: bookingState.phone,
        status: 'Новая',
        createdAt: new Date().toISOString()
    };
    
    // Отладка: проверим, что сохраняется
    console.log('Новая запись:', newBooking);
    console.log('Имя клиента:', newBooking.clientName);
    
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Проверим, что сохранилось в localStorage
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const lastBooking = savedBookings[savedBookings.length - 1];
    console.log('Сохраненная запись:', lastBooking);
    console.log('Сохраненное имя клиента:', lastBooking.clientName);
    
    alert(`✅ Запись успешно создана!\n\n👤 Имя: ${bookingState.name}\n📋 Услуга: ${bookingState.service.name}\n👤 Мастер: ${bookingState.master.name}\n📅 Дата: ${formatDate(bookingState.date)}\n🕐 Время: ${bookingState.time}\n\nМы свяжемся с вами для подтверждения!`);
    
    closeBookingModal();
}

// Форматирование даты для отображения
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeBookingModal();
    }
}
