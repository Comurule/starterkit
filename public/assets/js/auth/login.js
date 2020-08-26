const Route = new Routes;
const spinner = `<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>`;

const registerUser = async (event) => {
  event.preventDefault();
  const errDisplay = document.getElementById('errDisplay');
  const submitBtn = event.target['kt_login_submit'];
  submitBtn.innerHTML = spinner;
  console.log('submitted')

  try {
    const formData = {
      email: event.target.email.value,
      password: event.target.password.value,
      firstname: event.target.firstname.value,
      lastname: event.target.lastname.value
    }
    
    const response = await fetch(`${Route.apiRoot}/register`, {
      // mode: 'no-cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const registeration = await response.json();
    // const registeration = await response;
    let errors = '';
    console.log(registeration);
    if (registeration.status) {
      swal.fire(
        'Awesome!',
        'Your have been registered successfully!',
        'success'
      )
      location.href = `/login`;
    } else {
      submitBtn.innerHTML = 'Register';
      if (registeration.errors) {
        for (let i = 0; i < registeration.errors.length; i++) {
          errors += registeration.errors[i].msg;
          if (i < registeration.errors.length - 1) errors += ', ';
        }
        console.log(errors);
        errDisplay.innerHTML = errors;
      } else {
        registeration.message ? errDisplay.innerHTML = registeration.message : errDisplay.innerHTML = registeration.data;
      }
      swal.fire(
        'Oops!',
        `Your registeration was unsuccessful!`,
        'error'
      )
    }
  } catch (error) {
    submitBtn.innerHTML = 'Register';
    console.log(error);
    // show network error notification
    swal.fire(
      'Oops!',
      'An error was encountered!',
      'error'
    )
  }
}
