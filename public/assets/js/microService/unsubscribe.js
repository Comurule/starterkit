//Fetch Helper
const fetchData = async (url) =>{
    try {
      const preferences = await fetch(`/api/v2/msc${url}`);
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

console.log(window.location.search);
const unsubscribePreferencesHandler = async () =>{
    const response = await fetchData(location.search);
    
    console.log(response);
    // check if create was sucessful
    if (response.status) {
        // show notification
        await swal.fire(
            'Awesome!',
            response.message,
            'success'
        );
        // location.href = `/main/campaigns`;
    } else {
        
        // show notification
        await swal.fire(
            'Failed!',
            response.message,
            'error'
        )
    }
}

jQuery(document).ready(function() {
    
    setTimeout(unsubscribePreferencesHandler, 500);
});