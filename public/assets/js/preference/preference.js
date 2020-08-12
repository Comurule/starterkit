//Fetch Helper
const fetchData = async (url) =>{
    try {
      const preferences = await fetch(`https://comurule-leadcampaign.herokuapp.com/api/v1${url}`);
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
//Preferences List Event handlers

// jQuery(document).load(function() {
//     if(error && error != '') {
//         swal.fire('Failed!', error.message, 'error')
//     };
//     if(success & success !='') {
//         swal.fire('Success', success.message, 'success' )
//     };
// });

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
            <a href="/main/preferences/${row.id}/update" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Edit Preference">
                <i class="la la-edit"></i>
            </a>
            <a href="/main/preferences/${row.id}/delete" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Delete Preference" href="/main/preferences/${row.id}/delete">
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
let ParentPC =[];
const response = async ()=>{
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
}
const insertListData = async () => {
    try {
        const data = await response();
        console.log(data);
        insertTableData(data)

    }catch(err) {
        console.log(err)
}
};
jQuery(document).ready(function() {
    insertListData();
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

jQuery(document).ready(function() {    
    KTFormControls.init();
});
const showCreatePreferenceModal = async () => {
    const {data} = await fetchData('/preferences'); 
    const optionData = insertOptions(data);
    document.getElementById('kt_select2_0').innerHTML= optionData;
};

const createPreferenceHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    
    try {
    const request = await fetch(`https://comurule-leadcampaign.herokuapp.com/api/v1/preferences/create`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            name: form.name.value,
            tier: form.tier.value, 
            pcCode: form.pcCode.value, 
            displayType: form.displayType.value, 
            parentPC: form.parentPC.value
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
        location.href = `https://comurule-leadcampaign.herokuapp.com/main/preferences`;
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