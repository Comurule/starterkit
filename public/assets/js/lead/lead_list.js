
const fetchData = async () =>{
  try {
    const leads = await fetch('https://comurule-leadcampaign.herokuapp.com/api/v1/leads', {
      headers: { 
        cookie: req.headers.cookie 
      }
    });
    return await leads.json();
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
      pageSize: 10,
    },
    // layout definition
    layout: {
      scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
	  height: 700, // datatable's body's fixed height
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
      {
        field: 'name',
        title: 'Name',
        template: function (row) {
          return `<a href="/main/leads/${row.id}"> ${row.firstName} ${row.lastName}</a>`;
        }
      },
      {
        field: 'username',
        title: 'Username',
      },
      {
        field: 'email',
        title: 'Lead Email',
      },
      {
        field: 'campaign',
        title: 'Campaign',
      },
      {
        field: 'leadStatus',
        title: 'Lead Status',
        template: function (row) {
          const color = (row.leadStatus == 'new') ? 'steel' : 'success';
          return `<span class="badge badge-${color}">${row.leadStatus}</span>`;
        }
      },
      {
        field: 'actions',
        title: 'Actions',
		    sortable: false,
		    width: 150,
        template: function (row) {
          return `
            <a href="/main/leads/${row.id}/update" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Edit Lead Details">
              <i class="la la-edit"></i>
            </a>
            <a href="/main/leads/${row.id}/delete" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Delete Lead">
              <i class="la la-trash"></i>
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
};

const insertListData = async () => {
  try {
  const { data } = await fetchData();
    insertTableData(data)

  }catch(err) {
    console.log(err)
  }
};

jQuery(document).ready(function() {
	insertListData();
});