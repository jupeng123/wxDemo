//index.js
//获取应用实例
import Utils from '../../utils/util.js';
import Api from '../../utils/api.js';
const weekdayStr = ['日', '一', '二', '三', '四', '五', '六'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData: {}, //列表数据
    siderData: {}, //轮播图数据
    currentDate: null,
    isDrawerShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '加载中',
    });
    Api.getNewsLatest().then(data => {
      data = Utils.correctData(data)
      let tData = handleStories(data.stories);
      tData.unshift({
        isLabel: true,
        title: '今日热文'
      });
      this.setData({
        siderData: data.top_stories,
        pageData: tData,
        currentDate: new Date()
      })
      wx.hideLoading()
    }).catch(error => {
      wx.hideLoading()
      wx.showToast({
        title: '数据加载异常，下拉重刷新',
        icon: 'none',
        duration: 5000
      })
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.onReady();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  // 列表加载更多
  loadingMoreEvent(e) {
    wx.showLoading({
      title: '加载中',
    });
    let date = new Date(Date.parse(this.data.currentDate) - 1000 * 60 * 60 * 24);
    let pageData = [];
    let y = date.getFullYear();
    let m = (date.getMonth() + 1);
    let d = date.getDate();
    m = m > 9 ? m : '0' + m;
    d = d > 9 ? d : '0' + d;
    let dateStr = [y, m, d].join('');
    Api.getBeforeNews(dateStr).then(data => {
      data = Utils.correctData(data);
      pageData = this.data.pageData;
      pageData.push({
        isLabel: true,
        title: ([y, m, d].join('.') + '  星期' + weekdayStr[date.getDay()])
      });
      pageData = pageData.concat(handleStories(data.stories));
      this.setData({
        currentDate: date,
        pageData: pageData
      });
      wx.hideLoading()
    }).catch(error => {
      wx.hideLoading()
      wx.showToast({
        title: '数据加载失败',
        icon: 'none',
        duration: 2000
      })
    })
  },

  toDetailPage(e) {
    const id = e.detail.data.id;
    console.log(id);
  },

  // 浮动球点击 侧栏展开
  ballClickEvent() {
    slideSwitch.call(this, !this.data.isDrawerShow)
  }

})

function handleStories(stories) {
  if (!stories) {
    return stories;
  }
  for (let i = 0; i < stories.length; i++) {
    if (stories[i].images) {
      stories[i].images = stories[i].images[0];
    }
  }
  return stories
}

// 侧栏 drawer 展开收缩
function slideSwitch(isShow) {
  this.setData({
    isDrawerShow: isShow
  });
  this.selectComponent('#drawer').drawerSwitch(isShow);
}