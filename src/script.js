const toggleBtn = document.getElementById("toggle");
const extra_rows = document.getElementById("extra-rows");
const Standard = document.getElementById("standard-grid");
const scientific = document.getElementById("scientific");
let inputWrapper = document.getElementById("input-wrapper");
const memory_pannel = document.getElementById("memory-panel");

let isScientific = false;

// toggle button
toggleBtn.addEventListener("click", () => {

    isScientific = !isScientific;

    if(isScientific){
        inputWrapper.classList.remove("w-160");
        inputWrapper.classList.add("w-240");

        scientific.classList.remove("hidden");
        extra_rows.classList.remove("hidden");
        memory_pannel.classList.remove("hidden");
        

        Standard.classList.remove("grid-rows-5");
        Standard.classList.add("grid-rows-7");
      
    }else{
        inputWrapper.classList.remove("w-240");
        inputWrapper.classList.add("w-160");

        scientific.classList.add("hidden");
        extra_rows.classList.add("hidden");
        memory_pannel.classList.add("hidden");

        Standard.classList.remove("grid-rows-7");
        Standard.classList.add("grid-rows-5");

    }

    toggleBtn.textContent = isScientific ? "Scientific" : "Standard";
});

// connecting keyboard with the buttons keeps the display value in sync
inputWrapper.addEventListener("input", () => {
    display_value = inputWrapper.value;
});

// for keyboard input
inputWrapper.addEventListener('keydown' , function(e){

    const operators = ['+','-','x','/'];
    const allowedkeys = [...operators,'.','Backspace','Enter','%','(',')'];

    let currentValue = inputWrapper.value;
    let lastchar = currentValue[currentValue.length - 1];

    if(/[0-9]/.test(e.key))return;

    if(operators.includes(e.key)){

        if(display_value.length === 0){
            e.preventDefault();
            return;
        }
        if(operators.includes(lastchar)){
            e.preventDefault();
            return;
        }
        return;   
    }
    if(e.key == '.'){

        let parts = currentValue.split(/[\+\-\x\/]/);
        let lastnumber = parts[parts.length - 1]
        if(lastnumber.includes('.')){
            e.preventDefault();
        }
        return;
    }


    if(allowedkeys.includes(e.key)) return;

    e.preventDefault();
})

// all number buttons
const btn_all = document.querySelectorAll('.btn');

let display_value = '';

btn_all.forEach(btn =>{
    btn.addEventListener('click' , function(e){
        // console.log(e.target.textContent);
        let lastchar = display_value[display_value.length - 1];
        let text = e.target.textContent;
        if(text === '.'){

            let parts = display_value.split(/[\+\-\/\x]/);
            let lastnumber = parts[parts.length - 1];

            if(lastnumber.includes('.')){
                return;
            }

        }
        if("π".includes(lastchar)){
            return;
        }
        display_value += text;
        console.log(display_value);
        inputWrapper.value = display_value; 
    })
})

// all operator buttons
const btn_operators = document.querySelectorAll('.btn-o');

btn_operators.forEach(btn => {
    btn.addEventListener('click' , function(e){
        let text = e.target.textContent;

        if(text == 'Clr'){
            display_value = display_value.slice(0,-1);
            inputWrapper.value = display_value;
            return;
        }

        let lastchar = display_value[display_value.length - 1];
        if(['+','-','/','x'].includes(lastchar)){
            return;
        }else if(text == '+' || text == '/' || text == 'x' || text == '-'){
            if(display_value == ''){
                return;
            }
            if('√'.includes(lastchar)){
                return;
            }
            display_value += text;
            inputWrapper.value = display_value;
        }else{
            return;
        }
    })
})

// AC button
document.querySelector('.btn-danger').addEventListener('click' , function(){
    display_value = '';
    inputWrapper.value = '';
})

// operator functions
function addition(a , b){
    return (a + b);
}
function subtraction(a , b){
    return (a - b);
}
function multiply(a , b){
    return (a * b);
}
function devide(a, b) {
        if (b === 0) {
            inputWrapper.value = 'infinite';
            display_value = '';
            throw new Error("Please Enter valid devisior");
        }
        return (a / b);
}
function sin(a){
    return Math.sin(a * Math.PI / 180);
}
function cos(a){
    return Math.cos(a * Math.PI / 180);
}
function tan(a){
    return Math.tan(a * Math.PI / 180);
}
function cosec(a){
    return 1 / Math.sin(a * Math.PI / 180);
}
function sec(a){
    return 1 / Math.cos(a * Math.PI / 180);
}
function cot(a){
    return 1 / Math.tan(a * Math.PI / 180);    
}
function log(a){
    if(a < 0){
        inputWrapper.value = 'nagative number not allowed';
        display_value = '';
        throw new Error("please enter postive number");
    }
    return Math.log10(a);
}
function ln(a){
    if(a < 0){
        inputWrapper.value = 'nagative number not allowed';
        display_value = '';
        throw new Error("please enter postive number");
    }
    return Math.log(a);
}
function sqare(a){
    return multiply (a , a);
}
function tenpower(a){
    return Math.pow(10 , a);
}
function factorial(a){

    if(a < 1){
        inputWrapper.value = 'Error';
        display_value = '';
        throw new Error("Factorial for less than 1 is not posible");
    }
    let r = 1 ;
    for (let i = 1 ; i <= a ;i++){
        r *= i;
    }
    return r;
}
function percentage(a){
    return a/100;
}
function squareroot(a){
    return Math.sqrt(a);
}


