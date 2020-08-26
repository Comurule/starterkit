"use strict";
// Class definition

var KTFormControls = function () {
    // Private functions
 
    var demo1 = function () {
        $( "#kt_form_1" ).validate({
            // define validation rules
            rules: {
                email: {
                    required: true,
                    email: true 
                },
                firstName: {
                    required: true 
                },
                lastName: {
                    required: true, 
                },
                preferences: {
                    required: true,
                },
                
            },
            //display error alert on form submit  
            invalidHandler: function(event, validator) {
                var alert = $('#kt_form_1_msg');
                alert.parent().removeClass('kt-hidden');
                KTUtil.scrollTo("kt_form_1", -200);
            },
        });

        $('#kt_select2_3').select2({
            placeholder: "----Choose The Preferred Preferences----",
        });

    }

    return {
        // public functions
        init: function() {

            demo1();  
        }
    };
}();

jQuery(document).ready(function() { 
    showPreferenceOptions();  
    KTFormControls.init();
});

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
const insertOptions = (data) => {
  let optionData = `<option value=''>Select An Option</option>`;
  data.forEach(row=>{
      optionData += `<option value='${row.id}'>${row.name}</option>`;
  });
  return optionData
};  
const showPreferenceOptions = async () => {
  const {data} = await fetchData('/preferences'); 
  const optionData = insertOptions(data);
  document.getElementById('kt_select2_3').innerHTML= optionData;
};


const submitHandler= async function (event) {
  event.preventDefault();
  const form = event.target;
    try {
      const request = await fetch(`/api/v1/contacts/create`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName.value, 
          lastName: form.lastName.value, 
          email: form.email.value,
          username: form.username.value,
          address: form.address.value,
          city: form.city.value,
          country: form.country.value,
          mailingCurrency: form.mailingCurrency.value,
          mailingLanguage: form.mailingLanguage.value,
          mailingName: form.mailingName.value,
          mailingWebsite: form.mailingWebsite.value,
          mailingEmail: form.mailingEmail.value,
          mailingAddress: form.mailingAddress.value,
          mailingCity: form.mailingCity.value,
          mailingCountry: form.mailingCountry.value,
          preferences: $('#kt_select2_3').val()
        })
      });
      const data = await request.json();
      // check if update was sucessful
      if (data.status) {
        // show notification
        await swal.fire(
          'Awesome!',
          data.message,
          'success'
        )
        location.href = `/main/leads`;
      } else {
        // show notification
        swal.fire(
          'Failed!',
          data.message,
          'error'
        )
      }
    } catch (error) {
      console.log(error);
    }
  
    //form[0].submit() ./; // submit the form
}