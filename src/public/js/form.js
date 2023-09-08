const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));
  console.log(obj);

  const response = await fetch("/api/users/token", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();

  if (responseData.error) {
    return alert("No se ha podido iniciar sesion");
  }
  localStorage.setItem("accessToken", responseData.accessToken);
});
