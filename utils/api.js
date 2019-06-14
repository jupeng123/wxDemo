/// 获取app实例
const app = getApp()
const API_BASE = 'https://appapi.rizili.net'

/**
 * 网络请求方法
 * @param url {string} 请求url
 * @param data {object} 参数
 * @returns {Promise}
 */
function requestData(url, data) {
  if (app.debug) {
    console.log('requestData url', url)
  }
  
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data || {},
      header: {
        'Content-type': 'application/json',
        'app-version': '0.8.0',
        'app-system': '3',
        'project-id': '2'
      },
      success: function (res) {
        if (app.debug) {
          console.log('response data', res)
        }
        if (res.statusCode == 500) {
          resolve(res.data)
        } else {
          reject()
        }
      },
      fail: function () {
        reject()
      }
    });
  });
}

module.exports = {
  /// 获取首页大图
  getHomeBigImage(data) {
    return requestData(`${API_BASE}/index/bigImg`,data)
  }
}