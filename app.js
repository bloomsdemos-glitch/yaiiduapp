// яЇду: Валки — Mini App скелет (SPA без фреймворків)

const AppState = {
  view: 'home',
  role: null,                    // 'driver' | 'passenger'
  authed: false,
  notifications: [],
  data: {}
};

// Фейкові дані — унікальні для водіїв та пасажирів
const STREETS = [
  'вул. Весняна, 12','вул. Зоряна, 7','вул. Музейна, 3','вул. Стадіонна, 45',
  'вул. Центральна, 10','вул. Шевченка, 22','вул. Харьківська, 1','вул. Молодіжна, 18',
  'пров. Лісовий, 4','вул. Сонячна, 9','вул. Польова, 16','вул. Квіткова, 8',
  'вул. Джерельна, 14','вул. Миру, 2','вул. Пушкіна, 11','вул. Слобожанська, 33',
  'вул. Річкова, 6','вул. Валківська, 5','вул. Козацька, 21','вул. Свободи, 27'
];

const Random = {
  code: () => String(Math.floor(100000 + Math.random()*900000)),
  pick: arr => arr[Math.floor(Math.random()*arr.length)],
};

const Drivers = [
  {id:'d1', name:'Сергій', phone:'+380 67 123 45 67', car:'Skoda Octavia', rating:4.7, online:true, busy:false, eta:0,
    reviews:[
      {a:'Віта', text:'Все чітко і вчасно. Рекомендую!', stars:5},
      {a:'Ігор', text:'Їхав швидкувато, але акуратно.', stars:4},
      {a:'Олеся', text:'Не сподобався запах у салоні.', stars:3}
    ]},
  {id:'d2', name:'Олександр', phone:'+380 50 222 31 21', car:'Toyota Corolla', rating:4.9, online:true, busy:true, eta:12,
    reviews:[
      {a:'Марина', text:'Дуже ввічливий, допоміг з багажем.', stars:5},
      {a:'Роман', text:'Затримався на 5 хвилин.', stars:4}
    ]},
  {id:'d3', name:'Іван', phone:'+380 93 555 14 14', car:'Renault Megane', rating:4.5, online:false, busy:true, eta:25,
    reviews:[{a:'Юлія', text:'Нормально, без зайвих розмов.', stars:4}]},
  {id:'d4', name:'Тарас', phone:'+380 97 777 77 11', car:'Volkswagen Golf', rating:4.2, online:true, busy:false, eta:0,
    reviews:[
      {a:'Леся', text:'Трохи брудний килимок, але недалеко їхали.', stars:3},
      {a:'Анна', text:'Приємна поїздка.', stars:5}
    ]},
  {id:'d5', name:'Юрій', phone:'+380 63 801 33 09', car:'Hyundai Elantra', rating:4.8, online:true, busy:false, eta:0,
    reviews:[{a:'Олег', text:'Швидко та комфортно.', stars:5}]},
  {id:'d6', name:'Петро', phone:'+380 95 441 92 12', car:'Daewoo Lanos', rating:3.9, online:false, busy:true, eta:35,
    reviews:[{a:'Катерина', text:'Дешево, але шумна машина.', stars:3}]},
  {id:'d7', name:'Віктор', phone:'+380 68 111 22 33', car:'Kia Ceed', rating:4.6, online:true, busy:true, eta:7,
    reviews:[{a:'Микита', text:'Приїхав швидко, дякую!', stars:5}]},
  {id:'d8', name:'Роман', phone:'+380 66 909 00 55', car:'Mazda 3', rating:4.4, online:true, busy:false, eta:0, reviews:[]},
  {id:'d9', name:'Дмитро', phone:'+380 73 999 88 77', car:'Opel Astra', rating:4.1, online:false, busy:true, eta:18, reviews:[]},
  {id:'d10',name:'Максим', phone:'+380 98 345 67 80', car:'Nissan Leaf', rating:4.9, online:true, busy:false, eta:0, reviews:[]},
  {id:'d11',name:'Лев', phone:'+380 67 301 77 21', car:'Skoda Fabia', rating:4.0, online:false, busy:true, eta:40, reviews:[]},
  {id:'d12',name:'Артем', phone:'+380 50 777 04 04', car:'Peugeot 308', rating:4.3, online:true, busy:false, eta:0, reviews:[]}
];

