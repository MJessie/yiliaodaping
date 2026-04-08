

const authorization = Cookies.get('Authorization')

const area = localStorage.getItem('curPosCode');

const baseUrl = '/support';

const dcamBaseUrl = '/dcam';

const dcimBaseUrl = '/dcim';

const cmdbBaseUrl = '/cmdb';

// const dcomBaseUrl = '/dcom';

//将 dcomBaseUrl 改为相对路径，这样会自动使用当前页面的域名和端口：

const dcomBaseUrl = '/dcom';



let groovyUrl = '/groovyscript/execute/';



// 设备运维大屏-获取页面刷新时间间隔

function api_getItDevViewWaitTime() {

  return $.ajax({

    url: dcomBaseUrl + groovyUrl + 'GET_ITDEVVIEW_WAITTIME',

    type: 'POST',

    contentType: 'application/json',

    // data: JSON.stringify({

    //   _INPUT_LOCATION: area

    // }),

    headers: {

      "Authorization": authorization

    }

  });

}



//调用 groovy execture 不带参数

function api_getGroovyExecuteNoParams(configCode) {

  return $.ajax({

    url: dcomBaseUrl + groovyUrl + configCode,

    type: 'POST',

    contentType: 'application/json',

    // data: JSON.stringify({

    //   _INPUT_LOCATION: area

    // }),

    headers: {

      "Authorization": authorization

    }

  });

}

function api_getGroovyExecuteDcimParams(configCode, functionCode) {

  return $.ajax({

    url: dcimBaseUrl + groovyUrl + configCode,

    type: 'POST',

    contentType: 'application/json',

    data: JSON.stringify({

      functionCode: functionCode

    }),

    headers: {

      "Authorization": authorization

    }

  });

}
function api_getGroovyExecuteCmdbParams(configCode, functionCode) {
  return $.ajax({
    url: cmdbBaseUrl + groovyUrl + configCode,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      functionCode: functionCode
    }),
    headers: {
      "Authorization": authorization
    }
  });
}

function updateTime() {

  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, '0');

  const date = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');

  const minutes = String(now.getMinutes()).padStart(2, '0');

  const seconds = String(now.getSeconds()).padStart(2, '0');

  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  const weekDay = weekDays[now.getDay()];

  //document.getElementById('timeDate').textContent = `${year}-${month}-${date}\t${weekDay}`;
  // document.getElementById('timeDate').textContent = `${year}-${month}-${date}\t${hours}:${minutes}:${seconds}`;
  //document.getElementById('timeClock').textContent = `${hours}:${minutes}:${seconds}`
  document.getElementById('timeDate').textContent = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
  //document.getElementById('timeClock').textContent = `${hours}:${minutes}:${seconds}`;

  // document.getElementById('timeWeek').textContent = weekDay;

}

