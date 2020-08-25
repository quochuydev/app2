let configDev = { 
	backend_url: 'http://localhost:3002'
};

let configPro = { 
	backend_url: 'https://posdlc.herokuapp.com'
};

let result = configDev;
const hostname = window && window.location && window.location.hostname;
if (hostname.indexOf('posdlc.herokuapp.com') > -1) {
  result = configPro;
}
export default result;
