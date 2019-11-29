// 工具类
import util from './util.js';

/**
 * 倒计时类
 */
module.exports = {

  onSetTimeList(page, dataIndex) {
    let _this = this;
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime(),
      newData = [];
    // 对结束时间进行处理渲染到页面
    page.data[dataIndex].forEach(item => {
      let endTime = new Date(util.format_date(item.date)).getTime();
      let dynamic = {
        // day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      };
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        let diffTime = (endTime - newTime) / 1000;

        // 获取时、分、秒
        // day = parseInt(diffTime / 86400),
        let hou = parseInt(diffTime / 3600),
          min = parseInt(diffTime % 3600 / 60),
          sec = parseInt(diffTime % 3600 % 60);
        dynamic = {
          hou: _this.timeFormat(hou),
          min: _this.timeFormat(min),
          sec: _this.timeFormat(sec)
        }
      }
      newData.push({
        date: item.date,
        dynamic
      });
    })

    // 渲染，然后每隔一秒执行一次倒计时函数
    page.setData({
      [`${dataIndex}`]: newData
    });

    // 重复执行
    setTimeout(() => {
      this.onSetTimeList(page, dataIndex)
    }, 1000);

  },

  /**
   * 小于10的格式化函数
   */
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },


};