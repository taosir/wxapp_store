const App = getApp(); const Sharing = require('../../../utils/extend/sharing.js'); const wxParse = require("../../../wxParse/wxParse.js"); const Dialog = require('../../../components/dialog/dialog'); const util = require('../../../utils/util.js'); let goodsSpecArr = []; Page({ data: { indicatorDots: true, autoplay: true, interval: 3000, duration: 800, currentIndex: 1, floorstatus: false, showView: true, detail: {}, sharing_price: 0, goods_price: 0, line_price: 0, stock_num: 0, order_type: 20, goods_num: 1, goods_sku_id: 0, cart_total_num: 0, goodsMultiSpec: {}, countDownList: [], actEndTimeList: [], share: { show: false, cancelWithMask: true, cancelText: '关闭', actions: [{ name: '生成商品海报', className: 'action-class', loading: false }, { name: '发送给朋友', openType: 'share' }], showPopup: false, }, }, onLoad(e) { let _this = this, scene = App.getSceneData(e); _this.data.goods_id = e.goods_id ? e.goods_id : scene.gid; _this.getGoodsDetail(); _this.getSetting() }, getSetting() { let _this = this; Sharing.getSetting(setting => { _this.setData({ setting }) }) }, getGoodsDetail() { let _this = this; App._get('sharing.goods/detail', { goods_id: _this.data.goods_id }, result => { let data = _this._initGoodsDetailData(result.data); _this.setData(data); _this.countDown() }) }, _initGoodsDetailData(data) { let _this = this; let goodsDetail = data.detail; if (goodsDetail.content.length > 0) { wxParse.wxParse('content', 'html', goodsDetail.content, _this, 0) } data.goods_sku_id = goodsDetail.goods_sku.spec_sku_id; data.goods_price = goodsDetail.goods_sku.goods_price; data.sharing_price = goodsDetail.goods_sku.sharing_price; data.line_price = goodsDetail.goods_sku.line_price; data.stock_num = goodsDetail.goods_sku.stock_num; data.skuCoverImage = goodsDetail.goods_image; if (goodsDetail.spec_type == 20 && goodsDetail.goods_sku['image']) { data.skuCoverImage = goodsDetail.goods_sku['image']['file_path'] } if (goodsDetail.spec_type == 20) { data.goodsMultiSpec = _this.initManySpecData(goodsDetail.goods_multi_spec) } data['actEndTimeList'] = []; if (data.activeList.length > 0) { data.activeList.forEach(item => { data['actEndTimeList'].push(item.end_time.text) }) } return data }, initManySpecData(data) { goodsSpecArr = []; for (let i in data.spec_attr) { for (let j in data.spec_attr[i].spec_items) { if (j < 1) { data.spec_attr[i].spec_items[0].checked = true; goodsSpecArr[i] = data.spec_attr[i].spec_items[0].item_id } } } return data }, onSwitchSpec(e) { let _this = this, attrIdx = e.currentTarget.dataset.attrIdx, itemIdx = e.currentTarget.dataset.itemIdx, goodsMultiSpec = _this.data.goodsMultiSpec; App.saveFormId(e.detail.formId); for (let i in goodsMultiSpec.spec_attr) { for (let j in goodsMultiSpec.spec_attr[i].spec_items) { if (attrIdx == i) { goodsMultiSpec.spec_attr[i].spec_items[j].checked = false; if (itemIdx == j) { goodsMultiSpec.spec_attr[i].spec_items[itemIdx].checked = true; goodsSpecArr[i] = goodsMultiSpec.spec_attr[i].spec_items[itemIdx].item_id } } } } _this.setData({ goodsMultiSpec }); _this._updateSpecGoods() }, _updateSpecGoods() { let _this = this, specSkuId = goodsSpecArr.join('_'); let spec_list = this.data.goodsMultiSpec.spec_list, skuItem = spec_list.find((val) => { return val.spec_sku_id == specSkuId }); if (typeof skuItem === 'object') { _this.setData({ goods_sku_id: skuItem.spec_sku_id, goods_price: skuItem.form.goods_price, sharing_price: skuItem.form.sharing_price, line_price: skuItem.form.line_price, stock_num: skuItem.form.stock_num, skuCoverImage: skuItem.form.image_id > 0 ? skuItem.form.image_path : _this.data.detail.goods_image }) } }, setCurrent(e) { let _this = this; _this.setData({ currentIndex: e.detail.current + 1 }) }, onScrollTop(e) { let _this = this; App.saveFormId(e.detail.formId); _this.setData({ scrollTop: 0 }) }, scroll(e) { let _this = this; _this.setData({ floorstatus: e.detail.scrollTop > 200 }) }, onIncGoodsNumber(e) { let _this = this; App.saveFormId(e.detail.formId); _this.setData({ goods_num: ++_this.data.goods_num }) }, onDecGoodsNumber(e) { let _this = this; App.saveFormId(e.detail.formId); if (_this.data.goods_num > 1) { _this.setData({ goods_num: --_this.data.goods_num }) } }, onInputGoodsNum(e) { let _this = this, iptValue = e.detail.value; if (!util.isPositiveInteger(iptValue) && iptValue !== '') { iptValue = 1 } _this.setData({ goods_num: iptValue }) }, onCheckout() { let _this = this; if (!_this._onVerify()) { return false } wx.navigateTo({ url: '../checkout/index?' + util.urlEncode({ order_type: _this.data.order_type, goods_id: _this.data.goods_id, goods_num: _this.data.goods_num, goods_sku_id: _this.data.goods_sku_id, }), success() { _this.onToggleTrade() } }) }, _onVerify() { let _this = this; if (_this.data.goods_num === '') { App.showError('请输入购买数量'); return false } _this.setData({ goods_num: parseInt(_this.data.goods_num) }); if (_this.data.goods_num <= 0) { App.showError('购买数量不能为0'); return false } return true }, onPreviewImages(e) { let _this = this; let index = e.currentTarget.dataset.index, imageUrls = []; _this.data.detail.image.forEach(item => { imageUrls.push(item.file_path) }); wx.previewImage({ current: imageUrls[index], urls: imageUrls }) }, onPreviewSkuImage(e) { let _this = this; wx.previewImage({ current: _this.data.image_path, urls: [_this.data.image_path] }) }, onTargetToComment(e) { let _this = this; App.saveFormId(e.detail.formId); wx.navigateTo({ url: './comment/comment?goods_id=' + _this.data.goods_id }) }, onShareAppMessage() { let _this = this; let params = App.getShareUrlParams({ 'goods_id': _this.data.goods_id }); return { title: _this.data.detail.goods_name, path: "/pages/sharing/goods/index?" + params } }, onClickShare(e) { let _this = this; App.saveFormId(e.detail.formId); _this.setData({ 'share.show': true }) }, onCloseShare() { let _this = this; _this.setData({ 'share.show': false }) }, onClickShareItem(e) { let _this = this; if (e.detail.index === 0) { _this._showPoster() } _this.onCloseShare() }, onTogglePopup() { let _this = this; _this.setData({ 'share.showPopup': !_this.data.share.showPopup }) }, _showPoster() { let _this = this; wx.showLoading({ title: '加载中', }); App._get('sharing.goods/poster', { goods_id: _this.data.goods_id }, result => { _this.setData(result.data, () => { _this.onTogglePopup() }) }, null, () => { wx.hideLoading() }) }, onSavePoster(e) { let _this = this; App.saveFormId(e.detail.formId); wx.showLoading({ title: '加载中', }); wx.downloadFile({ url: _this.data.qrcode, success(res) { wx.hideLoading(); wx.saveImageToPhotosAlbum({ filePath: res.tempFilePath, success(data) { wx.showToast({ title: '保存成功', icon: 'success', duration: 2000 }); _this.onTogglePopup() }, fail(err) { if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') { wx.showToast({ title: "请允许访问相册后重试", icon: "none", duration: 1000 }); setTimeout(() => { wx.openSetting() }, 1000) } }, complete(res) { } }) } }) }, onToggleTrade(e) { let _this = this; if (typeof e === 'object') { e.detail.hasOwnProperty('formId') && App.saveFormId(e.detail.formId) } _this.setData({ showBottomPopup: !_this.data.showBottomPopup }) }, onToggleRules(e) { App.saveFormId(e.detail.formId); let _this = this; Dialog({ title: '拼团规则', message: _this.data.setting.basic.rule_detail, selector: '#zan-base-dialog', buttons: [{ text: '关闭', color: 'red', type: 'cash' }] }) }, onNavigationHome(e) { App.saveFormId(e.detail.formId); wx.switchTab({ url: '../../index/index', }) }, onTriggerOrder(e) { let _this = this; _this.setData({ order_type: e.currentTarget.dataset.type }, () => { _this.onToggleTrade() }) }, timeFormat(param) { return param < 10 ? '0' + param : param }, countDown() { let newTime = new Date().getTime(); let endTimeList = this.data.actEndTimeList; let countDownArr = []; endTimeList.forEach(o => { let endTime = new Date(util.format_date(o)).getTime(); let obj = null; if (endTime - newTime > 0) { let time = (endTime - newTime) / 1000; let day = parseInt(time / (60 * 60 * 24)); let hou = parseInt(time % (60 * 60 * 24) / 3600); let min = parseInt(time % (60 * 60 * 24) % 3600 / 60); let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60); obj = { day: day, hou: this.timeFormat(hou), min: this.timeFormat(min), sec: this.timeFormat(sec) } } else { obj = { day: '00', hou: '00', min: '00', sec: '00' } } countDownArr.push(obj) }); this.setData({ countDownList: countDownArr }); setTimeout(this.countDown, 1000) }, onTargetActive(e) { wx.navigateTo({ url: '../active/index?active_id=' + e.currentTarget.dataset.id, }) }, })