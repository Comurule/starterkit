"use strict";

//Helpers
const fetchData = async (url, data) => {
  const request = await fetch(`https://comurule-leadcampaign.herokuapp.com/api/v1${url}`, {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
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
    location.href = `https://comurule-leadcampaign.herokuapp.com${url}`;
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

const updateIsActive = async (event, leadPreferenceId, leadId) => {
  event.preventDefault();
  const isActive = event.target;
  const bodyData = {
    isActive: isActive.value == 'true' ? false : true,
  };
  try {
    const data = await fetchData(`/leadpreference/${leadPreferenceId}/update`, bodyData);
    //Response Notification
    await fetchResponse(data, `/main/leads/${leadId}`);      
  } catch (error) {
    console.log(error);
  };
};

const updateEnrolled = async (event, leadPreferenceId, leadId) => {
  event.preventDefault();
  const enrolled = event.target;
  const bodyData = {
    enrolled: enrolled.value == 'true' ? false : true,
  };
  try {
    const data = await fetchData(`/leadpreference/${leadPreferenceId}/update`, bodyData);
    //Response Notification
    await fetchResponse(data, `/main/leads/${leadId}`);      
  } catch (error) {
    console.log(error);
  };
};