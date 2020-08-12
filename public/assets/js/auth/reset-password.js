const Route = new Routes;
const submitBtn = document.getElementById('kt_login_submit');

const resetPassword = async (event) => {
  event.preventDefault();
  submitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';

  // Get the token passed as query string
  const queryString = window.location.search;
  console.log(queryString)
  const urlSearchParams = new URLSearchParams(queryString);
  const token = urlSearchParams.get('token');
  const errDisplay = document.getElementById('errDisplay');
  if(!token) errDisplay.innerHTML = 'You must provide a valid token';

  const form = event.target;
  const formData = JSON.stringify({
    password: form.password.value,
    confirmPassword: form.confirmPassword.value
  });
  errDisplay.innerHTML = '';
  console.log(formData)
  try {
    const response = await fetch(`${Route.apiRoot}/reset-password${queryString}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: formData
    });
    const passwordReset = await response.json();
    let errors = '';
    console.log(passwordReset);
    if (passwordReset.status) {
      swal.fire(
        'Awesome!',
        'Your password reset was successful!',
        'success'
      )
      return location.href = `/login`;
    }
    submitBtn.innerHTML = 'Submit';
    if (passwordReset.errors){
      for (let i = 0; i < passwordReset.errors.length; i++) {
        errors += passwordReset.errors[i].msg;
        if (i < passwordReset.errors.length - 1) errors += ', ';
      }
      errDisplay.innerHTML = errors;
    } 
    if (passwordReset.data == 'Passwords do not match'){
      errDisplay.innerHTML = passwordReset.data;
    }
    swal.fire(
      'Oops!',
      `Your password reset was unsuccessful!`,
      'error'
    )
  } catch (error) {
    console.log(error)
  }
}

const forgotPassword = async (event) => {
  event.preventDefault();
  submitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
  const form = event.target;
  errDisplay.innerHTML = '';
  try {
    const response = await fetch(`${Route.apiRoot}/recovery`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: form.email.value
      })
    });
    const recovery = await response.json();
    let errors = '';
    if (recovery.status) {
      submitBtn.innerHTML = 'Submit';
      return swal.fire(
        'Awesome!',
        'Your account recovery request was successful! Please check your inbox for a mail',
        'success'
      )
    }
    if (recovery.errors){
      submitBtn.innerHTML = 'Submit';
      for (let i = 0; i < recovery.errors.length; i++) {
        errors += recovery.errors[i].msg;
        if (i < recovery.errors.length - 1) errors += ', ';
      }
      errDisplay.innerHTML = errors;
    }
    if (recovery.data == 'User not found'){
      submitBtn.innerHTML = 'Submit';
      errDisplay.innerHTML = recovery.data;
    }
    swal.fire(
      'Oops!',
      `Your request was unsuccessful!`,
      'error'
    )
  } catch (error) {
    submitBtn.innerHTML = 'Submit';
    console.log(error)
  }
}