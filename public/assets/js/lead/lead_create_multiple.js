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
                campaignCode: {
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
    showCampaignOptions();
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
const insertCampaignOptions = (data) => {
  let optionData = `<option value=''>Select An Option</option>`;
  data.forEach(row=>{
      optionData += `<option value='${row.campaignCode}'>${row.campaignName}</option>`;
  });
  return optionData
};

const showPreferenceOptions = async () => {
  const {data} = await fetchData('/preferences'); 
  const optionData = insertOptions(data);
  document.getElementById('kt_select2_3').innerHTML= optionData;
};
const showCampaignOptions = async () => {
  const {data} = await fetchData('/campaigns'); 
  const optionData = insertCampaignOptions(data);
  document.getElementById('kt_select2_2').innerHTML= optionData;
};

const submitHandler= async function (event) {
  event.preventDefault();
  const form = event.target;
  const formDetails = $('form').serializeArray().filter(e=> e.name.match(/formDetails/))
  console.log($('form').serializeArray());
  console.log(formDetails);
    try {
      const request = await fetch(`/api/v1/leads/create`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          leadSource: form.leadSource.value,
          firstName: form.firstName.value, 
          lastName: form.lastName.value, 
          email: form.email.value,
          username: form.username.value,
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
          campaignCode: $('#kt_select2_2').val(),
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