import Branch from "./branch.model";
import PaymentGateway from "./payment-gateway.model";
import NotificationAlert from "./notification-alert.model";
import Notification from "./notification.model";
export { Branch, PaymentGateway, NotificationAlert, Notification, };
declare const models: {
    Branch: typeof Branch;
    PaymentGateway: typeof PaymentGateway;
    NotificationAlert: typeof NotificationAlert;
    Notification: typeof Notification;
};
export default models;
