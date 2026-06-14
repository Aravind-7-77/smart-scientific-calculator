const buttons=document.querySelectorAll("button");
const display=document.getElementById("display");
const historyList=document.getElementById("historyList");
const clearHistoryBtn=document.getElementById("clearHistory");
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