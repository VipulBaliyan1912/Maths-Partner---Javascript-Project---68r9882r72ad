const mainSection = document.querySelector(".main");
const problem = document.getElementById("expression");
const category = document.getElementById("problemCategory");
const searchBtn = document.getElementById("searchIcon");
const history = document.querySelector(".savedSolutions");
const problems = document.querySelector(".problems");
const savedBtn = document.getElementById("savedSolution");
const newProblemBtn = document.getElementById("searchBtn");
const empty = document.querySelector(".empty");
const trignoFunc = [
  "sin",
  "cos",
  "tan",
  "arccos",
  "arcsin",
  "arctan",
];

const api = "https://newton.vercel.app/api/v2/";

let problemsStorage = [];
if (!localStorage.getItem("problems")) {
  localStorage.setItem("problems", JSON.stringify(problemsStorage));
}

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let expression = problem.value;
  problem.value = "";
  let operation = category.value;
  if (expression) {
    const result = getSolution(expression, operation);
    result
      .then((res) => showSolution(res, expression, operation))
      .catch((err) => console.log(err));
  }
});

async function getSolution(expression, operation) {
  if (trignoFunc.includes(operation)) {
    expression = encodetrignoFunc(expression);
  }
  const query = encodeURIComponent(expression);
  const newUrl = api + operation + "/" + query;
  try {
    loaderStart();
    const res = await fetch(newUrl);
    const data = await res.json();
    problemsStorage.push(data);
    localStorage.setItem("problems", JSON.stringify(problemsStorage));
    return data;
  } catch (err) {
    console.log(err);
  } finally{
    loaderStop();
  }
}

function showSolution(output, ex, op) {
  document.getElementById("currProblemExpression").innerText = `Expression: ${ex}`;
  document.getElementById(
    "currProblemSolution"
  ).innerText = `Solution: ${output.result}`;
}

function showSavedSolutions(savedProblems) {
  problems.innerHTML = "";
  savedProblems.map((problem, idx) => {
    problems.innerHTML += `<div id="problem">
          <p id="problemNo">Expression ${idx + 1}:</p>
          <div id="problemDesc">
            <h2 id="problemStatement">${problem.operation} : ${
      problem.expression
    }</h2>
            <p id="problemSolution">Solution: ${problem.result}</p>
            <i class="fa-solid fa-trash fa-2xl" id="delete"></i>
          </div>
        </div>`;
  });
}

savedBtn.addEventListener("click", () => {
  savedBtn.classList.add("hide");
  newProblemBtn.classList.remove("hide");
  mainSection.classList.add("hide");
  history.classList.remove("hide");
  const solutions = localStorage.getItem("problems");
  const problemsStorage = JSON.parse(localStorage.getItem("problems"));
  if (problemsStorage.length === 0) {
    empty.classList.remove("hide");
  } else {
    empty.classList.add("hide");
  }
  // console.log(problemsStorage);
  showSavedSolutions(JSON.parse(solutions));
});

newProblemBtn.addEventListener("click", () => {
  newProblemBtn.classList.add("hide");
  savedBtn.classList.remove("hide");
  mainSection.classList.remove("hide");
  history.classList.add("hide");
});

problems.addEventListener("click", (e) => {
  if (e.target.id == "delete") {
    const parent = e.target.parentElement.parentElement;
    const currProblem = parent.firstChild.nextSibling.innerText;
    const problemNum = currProblem.substring(8, currProblem.length - 1);
    const idx = Number(problemNum) - 1;
    problemsStorage.splice(idx, 1);
    localStorage.setItem("problems", JSON.stringify(problemsStorage));
    const solutions = localStorage.getItem("problems");
    showSavedSolutions(JSON.parse(solutions));
    if (problemsStorage.length === 0) {
      empty.classList.remove("hide");
    }
  }
});

function encodetrignoFunc(expression) {
  let b = 180 / expression;
  return `${Math.PI}/${b}`;
}
const loaderStart = () => {
  const loader = document.getElementById("loader");
  loader.style.display = "block";
};
const loaderStop = () => {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
};