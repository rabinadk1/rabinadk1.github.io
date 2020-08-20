const body = document.body;
const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

// Check if user preference is set, if not check value of body class for light or dark else it means that colorsheme = auto
setTheme(
  localStorage.getItem("colorscheme") ||
    (body.classList.contains("colorscheme-dark") || darkModeMediaQuery.matches
      ? "dark"
      : "light")
);

document.getElementById("dark-mode-toggle").onclick = () =>
  setTheme(body.classList.contains("colorscheme-dark") ? "light" : "dark");

darkModeMediaQuery.addListener(event =>
  setTheme(event.matches ? "dark" : "light")
);

function setTheme(theme) {
  body.classList.remove("colorscheme-auto");
  inverse = theme === "dark" ? "light" : "dark";
  localStorage.setItem("colorscheme", theme);
  body.classList.remove("colorscheme-" + inverse);
  body.classList.add("colorscheme-" + theme);
}
