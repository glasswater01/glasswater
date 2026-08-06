const links = document.querySelectorAll(".proyecto-link");
const previewImg = document.getElementById("previewImg");

links.forEach(link => {
  link.addEventListener("mouseenter", () => {
    const imgSrc = link.getAttribute("data-img");
    previewImg.src = imgSrc;
    previewImg.classList.add("visible");
  });

  link.addEventListener("mouseleave", () => {
    previewImg.classList.remove("visible");
  });
});
