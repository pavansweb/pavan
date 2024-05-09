



function calculate() {
    var num1 = parseFloat(document.getElementById('num1').value);
    var operator = document.getElementById('operator').value;
    var num2 = parseFloat(document.getElementById('num2').value);
    var answer;
    
    if (isNaN(num1) || isNaN(num2)) {
        document.getElementById('answer').innerText = 'Enter Valid Numbers';
        document.getElementById('answer').style.color = 'red';
        document.getElementById('answer').style.fontSize = '1.5rem' ;
    }
    else{
        document.getElementById('answer').style.color = 'black';

        if (operator === '+') {
            answer = num1 + num2;
        } else if (operator === '-') {
            answer = num1 - num2;
        } else if (operator == '/') {
            answer = num1 / num2;
        } else if (operator === 'x') {
            answer = num1 * num2;
        } else if (operator === '^') {
            answer = Math.pow(num1, num2);
        }
        
     

    document.getElementById('answer').innerText = '= ' + answer;
   }
} 


// this is for uhh , the down calculator button part , OVER

const writer = document.getElementById('writer');

   
const buttons = document.querySelectorAll('.grid-item:not(#undo)');
buttons.forEach(button => {
    button.addEventListener("click", function() {
        
        writer.innerText += button.value;
    });
 });

const undo = document.getElementById('undo');
undo.addEventListener("click", function() {
       if (writer.innerText== "Invalid Expression") {
          writer.innerText= " "
          document.getElementById('writer').style.color = 'black';
          document.getElementById('writer').style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
       } else {
        
       
        let before = writer.innerText;
        let after = before.slice(0, -1);
        writer.innerText = after;
       }
});


function updateResult() {
    try {
        const result = eval(writer.innerText);
        document.getElementById('writer').innerText = '= ' + result;
    } catch (error) {
        document.getElementById('writer').innerText = 'Invalid Expression';
        document.getElementById('writer').style.color = 'red';
        document.getElementById('writer').style.backgroundColor = 'transparent';
    }
}


const clearBtn = document.getElementById('clearBtn');
clearBtn.addEventListener('click', function () {
    let writer = document.getElementById('writer');
    writer.innerText = " "
})