const Passengers = [
  {id:'p1', name:'Віта', phone:'+380 67 000 11 22', rating:4.8, online:true,
    orders:[] , reviews:[
      {a:'Сергій', text:'Пунктуальна, приємна в спілкуванні.', stars:5},
      {a:'Олександр', text:'Запізнилась на кілька хвилин.', stars:4}
    ]},
  {id:'p2', name:'Михайло', phone:'+380 50 120 33 44', rating:4.1, online:true, orders:[], reviews:[
    {a:'Іван', text:'Гучно говорив по телефону.', stars:3}
  ]},
  {id:'p3', name:'Олена', phone:'+380 93 900 44 55', rating:4.9, online:false, orders:[], reviews:[]},
  {id:'p4', name:'Ігор', phone:'+380 63 222 88 99', rating:4.2, online:true, orders:[], reviews:[]},
  {id:'p5', name:'Ліда', phone:'+380 97 121 21 21', rating:4.7, online:false, orders:[], reviews:[]}
];

// Замовлення: статуси — active(зелений), queued(помаранчевий, для водія), archived(сірий)
const DriverOrders = {
  d1: [
    {code: Random.code(), passenger:'Віта', date:'2025-08-26', time:'18:45', status:'active', route:'Валки → Харків'},
    {code: Random.code(), passenger:'Ігор', date:'2025-08-26', time:'19:20', status:'queued', route:'Харків → Валки'}
  ],
  d2: [
    {code: Random.code(), passenger:'Марина', date:'2025-08-26', time:'18:10', status:'active', route:'Валки → Центр'},
    {code: Random.code(), passenger:'Роман', date:'2025-08-26', time:'20:00', status:'queued', route:'Валки → Харків'}
  ],
  d4: [{code: Random.code(), passenger:'Анна', date:'2025-08-24', time:'13:10', status:'archived', route:'Музейна → Стадіонна'}],
  d5: [],
  d7: [],
  d8: [],
  d10: []
};

const PassengerOrders = {
  p1: [{code: Random.code(), driver:'Сергій', date:'2025-08-26', time:'18:45', status:'active', route:'Валки → Харків'}],
  p2: [{code: Random.code(), driver:'Олександр', date:'2025-08-20', time:'09:30', status:'archived', route:'Стадіонна → Музейна'}],
  p3: [],
  p4: [],
  p5: []
};

// Утиліти UI
const $ = sel => document.querySelector(sel);
const app = () => $('#app');
const setView = (view, payload={}) => { AppState.view=view; AppState.data=payload; render(); };
const back = () => window.history.back();

window.addEventListener('popstate', () => render());
function go(view, payload={}){
  history.pushState({view, payload}, '', '#'+view);
  setView(view, payload);
}

function iconStar(full){ return `<i class="${full?'ri-star-fill':'ri-star-line'}"></i>`; }
function Stars(val=0){
  const full = Math.round(val);
  return `<div class="stars">${Array.from({length:5},(_,i)=>iconStar(i<full)).join('')}</div>`;
}
function StatusPill(status){
  if(status==='active') return `<span class="pill green">активне</span>`;
  if(status==='queued') return `<span class="pill orange">в черзі</span>`;
  return `<span class="pill grey">архів</span>`;
}
function Dot(color){ return `<span class="dot ${color}"></span>`; }

