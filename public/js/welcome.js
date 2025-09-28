const fullname = document.querySelector(".user-name");

document.getElementById("avatar").textContent = fullname.textContent
  .charAt(0)
  .toUpperCase();

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng!";
  if (hour < 18) return "Chào buổi chiều!";
  return "Chào buổi tối!";
}

document.getElementById("greeting").textContent = getGreeting();
