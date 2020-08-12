// const Route = new Routes;
let userId;
const getBusinessUserList = async (user) =>{
  userId = user;
  try {
    const users = await fetch(`${Route.apiRoot}/users/business/all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    return await users.json();
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
      scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
      footer: false // display/hide footer
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
        field: 'User',
        title: 'Name',
        template: function (row) {
          console.log(row)
          return row.firstname && row.lastname ? row.firstname + ' ' + row.lastname  : row.name ? row.name : row.username;
        }
      },
      {
        field: 'department_name',
        title: 'Department',
        width: 100,
      },
      {
        field: 'role',
        title: 'Role',
        width: 100,
      },
      {
        field: 'profile',
        title: 'Profile',
        width: 100,
      },
      {
        field: 'status',
        title: 'Status',
        width: 50,
        template: function (row) {
          const color = row.status == 'inactive' ? 'danger' : 'success';
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
            <a href="/user/${row.id}" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="View">
              <i class="la la-edit"></i>
            </a>
            `;
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


const insertListData = async (user) => {
  try {
  const { data } = await getBusinessUserList(user);
    console.log(data)
    insertTableData(data)

  }catch(err) {
    console.log(err)
  }
};
