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

let ParentPC =[];
const preferenceData = async ()=>{
    const { data } = await fetchData('/preferences');
        data.forEach(pc=>{
            if(pc.parentPC != null){
                ParentPC = data.filter(preference=> pc.parentPC === preference.id);
            }else{
                ParentPC =[];
            }
            pc.ParentPC = ParentPC.length != 0 ? ParentPC[0].name : '';
        });
        
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
        field: 'name',
        title: 'Name',
    },
    {
        field: 'tier',
        title: 'Tier',
        width: 50,
        template: function (row) {
        return `Tier ${row.tier}`;
        }
    },
    {
        field: 'ParentPC',
        title: 'Parent Preference Center',
    },
    {
        field: 'pcCode',
        title: 'Code',
        width: 50,
        template: function (row) {
        return `p${row.pcCode}`;
        }
    },
    {
        field: 'displayType',
        title: 'Display Type',
    },
    {
        field: 'actions',
        title: 'Actions',
        sortable: false,
        width: 100,
        template: function (row) {
        return `
            <a class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="modal" data-target="#preference_modal" title="Edit Preference">
                <span id="${row.id}" class="updateBtn">
                    <i class="la la-edit"></i>
                </span>
            </a>
            <a class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Delete Preference">
                <span id="${row.id}" class="deleteBtn" data-app="${row.name}">
                    <i class="la la-trash"></i>
                </span>
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
        const data = await preferenceData();
        insertTableData(data)

    }catch(err) {
        console.log(err)
}
};
jQuery(document).ready(function() {
    insertListData();   
    KTFormControls.init();
    setTimeout(deletePreference, 2000);
    setTimeout(populateUpdateModal, 2000);
});

//Create Preference Event Handlers
const insertOptions = (data) => {
    let optionData = `<option value=''>Select An Option</option>`;
    data.forEach(row=>{
        optionData += `<option value='${row.id}'>${row.name}</option>`;
    });
    return optionData
};
const KTFormControls = function () {
    // Private functions
    
    var demo1 = function () {
        $( "#kt_form_1" ).validate({
            // define validation rules
            rules: {
                name: {
                    required: true,
                },
                tier: {
                    required: true,
                    digits: true
                },
                pcCode: {
                    required: true,
                    digits: true,
                },
                displayType: {
                    required: true,
                },
                
            },
            //display error alert on form submit  
            invalidHandler: function(event, validator) {
                var alert = $('#kt_form_1_msg');
                alert.parent().removeClass('kt-hidden');
                KTUtil.scrollTo("kt_form_1", -200);
            },
        });

        $('#kt_select2_3').select2({
            placeholder: "----Select----",
        });

    }

    return {
        // public functions
        init: function() {
            demo1();  
        }
    };
}();

const showCreatePreferenceModal = async () => {
    const {data} = await fetchData('/preferences'); 
    const optionData = insertOptions(data);
    document.getElementById('kt_select2_0').innerHTML= optionData;
};

const createPreferenceHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    
    try {
    const request = await fetch(`/api/v1/preferences/create`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json", 
        },
        body: JSON.stringify({
            name: form.name.value,
            tier: form.tier.value, 
            pcCode: form.pcCode.value, 
            displayType: form.displayType.value, 
            parentPC: form.parentPC.value,
        })
    });
    const data = await request.json();
    console.log(data)
    // check if create was sucessful
    if (data.status) {
        // show notification
        swal.fire(
            'Awesome!',
            data.message,
            'success'
        );
        location.href = `/main/preferences`;
    } else {
        
        // show notification
        swal.fire(
            'Failed!',
            data.message,
            'error'
        )
    }
    } catch (error) {
    console.log(error);
    }
};
//Delete Preference Event handlers
const deletePreference = () => {
    const deleteBtn = document.querySelectorAll('.deleteBtn');
    deleteBtn.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            let preferenceId = btn.getAttribute('id')
            let preferenceName = btn.dataset.app;
            const result = await Swal.fire({
                title: `Delete "${preferenceName}" ?`,
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
            });
            if (result.value) {
                try {
                    const response = await fetch(`/api/v1/preferences/${preferenceId}/delete`);
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

//Update Preference Event handlers
const populateUpdateModal = async ()=>{
    const updateBtn = document.querySelectorAll('.updateBtn');
    updateBtn.forEach(button => { 
        button.addEventListener('click', async (e) => {
            const form = document.getElementById('kt_form_2');
            const preferenceId = button.getAttribute('id');

            const {data} = await fetchData('/preferences'); 
            const preference = data.filter(pc=> pc.id == preferenceId);

            form.setAttribute('onsubmit', `updatePreference(event,${preferenceId})`);
            form.name.value = preference[0].name;
            form.tier.value = preference[0].tier;
            form.pcCode.value = preference[0].pcCode;
            form.displayType.value = preference[0].displayType;
            const optionData = insertOptions(data);
            form.parentPC.innerHTML= optionData;

        })
    })
};

const updatePreference = async (event, preferenceId) => {
    event.preventDefault();
  console.log(preferenceId)
    const form = event.target;
    try {
      const data = await fetch(`/api/v1/preferences/${preferenceId}/update`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.value,
          pcCode: form.pcCode.value,
          parentPC: form.parentPC.value,
          tier: form.tier.value,
          displayType: form.displayType.value,
        })
      });
      const {status, message} = await data.json();
      // check if update was sucessful
      if (status) {
        console.log(message)
        // show notification
        swal.fire(
          'Awesome!',
          message,
          'success'
        )
        location.href = `/main/preferences`;
      } else {
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
};
  