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

const preferenceData = async ()=>{
    const { data } = await fetchData('/campaignData');
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
        field: 'dataLabel',
        title: 'Label',
    },
    {
        field: 'displayType',
        title: 'Display Type',
    },
    {
        field: 'cdCode',
        title: 'Code',
    },
    {
        field: 'campaignName',
        title: 'Campaign',
    },
    {
        field: 'actions',
        title: 'Actions',
        sortable: false,
        width: 100,
        template: function (row) {
        return `
            <a class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="modal" data-target="#preference_modal" title="Edit Details">
                <span id="${row.id}" class="updateBtn">
                    <i class="la la-edit"></i>
                </span>
            </a>
            <a class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Delete Campaign Data">
                <span id="${row.id}" class="deleteBtn" data-app="${row.dataLabel}">
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

//Create Campaign Data Event Handlers
const insertOptions = (data) => {
    let optionData = `<option value=''>Select A Campaign</option>`;
    data.forEach(row=>{
        optionData += `<option value='${row.id}'>${row.campaignName}</option>`;
    });
    return optionData
};
const KTFormControls = function () {
    // Private functions
    
    var demo1 = function () {
        $( "#kt_form_3" ).validate({
            // define validation rules
            rules: {
                dataLabel: {
                    required: true,
                },
                displayType: {
                    required: true,
                }, 
                campaignId: {
                    required: true,
                },                 
            },
        });

    }

    return {
        // public functions
        init: function() {
            demo1();  
        }
    };
}();
const showCreateCampaignDataModal = async () => {
    const {data} = await fetchData('/campaigns'); 
    console.log(data);
    const optionData = insertOptions(data);
    document.getElementById('kt_select2_0').innerHTML= optionData;
};
const createCampaignDataHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    
    try {
    const request = await fetch(`/api/v1/campaignData/create`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json", 
        },
        body: JSON.stringify({
            dataLabel: form.dataLabel.value,
            displayType: form.displayType.value,
            campaignId: form.campaignId.value,
        })
    });
    const data = await request.json();
    console.log(data)
    // check if create was sucessful
    if (data.status) {
        // show notification
        await swal.fire(
            'Awesome!',
            data.message,
            'success'
        );
        location.href = `/main/campaignData`;
    } else {
        
        // show notification
        await swal.fire(
            'Failed!',
            data.message,
            'error'
        )
    }
    } catch (error) {
    console.log(error);
    // show notification
    await swal.fire(
        'Failed!',
        'Poor Network Connection',
        'error'
    )
    }
};

//Delete Campaign Event handlers
const deleteCampaignData = () => {
    const deleteBtn = document.querySelectorAll('.deleteBtn');
    deleteBtn.forEach(btn => {
    console.log(btn);
        btn.addEventListener('click', async (e) => {
            console.log('hit')
            let campaignId = btn.getAttribute('id')
            let campaignName = btn.dataset.app;
            const result = await Swal.fire({
                title: `Delete "${campaignName}" ?`,
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
            });
            if (result.value) {
                try {
                    const response = await fetch(`/api/v1/campaigns/${campaignId}/delete`);
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
                            'error'
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

//Update Campaign Event handlers
const populateUpdateModal = async ()=>{
    const updateBtn = document.querySelectorAll('.updateBtn');
    updateBtn.forEach(button => { 
        button.addEventListener('click', async (e) => {
            const form = document.getElementById('kt_form_2');
            const campaignId = button.getAttribute('id');

            const {data} = await fetchData('/campaigns'); 
            const campaign = data.filter(pc=> pc.id == campaignId);

            form.setAttribute('onsubmit', `updatePreference(event,${campaignId})`);
            form.campaignName.value = campaign[0].campaignName;

        })
    })
};

const updateCampaignData = async (event, campaignId) => {
    event.preventDefault();
  console.log(campaignId)
    const form = event.target;
    try {
      const data = await fetch(`/api/v1/campaigns/${campaignId}/update`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
            campaignName: form.campaignName.value,
        })
      });
      const {status, message} = await data.json();
      // check if update was sucessful
      if (status) {
        console.log(message)
        // show notification
        await swal.fire(
          'Awesome!',
          message,
          'success'
        )
        location.href = `/main/campaigns`;
      } else {
        // show notification
        await swal.fire(
          'Failed!',
          message,
          'error'
        )
      }
    } catch (error) {
      console.log(error);
      // show notification
      await swal.fire(
        'Failed!',
        'Poor Network Signal',
        'error'
      )
    }
};
  

jQuery(document).ready(function() {
    insertListData();   
    KTFormControls.init();
    setTimeout(deleteCampaignData, 2000);
    setTimeout(populateUpdateModal, 2000);
});