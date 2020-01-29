const Csdn = require('./csdn')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var allowCors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
};
//使用跨域中间件
app.use(allowCors);
// uuid_tt_dd=10_20908839300-1557737699666-349567; __yadk_uid=WsVq7MpU1sS9mjEODsjBKy71wcPWXFHF; smidV2=20190530153723b14a2fe66a4aa397ee0982092339d17700ad367edc62a8e00; UN=weixin_43972437; Hm_ct_6bcd52f51e9b3dce32bec4a3997715ac=6525*1*10_20908839300-1557737699666-349567!1788*1*PC_VC!5744*1*weixin_43972437; _ga=GA1.2.734680169.1560324581; dc_session_id=10_1564108243946.290640; Hm_ct_e5ef47b9f471504959267fd614d579cd=5744*1*weixin_43972437!6525*1*10_20908839300-1557737699666-349567; Hm_lvt_68e4fcbdf7246711fd1ed9da02ae71cf=1569487579; Hm_ct_68e4fcbdf7246711fd1ed9da02ae71cf=5744*1*weixin_43972437!6525*1*10_20908839300-1557737699666-349567; Hm_lvt_e5ef47b9f471504959267fd614d579cd=1571885267,1572943139; Hm_ct_62052699443da77047734994abbaed1b=5744*1*weixin_43972437!6525*1*10_20908839300-1557737699666-349567; CloudGuest=vM4RTqqhl0aGAq69geZ4FxbvbHztJ0mj6Dt68h7o3jkxh9Z3dEpCvfYn7sWz10YQ0rcDxrrBywKjPV4fJG/neP7h+Nvb5f7TZqKdrEu2lqpzTBFQL1GOixqbwxhsM0pb3eg0x+nHHay9T/ZgKTHutZpChQX68cfCaoPF0vFaEwIzU5wMzR2f6wEbYfrkpcSd; UM_distinctid=16f1d4e4ca580c-09cc9f58d6659a-3b7b516b-13c680-16f1d4e4ca66ad; Hm_lvt_eb5e3324020df43e5f9be265a8beb7fd=1576836536; Hm_ct_eb5e3324020df43e5f9be265a8beb7fd=5744*1*weixin_43972437!6525*1*10_20908839300-1557737699666-349567; TY_SESSION_ID=d65f606a-a730-4b53-b33b-1d18c845d104; SESSION=e6cb23cd-c451-490a-90e4-dc0a12977660; UserName=weixin_43972437; UserInfo=0a02921d12a7477897e9bf304051db58; UserToken=0a02921d12a7477897e9bf304051db58; UserNick=Lvan-Zhang; AU=DB7; BT=1578020559670; p_uid=U000000; Hm_lvt_62052699443da77047734994abbaed1b=1578044570; Hm_lpvt_62052699443da77047734994abbaed1b=1578044570; acw_tc=2760824615785648783292227e93ab2965752751b9d939127db8d1b60ad0a0; __gads=ID=16f9a9637e50f5fa:T=1579846395:S=ALNI_MYnV7GPshoCKGIWFwBwvFZDgGbGlA; aliyun_webUmidToken=T376CCA0A67D8FE940F9D473F6A38FF1CE3FD344AA445C6A40515087C43; searchHistoryArray=%255B%2522%25E8%25B7%25A8%25E5%259F%259F%2522%252C%2522chmod%2522%252C%2522mod%2522%255D; announcement=%257B%2522isLogin%2522%253Atrue%252C%2522announcementUrl%2522%253A%2522https%253A%252F%252Fblog.csdn.net%252Fblogdevteam%252Farticle%252Fdetails%252F103603408%2522%252C%2522announcementCount%2522%253A0%252C%2522announcementExpire%2522%253A3600000%257D; Hm_lvt_6bcd52f51e9b3dce32bec4a3997715ac=1580117065,1580117611,1580117791,1580117842; dc_tos=q4rf0x; Hm_lpvt_6bcd52f51e9b3dce32bec4a3997715ac=1580118225
// weixin_43972437
// ---
// title: {{title}}
// date: {{date}}
// tags:
//   - {{categories}}
// categories:
//   - {{categories}}
// ---

// :::tip
// {{description}}
// :::

// <!-- more -->


function trimIt (data) {
  if (typeof(data) === 'string') {
    return data.trim()
  }
}
app.post('/csdn',function (req, res, next) {
  let params = {
    id: trimIt(req.body.id),
    month: trimIt(req.body.month),
    cookie: trimIt(req.body.cookie),
    path: trimIt(req.body.path),
    prefix: req.body.prefix
  }

  let csdn = new Csdn(params)
  csdn.start()
  res.status(200).send({
    code: 200,
    message: '成功'
  })
})

app.listen(3001, function (req, res) {
  console.log('博客爬取中，请稍后...')
})