function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning!";
  if (hour < 18) return "Good afternoon!";
  return "Good evening!";
}

const timeCurrent = getGreeting();

const fullname = document.querySelector(".user-name");

document.getElementById("avatar").textContent = fullname.textContent
  .charAt(0)
  .toUpperCase();

document.getElementById("greeting").textContent = timeCurrent;

