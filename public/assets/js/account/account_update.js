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
                    digits: false
                },
                username: {
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

    };
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
//Helpers
const fetchData = async (url, data) => {
  const request = await fetch(`/api/v1${url}`, {
    method: 'POST',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data)
  });
  return await request.json();   
};
const fetchResponse = async (data, url) =>{
  if (data.status) {
    // show notification
    await swal.fire(
      'Awesome!',
      data.message,
      'success'
    );
    location.href = `${url}`;
  } else {
    // show notification
    swal.fire(
      'Failed!',
      data.message,
      'error'
    )
  };
};
//Update Lead Handler
const updateLead= async (event, leadId) => {
  event.preventDefault();
  const form = event.target;
    try {
      const bodyData = {
        firstName: form.firstName.value, 
        lastName: form.lastName.value, 
        email: form.email.value,
        username: form.username.value,
        password: form.password.value,
        address: form.address.value,
        city: form.city.value,
        country: form.country.value,
        leadCurrency: form.leadCurrency.value,
        leadLanguage: form.leadLanguage.value,
        companyName: form.companyName.value,
        companyWebsite: form.companyWebsite.value,
        companyEmail: form.companyEmail.value,
        companyAddress: form.companyAddress.value,
        companyCity: form.companyCity.value,
        companyCountry: form.companyCountry.value,
        preferences: $('#kt_select2_3').val()
      };
      const data = await fetchData(`/leads/${leadId}/update`, bodyData);
      //Response Notification
      await fetchResponse(data, `/main/leads/${leadId}`);      
    } catch (error) {
      console.log(error);
    };
};

const getFetchData = async (url) =>{
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
  const {data} = await getFetchData('/preferences'); 
  const optionData = insertOptions(data);
  document.getElementById('kt_select2_3').innerHTML= optionData;
};