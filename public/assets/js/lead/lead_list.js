"use strict"


const fetchData = async () =>{
  try {
    const leads = await fetch('/api/v1/leads');
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

const deleteLead = () => {
  const deleteBtn = document.querySelectorAll('.deleteBtn');
  deleteBtn.forEach(btn => {
      console.log(btn);
      btn.addEventListener('click', async (e) => {
          let leadId = btn.getAttribute('id')
          let email = btn.dataset.app;
          const result = await Swal.fire({
              title: `Delete "${email}" ?`,
              text: "You won't be able to revert this!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Yes, delete it!',
          });
          if (result.value) {
              try {
                  const response = await fetch(`/api/v1/leads/${leadId}/delete`);
                  const data = await response.json();
                  if (data.status) {
                      await Swal.fire(
                      '',
                      `${data.message}`,
                      'success'
                      );
                      location.reload();
                  } else {
                      await Swal.fire(
                          '',
                          `${data.message}`,
                          'success'
                      );
                      location.reload();
                  }
              } catch (error) {
                  console.log(error)
                  swal.fire({
                      "title": "",
                      "text": error.data.message,
                      "type": "error",
                      "confirmButtonClass": "btn btn-secondary m-btn m-btn--wide"
                  })
              };
          };
      });
  });
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
        field: 'leadSource',
        title: 'Lead Source',
      },
      {
        field: 'email',
        title: 'Lead Email',
      },
      {
        field: 'leadStatus',
        title: 'Lead Status',
        template: function (row) {
          const color = (row.leadStatus == 'new') ? 'info' : 'success';
          return `<span class="badge badge-${color}">${row.leadStatus}</span>`;
        }
      },
      {
        field: 'actions',
        title: 'Actions',
		    sortable: false,
		    width: 150,
        template: function (row) {
          if(row.leadStatus == 'new'){
          return `
            <a href="/main/leads/${row.id}" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="View Lead Details">
              <i class="la la-eye"></i>
            </a>
            <a href="/main/leads/${row.id}/update" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Edit Lead Details">
              <i class="la la-edit"></i>
            </a>
            
          `;
          } else {
            return `
              <a href="/main/leads/${row.id}" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="View Lead Details">
                <i class="la la-eye"></i>
              </a>
              `
          }
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
  setTimeout(deleteLead, 2000);
});