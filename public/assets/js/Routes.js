class Routes {
  constructor () {
  }

  get root () {
    return 'http://localhost:8000/'; // 
    // return 'https://manifest-leave-request.herokuapp.com/';
  };

  get apiRoot () { 
    return 'http://localhost:8000/api/v1'; // API Route
    // return 'https://manifest-leave-request.herokuapp.com/api';
  };

  get fetchData (url, config) {
    return  async (url, config) => {
      try {
        const preferences = await fetch('/api/v1/preferences', config);
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
  };
}