class OrderSubscriber {
    constructor({ telegramService, eventBusService }, options) {
      this.telegramService_ = telegramService;
      this.eventBus_ = eventBusService;
      this.options_ = options;

      for (const orderEvent of this.options_.events_notifications){
        this.eventBus_.subscribe(orderEvent, async ({ id  }) => {
          await this.telegramService_.orderNotification(id, orderEvent );
        });
      }
    
    }
  }
  
  export default OrderSubscriber