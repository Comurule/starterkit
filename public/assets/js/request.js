// const Route = new Routes;
let requestId;
const fileUploader = document.getElementById('leaveDocument');
const requestsList = document.getElementById('requests-list');
const switchViewBtnAll = document.getElementById('switch-view-all');
const switchViewBtnManage = document.getElementById('switch-view-manage');
let listView = true;
// if (switchViewBtnAll) switchViewBtnAll.checked = false;
if (switchViewBtnAll) {
  switchViewBtnAll.onchange = () => {
    console.log('clicked')
    listView = !listView;
    switchView(listView, 'all');
  }
}
if (switchViewBtnManage) {
  switchViewBtnManage.onchange = () => {
    console.log('clicked')
    listView = !listView;
    switchView(listView, 'manage');
  }
}

if (fileUploader) {
  fileUploader.onchange = () => {
    const file = fileUploader.files[0];
    const fileDisplay = document.getElementById('file');
    if (file) {
      fileDisplay.innerHTML = `Selected file - ` + file.name
    } else fileDisplay.innerHTML = 'No file selected';
  };

  fileUploader.ondragover = (e) => {
    console.log(e)
  };

  fileUploader.ondrop = (e) => {
    console.log(e)
  };
};

const createLeaveRequest = async (event, userId) => {
  event.preventDefault();
  const form = event.target;
  const file = form.leaveDocument.files[0];
  // check for file selected for upload
  console.log(file, 'here')
  const formData = new FormData();
  if (file) {
    console.log(file.type)
    if (file.type != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && file.type != 'application/pdf' && file.type != 'text/plain' && file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
      return swal.fire(
        'Failed to upload file',
        'File format not supported',
        'error'
      )
    }
    formData.append('file', file)
  }
  formData.append('leaveType', form.leaveType.value)
  formData.append('start', form.start.value)
  formData.append('leaveOption', form.leaveOption.value)
  formData.append('leaveDuration', form.leaveDuration.value)
  formData.append('additionalNote', form.additionalNote.value)
  formData.append('supervisor', form.supervisor.value)
  formData.append('manager', form.manager.value)
  formData.append('emergencyContactName', form.emergencyContactName.value)
  formData.append('emergencyContactPhone', form.emergencyContactPhone.value)
  formData.append('leaveDocument', file)
  formData.append('userId', userId)

  try {
    let message;
    const request = await fetch(`${Route.apiRoot}/request/create`, {
      method: 'POST',
      body: formData
    });
    const response = await request.json();
    console.log(response);
    if (response.status) {
      swal.fire(
        'Awesome!',
        response.message,
        'success'
      )
      return location.href = '/requests/manage';
    }
    if (response.errors) {
      message = '';
      response.errors.forEach(error => {
        message += error.msg + ', '
      })
    } else {
      message = response.message;
    }
    // display error message
    swal.fire({
      title: 'Unsuccessful!',
      html: `<span class="text-danger">${message}</span>`,
      type: 'error'
    })
  } catch (error) {
    console.log(error);
  }
};

