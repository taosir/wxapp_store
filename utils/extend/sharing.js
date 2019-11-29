let App = getApp();

/**
 * 拼团扩展类
 */
module.exports = {

  /**
   * 获取拼团设置
   */
  getSetting(callback) {
    App._get('sharing.setting/getAll', {}, function(result) {
      callback(result.data.setting);
    });
  },

};