const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth .modal');
const authWrapper = document.querySelector('.auth');
const registerForm = document.querySelector('.register');
const loginForm = document.querySelector('.login');
const signOut = document.querySelector('.sign-out');

// toggle auth modals
authSwitchLinks.forEach(link => {
  link.addEventListener('click', () => {
    authModals.forEach(modal => modal.classList.toggle('active'));
  });
});

// register form
registerForm.addEventListener('submit', e => {
  e.preventDefault();

  const email = registerForm.email.value;
  const password = registerForm.password.value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => {
      registerForm.reset();
      registerForm.querySelector('.error').textContent = '';
    })
    .catch(error => {
      registerForm.querySelector('.error').textContent = error.message;
    });
});

// login form
loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      loginForm.reset();
      loginForm.querySelector('.error').textContent = '';
    })
    .catch(error => {
      loginForm.querySelector('.error').textContent = error.message;
    });
});

// auth listener
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // Hiding auth modals when user logged in
    authWrapper.classList.remove('open');
    authModals.forEach(modal => modal.classList.remove('active'));
  } else {
    // Showing auth modals when user sings out
    authWrapper.classList.add('open');
    authModals[0].classList.add('active');
  }
});

signOut.addEventListener('click', () => {
  firebase.auth().signOut();
});
