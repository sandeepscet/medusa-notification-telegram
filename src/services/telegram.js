import { humanizeAmount, zeroDecimalCurrencies } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
const TelegramBot = require('node-telegram-bot-api');


class TelegramService extends BaseService {
  /**
   * @param {Object} options - options defined in `medusa-config.js`
   */
  constructor({ orderService, totalsService, regionService }, options) {
    super()

    this.orderService_ = orderService

    this.totalsService_ = totalsService

    this.regionService_ = regionService

    this.options_ = options

    const TOKEN = this.options_.token;
    this.bot = new TelegramBot(TOKEN);
  }

  async orderNotification(orderId, orderEvent) {

    const order = await this.orderService_.retrieve(orderId, {
      select: [
        "shipping_total",
        "discount_total",
        "tax_total",
        "refunded_total",
        "gift_card_total",
        "subtotal",
        "total",
      ],
      relations: [
        "customer",
        "billing_address",
        "shipping_address",
        "discounts",
        "discounts.rule",
        "shipping_methods",
        "payments",
        "fulfillments",
        "returns",
        "gift_cards",
        "gift_card_transactions",
        "swaps",
        "swaps.return_order",
        "swaps.payment",
        "swaps.shipping_methods",
        "swaps.shipping_address",
        "swaps.additional_items",
        "swaps.fulfillments",
      ],
    })

    const { total } = order

    const currencyCode = order.currency_code.toUpperCase()
    const getDisplayAmount = (amount) => {
      const humanAmount = humanizeAmount(amount, currencyCode)
      if (zeroDecimalCurrencies.includes(currencyCode.toLowerCase())) {
        return humanAmount
      }
      return humanAmount.toFixed(2)
    }

    const getOrderMsg = (orderEvent) => {
      let msg = orderEvent;

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
    }

    let msgText = `Order <a href='${this.options_.admin_orders_url}/${order.id}'>#${order.display_id}</a> ${getOrderMsg(orderEvent)}`;

    if (orderEvent === 'order.placed' || orderEvent === 'order.canceled' || orderEvent === 'order.updated') {
      //TODO  Extra details around event
      msgText += ` with Total :  ${currencyCode} ${getDisplayAmount(total)}`;
    }

    try {
      await this.bot.sendMessage(this.options_.group_chat_id, msgText, { parse_mode: 'HTML' });
    } catch (error) {
      console.error("Failed to send Telegram message");
      console.error(error);
    }

  }
}

export default TelegramService