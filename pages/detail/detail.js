import Utils from '../../utils/util.js';
import Api from '../../utils/api.js';
import Data from '../../utils/data.js';
  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null, //当前日报id
    news: {}, //日报详情
    extraInfo: null, 
    isCollect: false //是否被收藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = parseInt(options.id);
    Data.findOneById(id).then(d => {
      if (d) {
        this.setData({
          isCollect: true
        });
      }
    });

    this.setData({
      id: id
    });
  },

  /**
   * 加载日报数据
   */
  onReady: function () {
    loadData.call(this)
  },

  collectOrNot() {
    if (this.data.isCollect) {
      Data.findOneById(this.data.id).then(() => {
        this.setData({
          isCollect: false
        });
      }).catch(() => {
        wx.showToast({
          title: '操作失败',
          icon: 'none',
          duration: 20000
        });
      });
    } else {
      Data.save(Object.assign(
        {
          createTime: new Date().getTime()
        },
        this.data.news
      )).then(() => {
        this.setData({
          isCollect: true
        });
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        });
      }).catch((err) => {
        wx.showToast({
          title: '操作失败',
          icon: 'none',
          duration: 2000
        });
      });
    }
  },

  //图片预览
  previewImgEvent(e) {
    let src = e.currentTarget.dataset.src;
    if (src && src.length > 0) {
      wx.previewImage({
        urls: [src],
      })
    }
  },
  //重新加载数据
  reloadEvent() {
    loadData.call(this);
  }
  
})

/**
 * 加载页面相关数据
 */
function loadData() {
  let id = this.data.id;
  wx.showLoading({
    title: '加载中',
  });
  Api.getNewsDetail(id).then(data => {
    data['image'] = Utils.fiximgPrefix(data['image']);
    data.body = Utils.parseStory(data.body, false);
    this.setData({
      news: data
    });
    wx.hideLoading();
    wx.setNavigationBarTitle({
      title: data.title,
    });
  }).catch(err => {
    wx.hideLoading();
  });
}