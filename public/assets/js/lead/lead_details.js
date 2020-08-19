"use strict";

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

const fetchResWithoutRedirect = async (data) => {
  if (data.status) {
    // show notification
    await swal.fire(
      'Awesome!',
      data.message,
      'success'
    );
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

const convertLead = async (leadId) => {
  const leadData = await fetch(`api/v1/leads/${leadId}`);
  const {data} = await leadData.json();
  const preferences = data.PreferenceCenters.map(pc=>pc.id);
  const accountData = {
    firstName: data.firstName, 
    lastName: data.lastName, 
    email: data.email,
    username: data.username,
    address: data.address,
    city: data.city,
    country:data.country,
    billingCurrency: data.leadCurrency,
    billingLanguage: data.leadLanguage,
    billingName: data.companyName,
    billingEmail: data.companyEmail,
    billingWebsite: data.companyWebsite,
    billingAddress: data.companyAddress,
    billingCity: data.companyCity,
    billingCountry: data.companyCountry,
    preferences,
    leadId: leadId,
    createdBy: data.createdBy
  };
  const contactData = {
    firstName: data.firstName, 
    lastName: data.lastName, 
    email: data.email,
    username: data.username,
    address: data.address,
    city: data.city,
    country:data.country,
    mailingCurrency: data.leadCurrency,
    mailingLanguage: data.leadLanguage,
    mailingName: data.companyName,
    mailingEmail: data.companyEmail,
    mailingWebsite: data.companyWebsite,
    mailingAddress: data.companyAddress,
    mailingCity: data.companyCity,
    mailingCountry: data.companyCountry,
    preferences,
    leadId: leadId,
    createdBy: data.createdBy
  };

  const response = await Promise.all([
    fetchData('/accounts/create', accountData),
    fetchData('/contacts/create', contactData),
  ]);
  const newAccount = response[0];
  const newContact = response[1];

  await fetchResWithoutRedirect(newAccount);
  await fetchResWithoutRedirect(newContact);
  if(newAccount.status && newContact.status) {
    const leadUpdate = await fetchData(`/leads/${leadId}/convert`, {leadStatus: 'converted'});
    await fetchResponse(leadUpdate, '/main/leads');
  };
  
}; 

const deleteLead = async (event, leadId) =>{
  event.preventDefault();
  const result = await Swal.fire({
    title: `Delete Lead?`,
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete this Lead!',
  });
  if(result.value){
    const data = await fetch(`/api/v1/leads/${leadId}/delete`);
    const response = await data.json();
    await fetchResponse(response, `/main/leads`);
  };
};