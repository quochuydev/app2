let configDev = { 
	backend_url: 'http://localhost:3002'
};

let configPro = { 
	backend_url: 'https://crmdlc.herokuapp.com'
};

let result = configDev;
const hostname = window && window.location && window.location.hostname;
if (hostname.indexOf('crmdlc.herokuapp.com') > -1) {
  result = configPro;
}
export default result;