//  equal to button 
document.querySelector('.btn-eq').addEventListener('click' , function(){
    let {operands , operators} = parseExpression(display_value);
    let result

    if(!isScientific){
        result = claculate(operands , operators);
    }

    if(isScientific){
        result = sciCalculate();
    }

    if(result !== null){
        display_value = '';
        inputWrapper.value = result;
    }
})

// split the display value in two arrays
function parseExpression(exp){
    let operands = exp.split(/[\+\-\x\/]/).map(Number);
    let operators = exp.match(/[\+\-\x\/]/g) || [];
    return{operands , operators};
}

// calculate the answer
function claculate(operands , operators){

    try{
    
    const precedence = ['/x' , '+-'];
   

    precedence.forEach(op =>{

        let index = operators.findIndex(o => op.includes(o))

        while(index !== -1){
            
            let a = operands[index];
            let b = operands[index + 1];
            let result; 

            switch(operators[index]){
                case '/':result = devide(a , b); break;
                case 'x':result = multiply(a , b); break;
                case '+':result = addition(a , b); break;
                case '-':result = subtraction(a , b); break;
            }
            
            operands.splice(index , 2 ,result);

            operators.splice(index ,1);

            index = operators.findIndex(o => op.includes(o));
        }
    });
    return operands[0];

    }catch(error){
        if(error.message == "Please Enter valid devisior"){
            console.log(error.message);
            return null;
        }
        console.log(error.message);
    }
}

// scintific calculator

const sci_buttons = document.querySelectorAll('.btn-sci');

sci_buttons.forEach(btn =>{
    btn.addEventListener('click' , function(e){

        let text = e.target.textContent;
        let lastchar = display_value[display_value.length - 1];

        if (text == 'sin' || text == 'cos' || text == 'tan' || text == 'cosec' || text == 'sec' || text == 'cot'){
            display_value += `${text}(`
            inputWrapper.value = display_value;
        }else if(text == 'x²'){
            display_value += `^2`
            inputWrapper.value = display_value;
        }else if(text == '(' || text == ')'){

            let openCount = (display_value.match(/\(/g) || []).length;
            let closeCount = (display_value.match(/\)/g) || []).length;

            if(text == '('){
                if(display_value == '' || "+-x/(".includes(lastchar)){
                    display_value += '(';
                }else{
                    return;
                }
            }
            if(text == ')'){
                if(openCount > closeCount && !"+-/x(√".includes(lastchar)){
                    display_value += ')';
                }else{
                    return;
                }
            }
            inputWrapper.value = display_value;
        }else if(text == "n!"){
            if("!+-/x(%".includes(lastchar)){
                return;
            }
            display_value += '!';
            inputWrapper.value = display_value;

        }else if(text == '√'){

            display_value += '√(';
            inputWrapper.value = display_value;

        }else if(text == 'π'){
            if("%".includes(lastchar)){
                return;
            }
            if("0123456789)π".includes(lastchar)){
                display_value += 'xπ';
                inputWrapper.value = display_value;
            }else{
                display_value += 'π';
                inputWrapper.value = display_value;
            }

        }else if(text == '%'){
            if("+-/x(%".includes(lastchar) || display_value == ''){
                return;
            }
            display_value += '%';
            inputWrapper.value = display_value; 

        }else if(text == '10ˣ'){
            if("+-/x".includes(lastchar)){
                display_value += '(10^';
                inputWrapper.value = display_value;
            }else if(display_value == ''){
                display_value += '10^';
                inputWrapper.value = display_value;
            }
            return;

        }else if(text == 'ln'){
            if('+-/x'.includes(lastchar)){
                display_value += '(ln(';
                inputWrapper.value = display_value;
            }else if(display_value == '' || '('.includes(lastchar)){
                display_value += 'ln('
                inputWrapper.value = display_value;
            }
            return;

        }else if(text == 'log'){
            if('+-/x'.includes(lastchar)){
                display_value += '(log(';
                inputWrapper.value = display_value;
            }else if(display_value == '' || '('.includes(lastchar)){
                display_value += 'log('
                inputWrapper.value = display_value;
            }
            return;

        }
    })
})

