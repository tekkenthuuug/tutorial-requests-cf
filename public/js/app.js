const requestModal = document.querySelector('.new-request');
const requestLink = document.querySelector('.add-request');

requestLink.addEventListener('click', () => {
  requestModal.classList.add('open');
});

requestModal.addEventListener('click', e => {
  if (e.target.classList.contains('new-request')) {
    requestModal.classList.remove('open');
  }
});

// Using callable functions
const button = document.querySelector('.call');
button.addEventListener('click', () => {
  // get function ref
  const sayHello = firebase.functions().httpsCallable('sayHello');
  sayHello({ name: 'Maksim' }).then(({ data }) => console.log(data));
});
