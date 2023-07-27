const inputSlider = document.querySelector("[data-lengthSlider]");

const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const copyBtn = document.querySelector("[data-copy]");

const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");

const lowercaseCheck = document.querySelector("#lowercase");

const symbolsCheck = document.querySelector("#symbols");

const numbersCheck = document.querySelector("#numbers");

const indicator = document.querySelector("[data-indicator]");

const generateBtn = document.querySelector(".generateButton");

const allCheckBox = document.querySelectorAll("input[type=checkbox]"); //to take every input

const symbols = "~`!@#$%^&*()_-+={[}]|:;<,>.?/";

//default setup on loading

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set circle default value to grey
setIndicator("#ccc")


//set password length

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}


function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
 return Math.floor(Math.random() * (max - min) + min); // will give the integer from min to max
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowercase() {
  return String.fromCharCode(getRndInteger(97, 123)); // converting number to string with ascii value in lowercase .
}

function generateUppercase() {
  return String.fromCharCode(getRndInteger(65, 91)); // converting number to string with ascii value  in uppercase.
}



function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if(uppercaseCheck.checked) 
    hasUpper = true;
  
  if(lowercaseCheck.checked) 
    hasLower = true;
  
  if(symbolsCheck.checked) 
    hasSym = true;
  
  if(numbersCheck.checked) 
    hasNum = true;
  

  if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasUpper || hasLower) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed to copy";
  }

  //to make a copy wala span visible
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}
 
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });
  //special condition
  if(passwordLength < checkCount ) {
    passwordLength = checkCount;
    handleSlider();
}
}
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  handleSlider();
})

copyBtn.addEventListener('click', () => {
  if(passwordDisplay.value) 
   copyContent();
});


generateBtn.addEventListener('click', () => {
  if(checkCount == 0)
    //none of the chceck box checked
    return;
      
  if(passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //let;s start  the journey to find new password
  console.log("starting the journey");
  //remove old password
  password = "";

  //lets put the stuff mentioned by check boxes

  //    if(uppercaseCheck.checked){
  //     password += generateUppercase();
  //    }
  //    if(lowercaseCheck.checked){
  //     password += generateLowercase();
  //    }
  //    if(numberCheck.checked){
  //     password += generateNumber();
  //    }
  //    if(symbolCheck.checked){
  //     password += generateSymbols();
  //    }

  let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();

});
