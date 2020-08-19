//Fetch Helper
const fetchData = async (url) =>{
    try {
      const preferences = await fetch(`/api/v1${url}`);
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
const response = async ()=>{
    const { data } = await fetchData('/leadPreference');
        console.log(data);
        
        return data;
};

//Preference List Event Handlers
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
        scroll: false,
        height: 700, 
        footer: false 
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
        field: 'lead',
        title: 'Lead Name',
        template: function (row) {
          return `<a href="/main/leads/${row.Lead.id}" title="View Lead"> ${row.Lead.firstName} ${row.Lead.lastName}</a>`;
        }
    },
    {
        field: 'preference',
        title: 'Preference',
        width: 200,
        template: function (row) {
          return `${row.PreferenceCenter.name}`;
        }
    },
    {
        field: 'isActive',
        title: 'Active',
        width: 75,
        textAlign: 'center',
        template: function (row) {
          const color = (row.isActive) ? 'success' : 'danger';
          const status = (row.isActive) ? 'Active' : 'Inactive';
          return `<span class="badge badge-${color}">${status}</span>`;
        }
    },
    {
        field: 'enrolled',
        title: 'Enrolled',
        width: 75,
        textAlign: 'center',
        template: function (row) {
          const color = (row.enrolled) ? 'success' : 'danger';
          const status = (row.enrolled) ? 'Enrolled' : 'Not Enrolled';
          return `<span class="badge badge-${color}">${status}</span>`;
        }
    },
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
        const data = await response();
        insertTableData(data)

    }catch(err) {
        console.log(err)
}
};
jQuery(document).ready(function() {
    insertListData();
});
  