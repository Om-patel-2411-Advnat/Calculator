const toggleBtn = document.getElementById("toggle");
const scientific = document.getElementById("scientific");
let inputWrapper = document.getElementById("input-wrapper");

let isScientific = false;

toggleBtn.addEventListener("click", () => {
    isScientific = !isScientific;

    scientific.classList.toggle("hidden", !isScientific);

    if(isScientific){
        inputWrapper.classList.remove("w-160");
        inputWrapper.classList.add("w-240");
    }else{
        inputWrapper.classList.remove("w-240");
        inputWrapper.classList.add("w-160");
    }

    toggleBtn.textContent = isScientific ? "Scientific" : "Standard";
});

inputWrapper.addEventListener("input", () => {
    display_value = inputWrapper.value;
});

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

const btn_all = document.querySelectorAll('.btn');

let display_value = '';

btn_all.forEach(btn =>{
    btn.addEventListener('click' , function(e){
        // console.log(e.target.textContent);
        let text = e.target.textContent;
        if(text === '.'){

            let parts = display_value.split(/[\+\-\/\x]/);
            let lastnumber = parts[parts.length - 1];

            if(lastnumber.includes('.')){
                return;
            }

        }
        display_value += text;
        console.log(display_value);
        inputWrapper.value = display_value; 
    })
})

const btn_operators = document.querySelectorAll('.btn-o');
let alphabets

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
        }else if(text == '+'){
            display_value += '+';
            inputWrapper.value = display_value;
        }else if(text == '-'){
            display_value += '-';
            inputWrapper.value = display_value;
        }else if(text == 'x'){
            display_value += 'x';
            inputWrapper.value = display_value;
        }else if(text == '/'){
            display_value += '/';
            inputWrapper.value = display_value;
        }else{
            return;
        }
    })
})

document.querySelector('.btn-danger').addEventListener('click' , function(){
    display_value = '';
    inputWrapper.value = '';
})

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

document.querySelector('.btn-eq').addEventListener('click' , function(){
    let {operands , operators} = parseExpression(display_value);
    let result = claculate(operands , operators);

    if(result !== null){
        display_value = '';
        inputWrapper.value = result;
    }
})

function parseExpression(exp){
    let operands = exp.split(/[\+\-\x\/]/).map(Number);
    let operators = exp.match(/[\+\-\x\/]/g) || [];
    return{operands , operators};
}

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

