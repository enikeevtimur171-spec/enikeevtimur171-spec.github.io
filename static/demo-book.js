// Демо-сайт салона: живая форма записи (25.10). Отдельным файлом — политика безопасности запрещает встроенные скрипты.
// Заявка никуда не уходит: владелец видит, какое сообщение ему пришло бы в мессенджер.
document.addEventListener('click', function (e) {
  var b = e.target.closest('.chip');
  if (!b) return;
  b.parentNode.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
  b.classList.add('on');
});
document.addEventListener('submit', function (e) {
  if (e.target.id !== 'book') return;
  e.preventDefault();
  var pick = function (g) { var x = document.querySelector('[data-group="' + g + '"] .on'); return x ? x.textContent : ''; };
  var name = document.getElementById('b-name');
  var who = name.value.trim() || name.placeholder;
  document.getElementById('b-msg').textContent = (e.target.dataset.title || 'Новая запись с сайта') + '\n' +
    document.getElementById('b-service').value +
    '\n' + pick('day') + ', ' + pick('time') + '\n' + who;
  e.target.hidden = true;
  document.getElementById('b-done').hidden = false;
});
