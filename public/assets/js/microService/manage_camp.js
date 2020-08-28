//Fetch Helper
const fetchData = async (url) =>{
    try {
      const preferences = await fetch(`/api/v2/msc${url}`);
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
    console.log(location.search);
    const { data } = await fetchData(location.search);        
        return data;
};

//Preference List Event Handlers
const insertTableData = (data) => {
    console.log(data);
    let textCampaignData = data.campaignData.filter(cd=> cd.displayType == 'text');
    let cbCampaignData = data.campaignData.filter(cd=> cd.displayType == 'checkbox');
    
    let cdForm = `<input type="hidden" name="leadCampaignId" value="${data.leadCampaign.id}">
                  <input type="hidden" name="leadId" value="${data.leadCampaign.leadId}">`
    if(textCampaignData.length > 0){
        textCampaignData.forEach(cd=>{
            cdForm += `<div class="form-group col-md-6">
			    <label>${cd.dataLabel}</label>
			    <input type="hidden" name="dataLabel,${cd.id}" value="${cd.dataLabel}">
				<input type="text" class="form-control" name="value,${cd.id}" placeholder="${cd.dataLabel}">
			</div>`
        });
    }
    
    if(cbCampaignData.length > 0){
        cdForm += `<div class="form-group">
		<label>Check where appropriate...</label>
		<div class="kt-checkbox-inline">`
		
		cbCampaignData.forEach(cd=>{
             cdForm += `
    			<label class="kt-checkbox">
    			    <input type="hidden" name="dataLabel,${cd.id}" value="${cd.dataLabel}">
    				<input type="checkbox" name="value,${cd.id}"> ${cd.dataLabel}
    				<span></span>
    			</label>
    			`
        });
        
        cdForm += `</div></div>`
    }
    
    document.getElementById('campaign_form').innerHTML= cdForm;
};
const insertListData = async () => {
    try {
        const data = await preferenceData();
        insertTableData(data)

    }catch(err) {
        console.log(err)
}
};

const submitHandler= async function (event) {
  event.preventDefault();
  const form = event.target;
  const formData = $('form').serializeArray();
  
  //organize the data in formData to fit the input body data to send to the API
  const leadCampaignId = formData[0].value;
  const leadId = formData[1].value;
  let formDetails =[];
  for(var i=2; i<formData.length; i++){
      var campaignDataObj = formData[i];
      if(campaignDataObj.name.split(',')[0] == 'dataLabel' && formData[i+1]?.name.split(',')[0] == 'value'){
          formDetails.push({
              dataLabel: campaignDataObj.value, 
              value: formData[i+1].value, 
              campaignDataId: campaignDataObj.name.split(',')[1]
          })
      }
      if(
          campaignDataObj.name.split(',')[0] == 'dataLabel' && 
          (formData[i+1]?.name.split(',')[0] != 'value' || i == formData.length-1)
        ){
           formDetails.push({
              dataLabel: campaignDataObj.value, 
              value: 'off', 
              campaignDataId: campaignDataObj.name.split(',')[1]
          }) 
        }
  }
  console.log(formDetails)
  
    try {
      const request = await fetch(`/api/v2/leadCampaignData/update`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          formDetails,
          leadCampaignId,
          leadId
        })
      });
      const data = await request.json();
      // check if update was sucessful
      if (data.status) {
        // show notification
        await swal.fire(
          'Awesome!',
          data.message,
          'success'
        )
        // location.href = `/main/leads`;
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
  
    //form[0].submit() ./; // submit the form
}
  

jQuery(document).ready(function() {
    insertListData();   
});