function bracketbalance(exp){
    let openbracket = (exp.match(/\(/g) || []).length;
    let closebracket = (exp.match(/\)/g) || []).length;

    while (openbracket > closebracket){
        exp += ')';
        closebracket++;
    }
    return exp ;
}
function converttoTokens(exp){
    exp = bracketbalance(exp);

    exp = exp.replace(/π/g, Math.PI);

    const tokens = exp.match(/cosec|sin|cos|tan|log|sec|cot|ln|√|π|10\^|x²|!|\d+\.?\d*|[()+\-x/^%]/g);

    return tokens || []; 
}

function evaluate(tokens){

    const functions = ['sin','cos','tan','cot','cosec','sec','log','ln','√'];

    for(let i=0; i<tokens.length; i++){
        if(tokens[i] === '-' && (i === 0 || ['(','+','-','x','/','^'].includes(tokens[i-1]))){
            tokens[i+1] = -tokens[i+1];
            tokens.splice(i,1);
        }
    }

    while(tokens.includes('(')){

        let open = tokens.lastIndexOf('(');
        let close = tokens.indexOf(')', open);

        let inner = tokens.slice(open + 1 , close);
        let value = evaluate(inner);

        let prvtoken = tokens[open - 1];
        if(functions.includes(prvtoken)){
            let t = prvtoken;
            let result;

            if(t == '√') result = squareroot(value);
            if(t == 'sin') result = sin(value);
            if(t == 'cos') result = cos(value);
            if(t == 'tan') result = tan(value);
            if(t == 'cosec') result = cosec(value);
            if(t == 'sec') result = sec(value);
            if(t == 'cot') result = cot(value);
            if(t == 'log') result = log(value);
            if(t == 'ln') result = ln(value);

            tokens.splice(open-1 , close-open+2 , result);
        }else{
            tokens.splice(open , close -open + 1 ,value);
        }
    }

    
    for(let i=0 ; i < tokens.length ; i++){
        if(tokens[i] === '^' && tokens[i+1] === '2'){ 
            let value = sqare (tokens[i-1]);
            tokens.splice(i-1 , 3 ,value);
            i--;
        }else if(tokens[i] === '10^'){
            let value = tenpower(tokens[i+1]);
            tokens.splice(i , 2 , value);
            i--;
        }else if(tokens[i] === '^'){
            let value = tokens[i-1] ** tokens[i+1];
            tokens.splice(i-1 , 3 ,value);
            i--;
        }else if(tokens[i] === '%'){
            let value = percentage(tokens[i-1]);
            tokens.splice(i-1,2,value);
            i--;
        }else if(tokens[i] === '!'){
            let value = factorial(tokens[i-1]);
            tokens.splice(i-1 , 2 ,value);
            i--;
        }
    }

    for(let i=0 ;i<tokens.length ; i++){
        if(tokens[i] == 'x'){
            let value = multiply(Number(tokens[i-1]) , Number(tokens[i+1]));
            tokens.splice(i-1 , 3 , value);
            i--;
        }
        if(tokens[i] == '/'){
            let value = devide(Number(tokens[i-1]) , Number(tokens[i+1]));
            tokens.splice(i-1 , 3 , value);
            i--;
        }
    }
    
    for(let i=0 ;i<tokens.length ; i++){
        if(tokens[i] == '+'){
            let value = addition(Number(tokens[i-1]) , Number(tokens[i+1]));
            tokens.splice(i-1 , 3 , value);
            i--;
        }
        if(tokens[i] == '-'){
            let value = subtraction(Number(tokens[i-1]) , Number(tokens[i+1]));
            tokens.splice(i-1 , 3 , value);
            i--;
        }
    }
    return tokens[0];
}

function sciCalculate(){
    let tokens = converttoTokens(display_value);
    let result = evaluate(tokens);
    return result;
}


// memory pannel
 
let memory_display = document.getElementById('memory-display');
const Memory_btn = document.querySelectorAll('.btn-M');

let memory = 0;

Memory_btn.forEach(btn =>{
    btn.addEventListener('click' , function(e){

        let text = e.target.textContent;
        let value  = Number(inputWrapper.value) || 0;

        if(text == 'MC'){
            memory = 0 ;
        }else if(text == 'MR'){
            inputWrapper.value = memory;
            display_value = memory.toString();
        }else if(text == 'M+'){
            memory += value;
        }else if(text == 'M-'){
            memory -= value;
        }else if(text == 'MS'){
            memory = value;
        }
        memory_display.textContent = memory;    
    })
})