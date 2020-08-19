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