const getRequests = async (userId) => {
  try {
    const requests = await fetch(`${Route.apiRoot}/requests/business/all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    return await requests.json();
  } catch (error) {
    console.log(error);
  }
};

const getApprovedRequests = async (userId) => {
  try {
    const requests = await fetch(`${Route.apiRoot}/requests/business/approved/all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    return await requests.json();
  } catch (error) {
    console.log(error);
  }
};

const getRejectedRequests = async (userId) => {
  try {
    const requests = await fetch(`${Route.apiRoot}/requests/business/rejected/all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    return await requests.json();
  } catch (error) {
    console.log(error);
  }
};

const insertTableData = (data) => {
  // paginated table
  var datatable = $('.kt_datatable').KTDatatable({
    // datasource definition
    data: {
      type: 'local',
      source: data,
      pageSize: 15,
    },
    // layout definition
    layout: {
      // customScrollbar: true,
      scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.
      footer: true // display/hide footer
    },
    // column sorting
    sortable: true,
    pagination: true,
    search: {
      input: $('#generalSearch')
    },
    // columns definition
    columns: [
      // {
      // 	field: 'UserId',
      //   title: '#',
      //   width: 60,
      // 	type: 'number',
      // },
      {
        field: 'Leave',
        title: 'Leave Name',
        width: 100,
        template: function (row) {
          return row.Leave.name ? row.Leave.name : "--";
        },
        type: '',
      },
      {
        field: 'User',
        title: 'Name',
        template: function (row) {
          console.log(row)
          return row.User ? row.User.firstname + ' ' + row.User.lastname : 'Self';
        }
      },
      {
        field: 'createdAt',
        title: 'Date Requested',
        width: 100,
        type: 'date',
        template: function (row) {
          return moment(row.createdAt).format('LL');
        }
      },
      {
        field: 'start',
        title: 'Start Date',
        width: 100,
        type: 'date',
        template: function (row) {
          return moment(row.start).format('LL');
        }
      },
      {
        field: 'status',
        title: 'Status',
        width: 200,
        template: function (row) {
          const color = row.status == 'rejected' ? 'danger' : (row.status == 'pending - awaiting review' ? 'secondary' : (row.status == 'approved - first approval' ? 'warning' : 'success'));
          return `<span class="badge badge-${color}">${row.status}</span>`;
        }
      },
      {
        field: 'actions',
        title: 'Actions',
        width: 50,
        sortable: false,
        template: function (row) {
          return `
            <!-- <span class="dropdown">
                <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
                  <i class="la la-ellipsis-h"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right">
                    <a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>
                    <a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>
                    <a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>
                </div>
            </span> -->
            <a href="/request/${row.id}" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="View">
              <i class="la la-edit"></i>
            </a>`;
        },
      }
    ]
  });

  $('#kt_form_status').on('change', function () {
    datatable.search($(this).val().toLowerCase(), 'status');
  });

  $('#kt_form_type').on('change', function () {
    datatable.search($(this).val().toLowerCase(), 'type');
  });

  $('#kt_form_status,#kt_form_type').selectpicker();
}

let requestsData;
const insertListData = async (user) => {
  if (switchViewBtnAll) switchViewBtnAll.checked = false;
  const { data } = await getRequests(user);
  requestsData = data;
  insertTableData(data);
};

const insertManageListData = async () => {
  const { data } = await loggedInUser; // Get logged in user data (declared in layout)
  const { Requests } = data;
  requestsData = Requests;
  try {
    insertTableData(Requests);
  } catch (error) {
    console.log(error)
  }
};

const insertCalendarData = () => {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ['interaction', 'dayGrid', 'timeGrid'],
    header: {
      left: 'prev,today,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    navLinks: true, // can click day/week names to navigate views
    selectable: false,
    weekNumbers: true,
    // defaultView: 'timeGridWeek',
    // selectMirror: true,
    // select: function(arg) {
    //   console.log(arg)                    
    //   calendar.unselect()
    // },
    eventClick: function (info) {
      location.href = `/request/${info.event.id}`;
    },
    eventMouseEnter: function (info) {
      info.el.style.cursor = 'pointer';
    },
    eventLimit: true, // allow "more" link when too many events
    events: requestsData,
    eventBackgroundColor: '#D9DFFF'
  });
  calendar.render();
}

const getRequest = async (id) => {
  requestId = id;
  try {
    const request = await fetch(`${Route.apiRoot}/request/${id}`);
    return await request.json();
  } catch (error) {
    console.log(error);
  }
};

let currentUser;
const insertDetailData = async (id) => {
  const currentUser = await loggedInUser; // Get logged in user data (declared in layout)
  const { data } = await getRequest(id);
  let dApprove, dReject, sApprove, mApprove;
  data.status == 'approved - second approval' || data.status == 'rejected' ? dApprove = 'disabled' : '';
  data.status == 'approved - first approval' && currentUser.data.role == 'Supervisor' ? sApprove = 'disabled' : '';
  data.status != 'approved - first approval' && currentUser.data.role == 'Manager' ? mApprove = 'disabled' : '';
  data.status == 'rejected' || data.status == 'approved - second approval' ? dReject = 'disabled' : '';
  console.log(currentUser.data, data)
  if (data != 'None') {
    document.getElementById('itemDetail').innerHTML = `
      <div class="kt-portlet__head">
        <div class="kt-portlet__head-label">
          <span class="kt-portlet__head-icon">
            <i class="flaticon-interface-2"></i>
          </span>
          <h3 class="kt-portlet__head-title">
            ${data.User.firstname} ${data.User.lastname} - 
            <small>Leave request type - ${data.Leave ? data.Leave.name : '--'}</small>
          </h3>
        </div>
      </div>
      <div class="kt-portlet__body">
        <div class="kt-portlet__content">
          <h6>This request is ${data.status}.</h6>
          <p>
            Starts from ${ moment(data.start).format('LLL')} and ends in ${data.leaveDuration} ${data.leaveOption}.
          </p>
          <h6>Emergency Contact: </h6>
          <ul>
            <li>Name: ${ data.emergencyContactName}</li>
            <li>Phone: ${ data.emergencyContactPhone}</li>
          </ul>
          <h6>Additional info: </h6>
          <ul>
            <li>Supporting document: ${ data.supportingDocument ? `<a href="${data.supportingDocument}" target="_blank" class="btn btn-sm btn-link"><i class="la la-cloud-download"></i> download file</a>` : 'None'}</li>
            <li>Notes: ${ data.additionalNote ? data.additionalNote : 'None'}</li>
          </ul>
        </div>
      </div>
      <div class="kt-portlet__foot">
        <div class="row align-items-center">
          <div class="col-lg-6">
          Requested ${ moment(data.createdAt).fromNow()}
          </div>
          ${currentUser.data.role == 'Manager' || currentUser.data.role == 'Supervisor' ?
        `<div class="col-lg-6 text-right">
            <button type="button" class="btn btn-brand btn-elevate-hover btn-sm" ${dApprove} ${sApprove} ${mApprove} onclick="actionRequest(${currentUser.data.id}, ${id}, 'approve')">
              Approve
            </button>
            <button type="button" class="btn btn-danger btn-elevate-hover btn-sm" ${dReject} ${mApprove} onclick="actionRequest(${currentUser.data.id}, ${id}, 'reject')">
              Reject
            </button>
          </div>`
        : ''}
        </div>
      </div>
      `
  } else {
    document.getElementById('itemDetail').innerHTML = `
      <div class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">This request does not exist!</h5>
        </div>
        <p class="mb-1">Oops, not found. <a href="/request/create">Try creating one!</a></p>
      </div>
    `
  }
};

const updateRequest = async (event) => {
  event.preventDefault();

  const form = event.target;
  try {
    const request = await fetch(`${Route.apiRoot}/request/${requestId}/update`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        leaveType: form.leaveType.value,
        start: form.start.value,
        leaveOption: form.leaveOption.value,
        leaveDuration: form.leaveDuration.value,
        additionalNote: form.additionalNote.value,
        emergencyContactName: form.emergencyContactName.value,
        emergencyContactPhone: form.emergencyContactPhone.value,
        supportingDocument: form.supportingDocument.value,
        userId: form.user.value
      })
    });
    const { status, message, errors } = await request.json();
    // check if update was sucessful
    if (status) {
      $('[data-dismiss="modal"]').trigger('click');
      console.log(message)
      // show notification
      swal.fire(
        'Awesome!',
        message,
        'success'
      )
      location.href = `/request/${requestId}`;
    } else {
      console.log(status, message)
      let error = message;
      if (!error && errors) {
        error = '';
        errors.forEach(err => error += err.msg + ', ')
      }
      // show notification
      swal.fire(
        'Failed!',
        error,
        'error'
      )
    }
  } catch (error) {
    console.log(error);
  }
}

const deleteRequest = async () => {
  swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!'
  }).then(async function (result) {
    if (result.value) {
      try {
        const request = await fetch(`${Route.apiRoot}/request/${requestId}/delete`, {
          // mode: 'no-cors',
          method: 'GET'
        });
        const { status, message } = await request.json();
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
          location.href = `/requests/manage`;
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

const actionRequest = async (userId, requestId, action) => {
  try {
    let verb;
    if (action == 'approve') verb = 'Approval';
    else if (action == 'reject') verb = 'Rejection'
    console.log(userId, requestId)
    const request = await fetch(`${Route.apiRoot}/request/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, requestId })
    });
    const response = await request.json();
    console.log(response)
    if (response.status) {
      swal.fire(
        'Awesome!',
        `${verb} was successful`,
        'success'
      )
      return insertDetailData(response.data.id)
    }
    swal.fire(
      'Oops!',
      `${response.message}`,
      'error'
    )
  } catch (error) {
    console.log(error);
    // show network error notification
    swal.fire(
      'Oops!',
      'An error was encountered!',
      'error'
    )
  }
};


