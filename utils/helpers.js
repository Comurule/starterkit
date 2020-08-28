const nodemailer = require('nodemailer');


exports.randNum = () => {
    let num = Math.floor(Math.random()*99999)+1;
    if(num.toString().length < 5){
        num = num.toString().length == 3? `00${num}` : num.toString().length == 4? `0${num}` : num;
        return num;
    };
    return num;
};
/**
 * Checks if the model code is unique. If true, changes the modelCode value. 
 * @param {string} prefix letter to be added to the number generated
 * @param {number} size length of the number to be generated
 * @param {object} model Model class
 * @param {object} condition the model code in "{" "}". eg. {pcCode}  
 * @param {} modelCode variable holding the model code.
 * @returns {} modelCode
 */
exports.checkCodeGen = async (prefix, size, model, condition, modelCode) => {
    let checkModelCode = await model.findOne({where: condition});
    if(checkModelCode) {
        while(checkModelCode) {
            checkModelCode = {};
            modelCode = codeGen(prefix, size);
            checkModelCode = await model.findOne({where: condition});
        }
    }
};

/**
 * Generates a code for the model. 
 * @param {string} prefix letter(s) to be added to the number generated
 * @param {number} size length of the number to be generated
 * @returns {string} modelCode
 */
exports.codeGen = (prefix, size) => {
    const multiplyingValue1= multiplyingValue(size);
    let modelCode = Math.floor(Math.random() * multiplyingValue1 );
    while (modelCode.toString().length < size) {
        modelCode = '0'+ modelCode;
    }
    return `${prefix}${modelCode}`;
};

exports.sendEmail = async (email, subject, mailTemplate) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'val.umechukwu@gmail.com',
        pass: 'mystatus' // naturally, replace both with your real credentials or an application-specific password
      }
    });
    const mailOptions = {
      from: 'Sales Book App <no-reply@salesbook.com>',
      to: email.toString(),
      subject: subject.toString(),
      html: mailTemplate.toString()
    };
    console.log('sending email to '+email);
       transporter.sendMail(mailOptions, function(error, info){
          if (error) {
        	console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
           
       })
}

exports.message = async (companyLink, leadCode, pcCodeString, campaignCode) => {
  const html = `<table width="100%" max-width="500px"style="padding: 0 40px 0 40px; background-color:#ffffff; margin: 100px auto;">
  <tr>
    <td align="center" style="background-color:#ffffff; margin: 0 50px 0 50px;">
      <a><img src= alt="Logo" width="120" height="100" style="display: block;"></a>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 0 50px 0 50px;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%"
        style="background-color:#ffffff; padding: 0 0 0 20px; margin: 5px auto;">
        <tr>
          <td align="center" style="font-family:sans-serif; font-size: 28px; color: #050505;">
            <p>Hey there,</p>
          </td>
        </tr>
        <tr>
          <td align="center"
            style="color: #153643; font-family: sans-serif; font-size: 16px; line-height: 20px;">
            <p>Thank you for subscribing to the Sales Book App.</p><p>Click the links below to manage how we engage you.</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="text-align: center;">
            <a style="width:250px; display:inline-block; text-decoration: none; font-size: 18px; text-align:center;
      background-color:#55acee; border-radius:2px; color:white; height:32px; cursor: pointer; margin: 30px auto; padding-top:9px;"
              href="${companyLink}?leadCode=${leadCode}&PC=${pcCodeString}&action=unsubscribe">
              Unsubscribe
            </a>
          </td>
        </tr>
        <tr>
          <td align="center" style="text-align: center;">
            <a style="width:250px; display:inline-block; text-decoration: none; font-size: 18px; text-align:center;
      background-color:#55acee; border-radius:2px; color:white; height:32px; cursor: pointer; margin: 30px auto; padding-top:9px;"
              href="${companyLink}?leadCode=${leadCode}&action=manprefs">
              Manage Preferences
            </a>
          </td>
        </tr>
        <tr>
          <td align="center" style="text-align: center;">
            <a style="width:250px; display:inline-block; text-decoration: none; font-size: 18px; text-align:center;
      background-color:#55acee; border-radius:2px; color:white; height:32px; cursor: pointer; margin: 30px auto; padding-top:9px;"
              href="${companyLink}?leadCode=${leadCode}&campaignCode=${campaignCode}&action=mancamp">
              Manage Campaign Data
            </a>
          </td>
        </tr>
        <tr>
          <td align="center"
            style="color: #153643; font-family:sans-serif; font-size: 16px; line-height: 20px;">
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 30px 30px 30px 30px; margin: 100px;">
      Sales Book App &copy; 2020<br />
    </td>
  </tr>
</table>
  `;
  return html;
};



const codeGen = (prefix, size) => {
    const multiplyingValue1= multiplyingValue(size);
    let modelCode = Math.floor(Math.random() * multiplyingValue1 );
    while (modelCode.toString().length < size) {
        modelCode = '0'+ modelCode;
    }
    return `${prefix}${modelCode}`;
};

const multiplyingValue = (size) => {
    let num = '';
    while(num.length < size) {
        num+='9'
    }
    return Number(num);
};