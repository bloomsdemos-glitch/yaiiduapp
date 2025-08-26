function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Пасажир: замовлення
document.getElementById("rideForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const time = document.getElementById("time").value;

  alert(`🚕 Замовлення створено!\n\nЗвідки: ${from}\nКуди: ${to}\nЧас: ${time}`);
  showScreen('home');
});

// Водій: мок-функції
function fakeAccept() {
  alert("✅ Ви прийняли замовлення.");
}

function fakeArrive() {
  alert("📍 Ви повідомили пасажира: «Я прибув».");
}