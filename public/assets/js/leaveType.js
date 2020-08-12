// const Route = new Routes;
let leaveId;
// get user data with => await loggedInUser

const createLeaveType = async (event, userId) => {

  event.preventDefault();
  let formData = [];
  const items = document.querySelectorAll('.kt-repeater__item');
  // Loop through form data and check if any field is empty
  for (let x = 0; x < items.length; x++) {
    const name = items[x].children['leave-name'].children.name.value;
    if (name.trim() == '') {
      return swal.fire( 'Failed!', 'Leave Type name cannot be empty', 'error' )
    };
    formData.push({ name })
  }

  try {
    const leave = await fetch(`${Route.apiRoot}/leave/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ leaveType: formData, userId })
    });
    const response = await leave.json();
    console.log(response);
    if (response.status) {
      return location.href = '/leave-types';
    }

    // display error message
    swal.fire(
      'Failed!',
      response.message,
      'error'
    )
  } catch (error) {
    console.log(error);
    swal.fire(
      'Failed!',
      'An error occured!',
      'error'
    )
  }
};

const getLeaveTypesBusiness = async (userId) => {
  try {
    const leaveTypes = await fetch(`${Route.apiRoot}/leave-types/business`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    return await leaveTypes.json();
  } catch (error) {
    console.log(error);
  }
};

const insertListData = async (id) => {
  const { data } = await getLeaveTypesBusiness(id);
  console.log(data)
  // get access to dom
  const itemsList = document.getElementById('itemsList');
  if (itemsList) {
    itemsList.innerHTML = '';
    if (data != 'None') {
      data.forEach(data => {
        itemsList.innerHTML += `
            <a href="/leave/${ data.id}" class="list-group-item list-group-item-action flex-column align-items-start">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1 font-weight-bold">${data.name}</h5>
                <small>${ data.Requests.length < 2 ? data.Requests.length + ' leave request' : data.Requests.length + ' leave requests'}</small>
              </div>
            </a>
          `
      });
    } else {
      itemsList.innerHTML += `
            <div class="list-group-item list-group-item-action flex-column align-items-start">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">No Leave Type Found.</h5>
              </div>
              <p class="mb-1">Oops, none found. <a href="/leave/create">Try creating one!</a></p>
            </div>
          `
    }
  }
};

const getLeaveType = async (id) => {
  leaveId = id;
  try {
    const leave = await fetch(`${Route.apiRoot}/leave/${id}`, {
      method: 'GET'
    });
    return await leave.json();
  } catch (error) {
    console.log(error);
  }
};

const insertDetailData = async (id) => {
  const { data } = await getLeaveType(id);
  console.log(data)
  if (data != 'None') {
    document.getElementById('itemDetail').innerHTML = `
      <div class="kt-portlet__head">
        <div class="kt-portlet__head-label">
          <span class="kt-portlet__head-icon">
            <i class="flaticon-interface-2"></i>
          </span>
          <h3 class="kt-portlet__head-title">
            ${data.name}
            <small>${ data.Requests.length < 2 ? data.Requests.length + ' leave request' : data.Requests.length + ' leave requests'}</small>
          </h3>
        </div>
      </div>
      <div class="kt-portlet__body">
        <div class="kt-portlet__content">
          ${data.Requests.length > 0 ?
            `` :
          'No Request here.'}
        </div>
      </div>
      <div class="kt-portlet__foot">
        <div class="row align-items-center">
          <div class="col-lg-6">
          Last updated ${ moment(data.updatedAt).fromNow()}
          </div>
        </div>
      </div>
      `
  } else {
    document.getElementById('itemDetail').innerHTML = `
      <div class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">This leave does not exist!</h5>
        </div>
        <p class="mb-1">Oops, not found. <a href="/leave/create">Try creating one!</a></p>
      </div>
    `
  }
};

const updateLeaveType = async (form) => {
  event.preventDefault();
  $('[data-dismiss="modal"]').trigger('click');
  let date = new Date(form.input.value);
  console.log(date)
  // console.log(moment(form.input.value).format('YYYY-MM-DD'))
  let formattedDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
  let user = form.user.value;
  let formData = `start=${formattedDate}&userId=${user}`;
  try {
    const leave = await fetch(`${Route.apiRoot}/leave/${leaveId}/update`, {
      method: 'POST',
      headers: {
        // "Content-type": "application/json",
        "Content-type": "application/x-www-form-urlencoded"
      },
      body: formData
    });
    const { status, message } = await leave.json();
    // check if update was sucessful
    if (status) {
      console.log(message)
      // show notification
      swal.fire(
        'Awesome!',
        response.message,
        'success'
      )
      location.href = `/leave/${leaveId}`;
    } else {
      console.log(status, message)
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
}

const deleteLeaveType = async () => {
  swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!'
  }).then(async function (result) {
    if (result.value) {
      try {
        const leave = await fetch(`${Route.apiRoot}/leave/${leaveId}/delete`, {
          // mode: 'no-cors',
          method: 'GET'
        });
        const { status, message } = await leave.json();
        // check if delete was sucessful
        if (status) {
          console.log(message);
          swal.fire(
            'Deleted!',
            message,
            'success'
          )
          // show notification
          // toastr.success(message, "Success");
          location.href = `/leave-types/manage`;
        } else {
          console.log(status, message)
          swal.fire(
            'Failed!',
            message,
            'error'
          )
          // show notification
          // toastr.error(message, "error");
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}

const assign = async (scheduleId) => {
  try {
    const leave = await fetch(`${Route.apiRoot}/schedule/${scheduleId}/leave/${leaveId}/assign`, {
      method: 'GET'
    });
    const { status, message } = await leave.json();
    // check if assign was sucessful
    if (status) {
      console.log(message);
      // show notification
      toastr.success(message, "Success");
      location.href = `/leave/${leaveId}`;
    } else {
      console.log(status, message)
      // show notification
      swal.fire(
        'Failed!',
        message,
        'error'
      )
    }
  } catch (error) {
    console.log(error);
    // show notification
    toastr.error("An error was encountered, pleases review your network connection!", "Error");
  }
}

const unAssign = async (scheduleId) => {
  try {
    const leave = await fetch(`${Route.apiRoot}/schedule/${scheduleId}/leave/${leaveId}/unassign`, {
      method: 'GET'
    });
    const { status, message } = await leave.json();
    // check if unasign was sucessful
    if (status) {
      console.log(message);
      // show notification
      swal.fire(
        'Awesome!',
        message,
        'success'
      )
      location.href = `/leave/${leaveId}`;
    } else {
      console.log(status, message)
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
}
