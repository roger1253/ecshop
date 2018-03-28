/**
 * APIHome API 模块
 * @type {Object}
 */
const APIHome = require('./api.home.js')
const APIBanner = require('./api.banner.js')
const APICategory = require('./api.category.js')
const APIProduct = require('./api.product.js')
const APICart = require('./api.cart.js')
const APIAuthBase = require('./api.auth.base.js')
const APIAuthSocial = require('./api.auth.social.js')
const APIUser = require('./api.user.js')
const APIConsignee = require('./api.consignee.js')
const APIRegion = require('./api.region.js')
const APICashgiftList = require('./api.cashgift.list.js')
const APIOrderList = require('./api.order.list.js')
const APIOrder = require('./api.order.js')
const APIShipping = require('./api.shipping.js')
const APICashgiftAvailable = require('./api.cashgift.available.js')
const APIProfileUpdate = require('./api.profile.update')
const APIProfileGet = require('./api.profile.get')
const APIArticleList = require('./api.article.list')
const APIPayment = require('./api.payment.js')
const APISearchProductList = require('/api.search.product.js')
const APIInvoiceTypeList = require('/api.invoice.type.js')
const APIInvoiceContentList = require('/api.invoice.content.js')
const APIConfig = require('/api.config.js')

module.exports = { APIHome: APIHome,
				 APIBanner:APIBanner,
				 APICategory:APICategory,
				 APIProduct:APIProduct,
				 APICart:APICart,
				 APIAuthBase:APIAuthBase,
				 APIConsignee:APIConsignee,
				 APICashgiftList:APICashgiftList,
				 APICashgiftAvailable:APICashgiftAvailable,
				 APIRegion:APIRegion,
				 APIAuthSocial:APIAuthSocial,  
				 APICashgiftList:APICashgiftList,
				 APIOrderList:APIOrderList,
				 APIOrder:APIOrder,
				 APIShipping:APIShipping,
				 APIAuthSocial:APIAuthSocial,
				 APIProfileUpdate:APIProfileUpdate,
				 APIProfileGet:APIProfileGet,
				 APIArticleList:APIArticleList,
				 APIPayment:APIPayment,
				 APIUser:APIUser,
				 APISearchProductList:APISearchProductList,
				 APIInvoiceTypeList:APIInvoiceTypeList,
				 APIInvoiceContentList:APIInvoiceContentList,
				 APIConfig:APIConfig};