const switchView = async (listView, type) => {
  const user = await loggedInUser;
  if (listView) {
    requestsList.innerHTML = `
      <div class="kt-portlet__head  kt-portlet__head--noborder">
        <div class="kt-portlet__head-label">
          <h3 class="kt-portlet__head-title">Leave Requests</h3>
        </div>
        <div class="kt-portlet__body">
          <!--begin: Search Form -->
          <div class="kt-form kt-fork--label-right kt-margin-t-20 kt-margin-b-10">
            <div class="row align-items-center">
              <div class="col-xl-8 order-2 order-xl-1">
                <div class="row align-items-center">
                  <div class="col-md-6 kt-margin-b-20-tablet-and-mobile ml-auto">
                    <div class="kt-input-icon kt-input-icon--left">
                      <input type="text" class="form-control" placeholder="Search..." id="generalSearch">
                      <span class="kt-input-icon__icon kt-input-icon__icon--left">
                        <span><i class="la la-search"></i></span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--end: Search Form -->
        </div>
      </div>
      <div class="kt-portlet__body kt-portlet__body--fit">
        <!--begin: Datatable -->
        <div class="kt_datatable" id="local_data"></div>
        <!--end: Datatable -->
      </div>
    `;

    if (type == 'all') insertListData(user.data.id);
    else insertManageListData();
  } else {
    requestsList.innerHTML = `
    <div class="p-2">
      <div id="calendar"></div>
    </div>
    `;

    insertCalendarData();
  }
}