function header({showBack=false, role=null}={}){
  const avatarIcon = role==='driver' ? 'ri-car-line' : role==='passenger' ? 'ri-armchair-line' : null;
  return `
    <div class="header">
      <div class="header-left">
        ${showBack ? `<button class="back-btn" onclick="back()"><i class="ri-arrow-left-line"></i></button>` : ''}
      </div>
      <div class="header-right">
        ${avatarIcon ? `<div class="avatar"><i class="${avatarIcon}"></i></div>` : ''}
        <button class="icon-btn" onclick="toggleNotices()">
          <i class="ri-notification-3-line"></i>
        </button>
        ${!AppState.authed ? `<button class="btn" onclick="authNow()"><i class="ri-login-box-line"></i> Увійти</button>` : `<button class="btn" onclick="logout()"><i class="ri-logout-box-line"></i> Вийти</button>`}
      </div>
    </div>
  `;
}

function authNow(){
  // імітація Telegram Auth — просто фліп стану
  AppState.authed = true;
  if(AppState.role==='driver') go('driver.home'); else if(AppState.role==='passenger') go('passenger.home');
}
function logout(){
  AppState.authed = false;
  AppState.role = null;
  go('home');
}

/* Notifications */
function toggleNotices(){
  const p = document.querySelector('#notice-panel');
  if(!p) return;
  p.classList.toggle('active');
}
function pushNotice(text){
  AppState.notifications.unshift({id:Date.now(), text});
  renderNotices();
}

function renderNotices(){
  let n = $('#notice-panel');
  if(!n){
    n = document.createElement('div');
    n.id = 'notice-panel';
    n.className = 'notice-panel';
    document.body.appendChild(n);
  }
  const items = AppState.notifications.length
    ? AppState.notifications.map(x=>`<div class="notice-item"><i class="ri-notification-3-line"></i><div>${x.text}</div></div>`).join('')
    : `<div class="notice-item"><i class="ri-notification-off-line"></i><div>Немає сповіщень</div></div>`;
  n.innerHTML = `<div class="row"><strong>Сповіщення</strong><button class="back-btn" onclick="document.querySelector('#notice-panel').classList.remove('active')">Закрити</button></div><div class="mt-3 stack">${items}</div>`;
}

/* HOME */
function viewHome(){
  return `
    <div class="card">
      ${header()}
      <div class="logo">
        <span>яЇду</span><span class="logo-emoji">🚕</span>
      </div>
      <div class="sub">Локальний сервіс: попутка, таксі та Валки ↔ Харків</div>
      <div class="actions">
        <button class="action-btn" onclick="go('auth.driver')">
          <i class="ri-steering-2-line"></i> Я водій
        </button>
        <button class="action-btn" onclick="go('auth.passenger')">
          <i class="ri-user-3-line"></i> Я пасажир
        </button>
      </div>
      <div class="mt-6 notice">
        Підключено іконки, glassmorphism, адаптив. Кнопка «Увійти» доступна завжди.
      </div>
    </div>
  `;
}

/* AUTH */
function viewAuth(role){
  AppState.role = role;
  const roleLabel = role==='driver' ? 'водій' : 'пасажир';
  const avatarIcon = role==='driver' ? 'ri-car-line' : 'ri-armchair-line';
  return `
    <div class="card">
      ${header({showBack:true, role})}
      <div class="row gap-3">
        <div class="avatar"><i class="${avatarIcon}"></i></div>
        <div>
          <div class="h1">Вхід — ${roleLabel}</div>
          <div class="sub">Автентифікація через Telegram. Поля логіну не потрібні.</div>
        </div>
      </div>

      <div class="stack mt-5">
        <button class="btn primary block" onclick="authNow()"><i class="ri-login-box-line"></i> Увійти</button>
        <button class="btn block" onclick="alert('«Зареєструватись» = авторизація через Telegram (пізніше)')">
          <i class="ri-send-plane-2-line"></i> Зареєструватись
        </button>
      </div>
    </div>
  `;
}

