const setButtonA = document.getElementById("btn-a");
const inputA = document.getElementById("type-a");
const setButtonB = document.getElementById("btn-b");
const inputB = document.getElementById("type-b");
const setButtonC = document.getElementById("btn-l");
const inputC = document.getElementById("type-l");

setButtonA.addEventListener("click", () => {
  const textA = inputA.value;
  window.myAPI.setA(textA);
});
setButtonB.addEventListener("click", () => {
  const textB = inputB.value;
  window.myAPI.setB(textB);
});
setButtonC.addEventListener("click", () => {
  const textL = inputC.value;
  window.myAPI.setL(textL);
});
