const currentYear = new Date().getFullYear();
console.log(currentYear)

const checkYear = (year, requestYear) => {
  if (year != requestYear) return false;
  return true;
}
      
const dashboard = function () {

  const getUserLeaveBalance = async (userId) =>{
    try {
      const response = await fetch(`${Route.apiRoot}/user/leave-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      return await response.json();
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

  const getBusinessLists = async (list, status, userId, listType) =>{
    try {
      let url;
      if (listType && !status) url = `${Route.apiRoot}/${list}/business/${listType}`
      else if (listType && status) url = `${Route.apiRoot}/${list}/business/${status}/${listType}`
      else url = `${Route.apiRoot}/${list}/business`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      return await response.json();
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

  const requestsStatistics = (users, requests, approved, rejected) => {
    // Mini charts
    if (users) {
      KTLib.initMiniChart($('#requests_chart'), requests, KTApp.getStateColor('warning'), 2, false, false);
      KTLib.initMiniChart($('#users_chart'), users, KTApp.getStateColor('brand'), 2, false, false);
      KTLib.initMiniChart($('#rejected_chart'), rejected, KTApp.getStateColor('danger'), 2, false, false);
      KTLib.initMiniChart($('#approved_chart'), approved, KTApp.getStateColor('success'), 2, false, false);
    } else {
      KTLib.initMiniChart($('#my_requests_chart'), requests, KTApp.getStateColor('warning'), 2, false, false);
      KTLib.initMiniChart($('#my_rejected_chart'), rejected, KTApp.getStateColor('danger'), 2, false, false);
      KTLib.initMiniChart($('#my_approved_chart'), approved, KTApp.getStateColor('success'), 2, false, false);
    }

    const mainChart = document.getElementById("main_chart");
    const userChart = document.getElementById("user_chart");
    // Main chart
    if (!mainChart && !userChart) {
      return;
    }

    var ctx, gradient1, gradient2;
    if (users) {
      ctx = mainChart.getContext("2d");
      
      gradient1 = ctx.createLinearGradient(0, 0, 0, 350);
      gradient1.addColorStop(0, Chart.helpers.color(KTApp.getStateColor('success')).alpha(0.3).rgbString());
      gradient1.addColorStop(1, Chart.helpers.color(KTApp.getStateColor('success')).alpha(0).rgbString());
      
      gradient2 = ctx.createLinearGradient(0, 0, 0, 350);
      gradient2.addColorStop(0, Chart.helpers.color(KTApp.getStateColor('danger')).alpha(0.3).rgbString());
      gradient2.addColorStop(1, Chart.helpers.color(KTApp.getStateColor('danger')).alpha(0).rgbString());
    }
    
    var ctx2 = userChart.getContext("2d");

    var gradient3 = ctx2.createLinearGradient(0, 0, 0, 350);
    gradient3.addColorStop(0, Chart.helpers.color(KTApp.getStateColor('success')).alpha(0.3).rgbString());
    gradient3.addColorStop(1, Chart.helpers.color(KTApp.getStateColor('success')).alpha(0).rgbString());
    
    var gradient4 = ctx2.createLinearGradient(0, 0, 0, 350);
    gradient4.addColorStop(0, Chart.helpers.color(KTApp.getStateColor('danger')).alpha(0.3).rgbString());
    gradient4.addColorStop(1, Chart.helpers.color(KTApp.getStateColor('danger')).alpha(0).rgbString());
    
    var mainConfig = {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
          label: 'Approved',
          borderColor: KTApp.getStateColor('success'),
          borderWidth: 2,
          backgroundColor: gradient1 ? gradient1 : gradient3,
          pointBackgroundColor: KTApp.getStateColor('success'),
          data: approved,
        }, {
          label: 'Rejected',
          borderWidth: 1,
          borderColor: KTApp.getStateColor('danger'),
          backgroundColor: gradient2 ? gradient2 : gradient4,
          pointBackgroundColor: KTApp.getStateColor('danger'),
          data: rejected
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false,
          text: ''
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: 'nearest',
          bodySpacing: 5,
          yPadding: 10,
          xPadding: 10,
          caretPadding: 0,
          displayColors: false,
          backgroundColor: KTApp.getStateColor('brand'),
          titleFontColor: '#ffffff',
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0
        },
        legend: {
          display: false,
          labels: {
            usePointStyle: false
          }
        },
        hover: {
          mode: 'index'
        },
        scales: {
          xAxes: [{
            display: false,
            scaleLabel: {
              display: false,
              labelString: 'Month'
            },
            ticks: {
              display: false,
              beginAtZero: true
            }
          }],
          yAxes: [{
            display: true,
            stacked: false,
            scaleLabel: {
              display: false,
              labelString: 'Value'
            },
            gridLines: {
              color: '#eef2f9',
              drawBorder: false,
              offsetGridLines: true,
              drawTicks: false
            },
            ticks: {
              display: false,
              beginAtZero: true
            }
          }]
        },
        elements: {
          point: {
            radius: 0,
            borderWidth: 0,
            hoverRadius: 0,
            hoverBorderWidth: 0
          }
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        }
      }
    };

    var chart;
    if (users) chart = new Chart(ctx, mainConfig);
    var chart2 = new Chart(ctx2, mainConfig);

    // Update chart on window resize
    KTUtil.addResizeHandler(function () {
      if (users) chart.update();
      chart2.update();
    });
  }
  
  return {
    init: async function (year) {    
      const currentUser = await loggedInUser; // Get logged in user data (declared in layout)
      const userId = currentUser.data.id;

      const totalRequests = document.getElementById('business-requests');
      const totalUsers = document.getElementById('business-users');
      const totalApprovedRequests = document.getElementById('approved-requests');
      const totalRejectedRequests = document.getElementById('rejected-requests');
      const myLeaveBal = document.getElementById('my-leave-bal');
      const myTotalRequests = document.getElementById('my-requests');
      const myTotalApprovedRequests = document.getElementById('my-approved-requests');
      const myTotalRejectedRequests = document.getElementById('my-rejected-requests');
      // leave balance for user
      const leaveBal = await getUserLeaveBalance(userId)
      console.log(leaveBal.data)
      // lists for a business (rendered on the admin dashboard)
      const businessUsers = await getBusinessLists('users', '', userId, 'all');
      const businessRequests = await getBusinessLists('requests', '', userId, 'all');
      const businessApprovedRequests = await getBusinessLists('requests', 'approved', userId, 'all');
      const businessRejectedRequests = await getBusinessLists('requests', 'rejected', userId, 'all');
      // Lists for a particular user (rendered on the admin and staff dashboards)
      const myRequestsList = await getBusinessLists('requests', '', userId, 'manage');
      const myApprovedRequestsList = await getBusinessLists('requests', 'approved', userId, 'manage');
      const myRejectedRequestsList = await getBusinessLists('requests', 'rejected', userId, 'manage');

      // Insert all data
      if (myLeaveBal) {
        if (leaveBal.status)
          myLeaveBal.innerHTML = leaveBal.data.leaveDurationLeft + ' of ' + leaveBal.data.leaveLimit + 'hrs';
        else myLeaveBal.innerHTML = 'Not found';
      }

      const users = businessUsers.data;
      if (totalUsers) totalUsers.innerHTML = 0;
      let businessUsersList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (users != 'None') {
        if (totalUsers) totalUsers.innerHTML = users.length;
        users.map(user => {
          let index = new Date(user.createdAt).getMonth();
          if (checkYear(year, new Date(user.createdAt).getFullYear())) businessUsersList[index]++
        })
      }

      const requests = businessRequests.data;
      if (totalRequests) totalRequests.innerHTML = 0;
      let businessRequestsList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (requests != 'None') {
        if (totalRequests) totalRequests.innerHTML = requests.length;
        requests.map(request => {
          let index = new Date(request.createdAt).getMonth();
          if (checkYear(year, new Date(request.createdAt).getFullYear())) businessRequestsList[index]++
        })
      }

      const approvedRequests = businessApprovedRequests.data;
      if (totalApprovedRequests) totalApprovedRequests.innerHTML = 0;
      let approved = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (approvedRequests != 'None') {
        if (totalApprovedRequests) totalApprovedRequests.innerHTML = approvedRequests.length;
        approvedRequests.map(request => {
          let index = new Date(request.start).getMonth();
          if (checkYear(year, new Date(request.start).getFullYear())) approved[index]++
        })
      }

      const rejectedRequests = businessRejectedRequests.data;
      if (totalRejectedRequests) totalRejectedRequests.innerHTML = 0;
      let rejected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (rejectedRequests != 'None') {
        if (totalRejectedRequests) totalRejectedRequests.innerHTML = rejectedRequests.length;
        rejectedRequests.map(request => {
          let index = new Date(request.start).getMonth();
          if (checkYear(year, new Date(request.start).getFullYear())) rejected[index]++
        })
      }

      const myRequests = myRequestsList.data;
      if (myTotalRequests) myTotalRequests.innerHTML = 0;
      let myTotalRequestsList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (myRequests != 'None') {
        if (myTotalRequests) myTotalRequests.innerHTML = myRequests.length;
        myRequests.map(request => {
          let index = new Date(request.createdAt).getMonth();
          if (checkYear(year, new Date(request.createdAt).getFullYear())) myTotalRequestsList[index]++
        })
      }

      const myApprovedRequests = myApprovedRequestsList.data;
      if (myTotalApprovedRequests) myTotalApprovedRequests.innerHTML = 0;
      let myApproved = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (myApprovedRequests != 'None') {
        if (myTotalApprovedRequests) myTotalApprovedRequests.innerHTML = myApprovedRequests.length;
        myApprovedRequests.map(request => {
          let index = new Date(request.start).getMonth();
          if (checkYear(year, new Date(request.start).getFullYear())) myApproved[index]++
        })
      }

      const myRejectedRequests = myRejectedRequestsList.data;
      if (myTotalRejectedRequests) myTotalRejectedRequests.innerHTML = 0;
      let myRejected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (myRejectedRequests != 'None') {
        if (myTotalRejectedRequests) myTotalRejectedRequests.innerHTML = myRejectedRequests.length;
        myRejectedRequests.map(request => {
          let index = new Date(request.start).getMonth();
          if (checkYear(year, new Date(request.start).getFullYear())) myRejected[index]++
        })
      }
      if (currentUser.data.profile == 'Admin' || currentUser.data.profile == 'Owner') {
        requestsStatistics(businessUsersList, businessRequestsList, approved, rejected);
        requestsStatistics(null, myTotalRequestsList, myApproved, myRejected);
      } else requestsStatistics(null, myTotalRequestsList, myApproved, myRejected);
    }
  }
}();

// Class initialization
jQuery(document).ready(function() {
  dashboard.init(currentYear);
});

const yearInput = document.getElementById('year');
yearInput.addEventListener('keydown', () => yearInput.style.borderColor = 'blue');

const searchYear = (event) => {
  event.preventDefault();
  const form = event.target;
  const year = form.year.value;
  if (!year.trim() || isNaN(Number(year))) {
    form.year.style.borderColor = 'red';
    return;
  }

  dashboard.init(year);
}