/* DRIVER HOME */
function viewDriverHome(){
  const meId = 'd1'; // демо
  const myOrders = DriverOrders[meId] || [];
  const activeCount = myOrders.filter(o=>o.status==='active').length;
  const queuedCount = myOrders.filter(o=>o.status==='queued').length;
  const seekingPassengers = sampleSeekingPassengers().length;

  return `
    <div class="card">
      ${header({showBack:true, role:'driver'})}
      <div class="h1">Панель водія</div>
      <div class="sub">Ваші інструменти та замовлення</div>

      <div class="stack">
        <div class="section stack">
          <div class="row">
            <div class="item left" onclick="go('driver.orders')">
              <div class="meta"><i class="ri-smartphone-line"></i><div>
                <div class="name">Мої замовлення</div>
                <div class="muted">Активні: ${activeCount} • В черзі: ${queuedCount}</div>
              </div></div>
            </div>
          </div>

          <div class="row">
            <div class="item left" onclick="go('driver.seeking')">
              <div class="meta"><i class="ri-user-search-line"></i><div>
                <div class="name">Шукають водія зараз</div>
                <div class="muted">Кількість: ${seekingPassengers}</div>
              </div></div>
              ${Dot('green')}
            </div>
          </div>

          <div class="row">
            <div class="item left" onclick="go('driver.rating')">
              <div class="meta"><i class="ri-star-smile-line"></i><div>
                <div class="name">Мій рейтинг</div>
                <div class="muted">Відгуки та оцінки</div>
              </div></div>
              <div>${Stars(4.7)}</div>
            </div>
          </div>

          <div class="row">
            <div class="item left" onclick="go('driver.kharkiv')">
              <div class="meta"><i class="ri-route-line"></i><div>
                <div class="name">Валки — Харків</div>
                <div class="muted">Спеціальний поток замовлень</div>
              </div></div>
            </div>
          </div>

          <div class="row">
            <div class="item left" onclick="driverArrived()">
              <div class="meta"><i class="ri-map-pin-time-line"></i><div>
                <div class="name">Я на місці</div>
                <div class="muted">Миттєве сповіщення пасажиру</div>
              </div></div>
              <span class="pill green">швидка дія</span>
            </div>
          </div>
        </div>

        <div class="section stack">
          <div class="row">
            <div class="item left" onclick="go('driver.settings')">
              <div class="meta"><i class="ri-settings-3-line"></i><div class="name">Налаштування</div></div>
            </div>
          </div>
          <div class="row">
            <div class="item left" onclick="go('driver.qr')">
              <div class="meta"><i class="ri-qr-code-line"></i><div class="name">QR-код для оплати</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function driverArrived(){
  pushNotice('Водій вже чекає на місці.');
  alert('Сповіщення надіслано: «Водій вже чекає на місці».');
}

/* DRIVER: Orders */
function viewDriverOrders(){
  const meId = 'd1';
  const list = (DriverOrders[meId]||[]);
  return `
    <div class="card">
      ${header({showBack:true, role:'driver'})}
      <div class="h1">Мої замовлення</div>
      <div class="stack mt-4">
        ${list.length ? list.map(o=>`
          <div class="item" onclick="go('driver.order.detail',{order:'${o.code}'})">
            <div>
              <div class="name">#${o.code} — ${o.passenger}</div>
              <div class="muted">${o.date} • ${o.time} • ${o.route}</div>
            </div>
            ${StatusPill(o.status)}
          </div>
        `).join('') : `<div class="notice">Поки немає замовлень</div>`}
      </div>
    </div>
  `;
}

function viewDriverOrderDetail(){
  const meId = 'd1';
  const code = AppState.data.order;
  const o = (DriverOrders[meId]||[]).find(x=>x.code===code);
  if(!o) return simpleCard('Деталі замовлення','Замовлення не знайдено.');
  return `
    <div class="card">
      ${header({showBack:true, role:'driver'})}
      <div class="h1">Замовлення #${o.code}</div>
      <div class="section stack mt-4">
        <div class="row"><strong>Пасажир</strong><span>${o.passenger}</span></div>
        <div class="row"><strong>Дата і час</strong><span>${o.date} • ${o.time}</span></div>
        <div class="row"><strong>Маршрут</strong><span>${o.route}</span></div>
        <div class="row"><strong>Статус</strong>${StatusPill(o.status)}</div>
      </div>
      <div class="stack mt-4">
        <button class="btn" onclick="driverArrived()"><i class="ri-map-pin-time-line"></i> Я на місці</button>
      </div>
    </div>
  `;
}

/* DRIVER: Seeking passengers (онлайн/заброньовані) */
function sampleSeekingPassengers(){
  // 8 людей, 5 онлайн, решта заброньовані
  const names = ['Віта','Михайло','Олена','Ігор','Ліда','Олеся','Роман','Катерина'];
  return names.map((n,i)=>({
    name:n,
    booked: i>=5,
    from: Random.pick(STREETS),
    to: Random.pick(STREETS),
    when: i%2? 'сьогодні, 19:00':'зараз',
    phone:'+380 '+(60+i)+ ' ' + (100+ i*7) + ' ' + (20 + i)
  }));
}
function viewDriverSeeking(){
  const items = sampleSeekingPassengers();
  return `
    <div class="card">
      ${header({showBack:true, role:'driver'})}
      <div class="h1">Шукають водія зараз</div>
      <div class="stack mt-4">
        ${items.map(p=>`
          <div class="item" ${p.booked ? '' : `onclick="go('driver.passenger.req',${encodeURIComponent(JSON.stringify(p))})"`}>
            <div class="meta">
              ${p.booked ? Dot('orange') : Dot('green')}
              <div>
                <div class="name" style="${p.booked?'color:var(--grey)':''}">${p.name}</div>
                <div class="muted">${p.from} → ${p.to} • ${p.when}</div>
                ${p.booked ? `<div class="muted">заброньовано</div>`:''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
function viewDriverPassengerRequest(){
  const p = AppState.data;
  return `
    <div class="card">
      ${header({showBack:true, role:'driver'})}
      <div class="h1">${p.name}</div>
      <div class="section stack mt-4">
        <div class="row"><strong>Телефон</strong><span>${p.phone}</span></div>
        <div class="row"><strong>Маршрут</strong><span>${p.from} → ${p.to}</span></div>
        <div class="row"><strong>Коли</strong><span>${p.when}</span></div>
        <div class="row"><strong>Рейтинг</strong>${Stars(4 + Math.random())}</div>
      </div>
      <div class="stack mt-4">
        <button class="btn primary" onclick="alert('Чат поки окремо. (пізніше)')"><i class="ri-chat-3-line"></i> Написати</button>
      </div>
    </div>
  `;
}

/* DRIVER: Rating */
function viewDriverRating(){
  const d = Drivers.find(x=>x.id==='d1');
  return `
    <div class="card">
      ${header({showBack:true, role:'driver'})}
      <div class="row gap-3">
        <div class="avatar"><i class="ri-car-line"></i></div>
        <div>
          <div class="h1">${d.name}</div>
          <div class="sub">${d.phone} • ${d.car}</div>
          ${Stars(d.rating)}
        </div>
      </div>
      <div class="section stack mt-4">
        ${d.reviews.map(r=>`
          <div class="item left">
            ${Stars(r.stars)} <div class="muted">від ${r.a}</div>
            <div style="flex:1"></div>
            <div>${r.text}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* DRIVER: Settings + QR */
function viewDriverSettings(){
  return `
    <div class="card">
      ${header({showBack:true, role:'driver'})}
      <div class="h1">Налаштування (водій)</div>
      <div class="stack mt-4">
        <div class="item left" onclick="alert('Завантаження фото — пізніше')"><i class="ri-user-add-line"></i> <strong>Додати фото профілю</strong></div>
        <div class="item left" onclick="editBio('driver')"><i class="ri-edit-2-line"></i> <strong>Змінити опис профілю</strong></div>
        <div class="item left" onclick="setTariff()"><i class="ri-copper-coin-line"></i> <strong>Встановити тариф</strong></div>
        <div class="item left" onclick="alert('Додати картку для оплати — пізніше')"><i class="ri-bank-card-line"></i> <strong>Картка для оплати</strong></div>
        <div class="item left" onclick="showRideHistory('driver')"><i class="ri-road-map-line"></i> <strong>Історія поїздок</strong></div>
        <div class="item left" onclick="confirmDelete()"><i class="ri-delete-bin-6-line"></i> <strong>Видалити профіль</strong></div>
      </div>
    </div>
  `;
}
function setTariff(){ alert('Тариф збережено (демо).'); }
function editBio(role){ prompt('Опишіть себе коротко:', role==='driver' ? 'Акуратний водій. Працюю щодня 8:00–20:00.' : 'Люблю тишу під час поїздок.'); }
function showRideHistory(role){
  alert('Історія поїздок (демо):\n— 24.08 • Валки → Музейна\n— 20.08 • Харків → Валки\n— 18.08 • Весняна → Зоряна');
}
function confirmDelete(){
  if(confirm('Ви впевнені, що хочете видалити свій профіль?')) alert('Профіль видалено (демо).');
}
function viewDriverQR(){
  return `
    <div class="card">
      ${header({showBack:true, role:'driver'})}
      <div class="h1">QR-код для оплати</div>
      <div class="section stack mt-4">
        <div id="qr" class="qr"></div>
        <div class="muted">Рандомний QR (демо)</div>
      </div>
    </div>
  `;
}

/* DRIVER: Kharkiv route */
function viewDriverKharkiv(){
  const online = Drivers.filter(d=>d.online && !d.busy).slice(0,5);
  return `
    <div class="card">
      ${header({showBack:true, role:'driver'})}
      <div class="h1">Валки — Харків</div>
      <div class="sub">Спеціальні запити на цей маршрут</div>
      <div class="stack mt-4">
        ${online.map(d=>`
          <div class="item">
            <div class="meta">${Dot('green')}<div>
              <div class="name">${d.name} • ${d.car}</div>
              <div class="muted">${d.phone}</div>
            </div></div>
            <button class="btn" onclick="alert('Запит прийнято (демо)')">Прийняти</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* PASSENGER HOME */
function viewPassengerHome(){
  const meId = 'p1';
  const list = PassengerOrders[meId]||[];
  const activeCount = list.filter(o=>o.status==='active').length;
  const onlineDrivers = Drivers.filter(d=>d.online && !d.busy).length;

  return `
    <div class="card">
      ${header({showBack:true, role:'passenger'})}
      <div class="h1">Панель пасажира</div>
      <div class="sub">Замовлення, пошук водія та рейтинг</div>

      <div class="stack">
        <div class="section stack">
          <div class="row">
            <div class="item left" onclick="go('passenger.orders')">
              <div class="meta"><i class="ri-smartphone-line"></i><div>
                <div class="name">Мої замовлення</div>
                <div class="muted">Активні: ${activeCount} (макс 1)</div>
              </div></div>
            </div>
          </div>

          <div class="row">
            <div class="item left" onclick="go('passenger.find')">
              <div class="meta"><i class="ri-taxi-line"></i><div>
                <div class="name">Знайти водія</div>
                <div class="muted">Онлайн: ${onlineDrivers}</div>
              </div></div>
              ${Dot('green')}
            </div>
          </div>

          <div class="row">
            <div class="item left" onclick="go('passenger.rating')">
              <div class="meta"><i class="ri-star-smile-line"></i><div>
                <div class="name">Мій рейтинг</div>
                <div class="muted">Відгуки від водіїв</div>
              </div></div>
              <div>${Stars(4.8)}</div>
            </div>
          </div>

          <div class="row">
            <div class="item left" onclick="go('passenger.kharkiv')">
              <div class="meta"><i class="ri-route-line"></i><div>
                <div class="name">Валки — Харків</div>
                <div class="muted">Знайти водіїв на напрямку</div>
              </div></div>
            </div>
          </div>
        </div>

        <div class="section stack">
          <div class="row">
            <div class="item left" onclick="go('passenger.settings')">
              <div class="meta"><i class="ri-settings-3-line"></i><div class="name">Налаштування</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* PASSENGER: Orders */
function viewPassengerOrders(){
  const meId = 'p1';
  const list = PassengerOrders[meId] || [];
  return `
    <div class="card">
      ${header({showBack:true, role:'passenger'})}
      <div class="h1">Мої замовлення

