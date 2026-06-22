const buttons = document.querySelectorAll(".calc-btn");
const display=document.getElementById("display");
const historyList=document.getElementById("historyList");
const clearHistoryBtn=document.getElementById("clearHistory");
const themeBtn = document.getElementById("themeBtn");
const historyBtn = document.getElementById("historyBtn");
const historySection = document.querySelector(".history");

historySection.classList.add("hidden");

historyBtn.addEventListener("click", () => {

    historySection.classList.toggle("hidden");


    if(historySection.classList.contains("hidden")){
        historyBtn.textContent = "History";
    }
    else{
        historyBtn.textContent = "Hide History";
    }
});
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
    themeBtn.textContent = "Light Mode";
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme", "dark");
        themeBtn.textContent = "Light Mode";
    }
    else{
        localStorage.setItem("theme", "light");
        themeBtn.textContent = "Dark Mode";
    }

});

let history=JSON.parse(localStorage.getItem("history")) || [];
let updateHistory=()=>{
    historyList.innerHTML="";
    history.forEach(item =>{
        const li=document.createElement("li");
        li.textContent=item;
        historyList.appendChild(li);
    });
}

clearHistoryBtn.addEventListener("click",()=>{
    history=[]
    localStorage.removeItem("history");
    updateHistory();
});
updateHistory();

function calculate(){
    try{
        let expression=display.value;
        display.value=eval(expression.replaceAll("^","**"));
        let value=display.value;
        justCalculated=true;
        if(/[-+*/^()]/.test(expression)){
            history.push(`${expression} = ${value}`);
            if(history.length>5) history.shift();
            localStorage.setItem("history",JSON.stringify(history));
            updateHistory();
        }
        if(!isFinite(display.value)){
            display.value = "Error";
            return;
        }
    }catch{
        display.value="Error";
    }
}

function factorial(n){
    if(n < 0)
        return "Error";

    let ans = 1;

    for(let i = 2; i <= n; i++)
        ans *= i;

    return ans;
}
function clean(num){
    return parseFloat(num.toFixed(10));
}

let justCalculated=false;
buttons.forEach(button => {
    button.addEventListener("click" , () => {
        if(display.value==="Error" || (justCalculated && "1234567890.".includes(button.textContent) && !"()+-*/^".includes(display.value.slice(-1)))){
            justCalculated=false;
            display.value="";
        }
        if(button.textContent=== "=")
            calculate();
        else if(button.textContent==="c"){
            display.value="";
            justCalculated=false;
        }
        else if(button.textContent==="x²"){
            let num=Number(display.value);
            display.value=num*num;
        }
        else if(button.textContent === "π"){
            display.value += clean(Math.PI);
        }
        else if(button.textContent === "sin"){
            let num = Number(display.value);
            display.value = clean(Math.sin(num * Math.PI / 180));
        }
        else if(button.textContent === "cos"){
            let num = Number(display.value);
            display.value =clean(Math.cos(num * Math.PI / 180));
        }
        else if(button.textContent === "tan"){
            let num = Number(display.value);
            display.value = clean(Math.tan(num * Math.PI / 180));
        }
        else if(button.textContent === "log"){
            let num = Number(display.value);
            if(num <= 0)
                display.value = "Error";
            else
                display.value = Math.log10(num);
        }
        else if(button.textContent === "ln"){
            let num = Number(display.value);

            if(num <= 0)
                display.value = "Error";
            else
                display.value = Math.log(num);
        }
        else if(button.textContent === "!"){
            let num = Number(display.value);

            if(!Number.isInteger(num) || num < 0)
                display.value = "Error";
            else
                display.value = factorial(num);
        }
        else if(button.textContent==="√"){
            let num=Number(display.value);
            if(num<0) display.value="Error";
            else display.value=Math.sqrt(Number(display.value));
        }
        else if(button.textContent==="%")
            display.value=Number(display.value)/100;
        else if(button.textContent==="⌫")
            display.value=display.value.slice(0,-1);
        else
            display.value += button.textContent;
        button.blur();
    });
});
document.addEventListener("keydown", (event) => {
    const key=event.key;
    if(display.value==="Error" || (justCalculated && "1234567890.".includes(key) && !"()+-*/^".includes(display.value.slice(-1)))){
        justCalculated=false;
        display.value="";
    }
    if("0123456789-+/*.()^".includes(key)) {
        event.preventDefault();
        display.value+=key;
    }
    else if(key === "Enter") calculate();
    else if(key === "Backspace"){
        display.value=display.value.slice(0,-1);
    }
    else if(key === "%"){
        display.value=Number(display.value)/100;
    }
})