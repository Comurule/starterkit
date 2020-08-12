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

    }

    return {
        // public functions
        init: function() {
            demo1();  
        }
    };
}();

jQuery(document).ready(function() {    
    KTFormControls.init();
});



const submitHandler= async function (event) {
  event.preventDefault();
  const form = event.target;
    try {
      const request = await fetch(`https://comurule-leadcampaign.herokuapp.com/api/v1/leads/create`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
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