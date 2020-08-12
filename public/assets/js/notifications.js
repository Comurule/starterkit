// const Route = new Routes;
let userId;
// getNotificationList is also declared in notification-solid.ejs

const getNotificationList = async (user) => {
  userId = user;
  try {
    const notifications = await fetch(`${Route.apiRoot}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    return await notifications.json();
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

const getNotificationDetail = async (id) => {
  try {
    const notifications = await fetch(`${Route.apiRoot}/notification/${id}`);
    return await notifications.json();
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

const approveRequest = async (userId, action) => {
  try {
    const notifications = await fetch(`${Route.apiRoot}/notification/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, action })
    });
    const response = await notifications.json();
    console.log(response)
    if (response.status) return swal.fire('Awesome!', response.message, 'success')
    swal.fire('Oops!', 'Could not add user to business', 'error');
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

const insertListData = async (user) => {
  try {
    const { data } = await getNotificationList(user);
    // console.log(data)

    // access DOM
    const itemsList = document.getElementById('itemsList');
    if (itemsList) {
      itemsList.innerHTML = '';
      if (data != 'None') {
        data.forEach(data => {
          itemsList.innerHTML += `
            <a href="/dashboard/notification/${ data.id}" class="list-group-item list-group-item-action flex-column align-items-start" style="background-color:${data.status == 'unread' ? '#ECF7F9' : ''}">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${ data.title}</h5>
                <small>Received ${ moment(data.createdAt).fromNow()} - ${data.status == 'read' ? `Read ${ moment(data.updatedAt).fromNow()}` : ''}</small>
              </div>
            </a>
          `
        });
      } else {
        itemsList.innerHTML += `
            <div class="list-group-item list-group-item-action flex-column align-items-start">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">No notificaton yet!</h5>
              </div>
              <p class="mb-1">Oops, none found!</p>
            </div>
          `
      }
    }
  } catch (err) {
    itemsList.innerHTML += `
      <div class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">An error occured.</h5>
        </div>
        <p class="mb-1">Please retry!</p>
      </div>
    `
  }
};

const insertDetailData = async (id) => {
  try {
    const currentUser = await loggedInUser; // Get logged in user data (declared in layout)
    const userId = currentUser.data.id;
    const { data } = await getNotificationDetail(id);
    console.log(data)

    // access DOM
    const itemDetail = document.getElementById('itemDetail');
    if (itemDetail) {
      itemDetail.innerHTML = '';
      itemDetail.innerHTML += `
      <div class="kt-portlet__body">
      <div class="kt-widget__label">
        <h5 class="kt-portlet__head-title">${data.title}</h5>
        <div class="kt-widget__wrapper">
          <div class="kt-widget__label">
            <a href="#" class="kt-widget__title">

            </a>
            <p class="kt-widget__desc">
              ${ data.description ? data.description : 'Not set'}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="kt-portlet__separator"></div>
    <div class="kt-portlet__body">
      <div class="">
        <div class="kt-widget__label text-right">
          <button type="button" class="btn btn-danger btn-elevate-hover btn-sm" onclick="deleteNotification(${data.id})">
            Delete
          </button>
        </div>
      </div>
    </div>
          `
    }
  } catch (err) {
    itemDetail.innerHTML += `
      <div class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">An error occured.</h5>
        </div>
        <p class="mb-1">Please retry!</p>
      </div>
    `
  }
};
