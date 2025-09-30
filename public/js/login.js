

const toogleEyes = document.querySelector('.password-toggle');
const input = document.querySelector('#password');
let isHidden = false;

toogleEyes.onclick = function() {
    if (!isHidden) {
        input.type = 'text';
        isHidden = true;
    } else {
        input.type = 'password';
        isHidden = false;
    }
}

