"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _medusaCoreUtils = require("medusa-core-utils");
var _medusaInterfaces = require("medusa-interfaces");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var TelegramBot = require('node-telegram-bot-api');
var TelegramService = /*#__PURE__*/function (_BaseService) {
  (0, _inherits2["default"])(TelegramService, _BaseService);
  var _super = _createSuper(TelegramService);
  /**
   * @param {Object} options - options defined in `medusa-config.js`
   */
  function TelegramService(_ref, options) {
    var _this;
    var orderService = _ref.orderService,
      totalsService = _ref.totalsService,
      regionService = _ref.regionService;
    (0, _classCallCheck2["default"])(this, TelegramService);
    _this = _super.call(this);
    _this.orderService_ = orderService;
    _this.totalsService_ = totalsService;
    _this.regionService_ = regionService;
    _this.options_ = options;
    var TOKEN = _this.options_.token;
    _this.bot = new TelegramBot(TOKEN);
    return _this;
  }
  (0, _createClass2["default"])(TelegramService, [{
    key: "orderNotification",
    value: function () {
      var _orderNotification = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(orderId, orderEvent) {
        var order, total, currencyCode, getDisplayAmount, getOrderMsg, msgText;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.orderService_.retrieve(orderId, {
                  select: ["shipping_total", "discount_total", "tax_total", "refunded_total", "gift_card_total", "subtotal", "total"],
                  relations: ["customer", "billing_address", "shipping_address", "discounts", "discounts.rule", "shipping_methods", "payments", "fulfillments", "returns", "gift_cards", "gift_card_transactions", "swaps", "swaps.return_order", "swaps.payment", "swaps.shipping_methods", "swaps.shipping_address", "swaps.additional_items", "swaps.fulfillments"]
                });
              case 2:
                order = _context.sent;
                total = order.total;
                currencyCode = order.currency_code.toUpperCase();
                getDisplayAmount = function getDisplayAmount(amount) {
                  var humanAmount = (0, _medusaCoreUtils.humanizeAmount)(amount, currencyCode);
                  if (_medusaCoreUtils.zeroDecimalCurrencies.includes(currencyCode.toLowerCase())) {
                    return humanAmount;
                  }
                  return humanAmount.toFixed(2);
                };
                getOrderMsg = function getOrderMsg(orderEvent) {
                  var msg = orderEvent;
                  switch (orderEvent) {
                    case "order.placed":
                      msg = "Placed"; //TODO get translated
                      break;
                    case "order.return_requested":
                      msg = "Return Requested";
                      break;
                    case "order.fulfillment_created":
                      msg = "Fullfillment Created";
                      break;
                    case "order.shipment_created":
                      msg = "Shipment Created";
                      break;
                    case "order.payment_captured":
                      msg = "Payment Captured";
                      break;
                    case "order.canceled":
                      msg = "Canceled";
                      break;
                    case "order.updated":
                      msg = "Updated";
                      break;
                    case "order.swap_created":
                      msg = "Swap Created";
                      break;
                    case "order.refund_failed":
                      msg = "Refund Failed";
                      break;
                    case "order.return_action_required":
                      msg = "REturn Action Required";
                      break;
                    case "order.refund_created":
                      msg = "Refund Created";
                      break;
                    case "order.items_ returned":
                      msg = "Items Returned";
                      break;
                    case "order.fulfillment_canceled":
                      msg = "Fullfillment Cancelled";
                      break;
                  }
                  return msg;
                };
                msgText = "Order <a href='".concat(this.options_.admin_orders_url, "/").concat(order.id, "'>#").concat(order.display_id, "</a> ").concat(getOrderMsg(orderEvent));
                if (orderEvent === 'order.placed' || orderEvent === 'order.canceled' || orderEvent === 'order.updated') {
                  //TODO  Extra details around event
                  msgText += " with Total :  ".concat(currencyCode, " ").concat(getDisplayAmount(total));
                }
                _context.prev = 9;
                _context.next = 12;
                return this.bot.sendMessage(this.options_.group_chat_id, msgText, {
                  parse_mode: 'HTML'
                });
              case 12:
                _context.next = 18;
                break;
              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](9);
                console.error("Failed to send Telegram message");
                console.error(_context.t0);
              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[9, 14]]);
      }));
      function orderNotification(_x, _x2) {
        return _orderNotification.apply(this, arguments);
      }
      return orderNotification;
    }()
  }]);
  return TelegramService;
}(_medusaInterfaces.BaseService);
var _default = TelegramService;
exports["default"] = _default;