const utils = require('./utils');

let devices = [
    { imei: '000000000000011', path: '//Assignable', type: 'xswitch' },
    {
      imei: '000000000000013',
      path: '//company1',
      type: 'xsole',
      error_codes: [Array]
    },
    {
      imei: '000000000000012',
      path: '//company1/sub1',
      type: 'xswitch',
      site: [Object]
    },
    { imei: '000000000000014', path: '//Assignable' },
  ];

let query = {type: {$ne: "xswitch"}};
// let query = {type: {$in: ["xsole", undefined]}};
// let query = {type: {$exists: false}};

for(let device of devices){
    if(utils.entityMatchQuery(device, query)){
        console.log(device.imei);
    }
}