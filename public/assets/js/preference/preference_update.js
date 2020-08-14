//Fetch Helper
const fetchData = async (url) =>{
    try {
      const preferences = await fetch(`/api/v1${url}`);
      return await preferences.json();
    } catch (error) {
    console.log(error);
      // show network error notification
      swal.fire(
        'Oops!',
        'An error was encountered! Please review your network connection.',
        'error'
      )
    }
};

//Update Preference Event handlers
const updatePreference = async (event, preferenceId) => {
    event.preventDefault();
  console.log(preferenceId)
    const form = event.target;
    try {
      const data = await fetch(`/api/v1/preferences/${preferenceId}/update`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.value,
          pcCode: form.pcCode.value,
          parentPC: form.parentPC.value,
          tier: form.tier.value,
          displayType: form.displayType.value,
        })
      });
      const {status, message} = await data.json();
      // check if update was sucessful
      if (status) {
        console.log(message)
        // show notification
        swal.fire(
          'Awesome!',
          message,
          'success'
        )
        location.href = `/main/preferences`;
      } else {
        // show notification
        swal.fire(
          'Failed!',
          message,
          'error'
        )
      }
    } catch (error) {
      console.log(error);
    }
};
