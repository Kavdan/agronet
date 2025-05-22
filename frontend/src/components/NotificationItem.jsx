import React from "react";
import "./styles/ notificationItem.css";

const NotificationItem = ({ onClick,  message, isChecked, }) => {
  return (
    <div onClick={onClick} className="notification-container">
      <span className="notification-message">{message}</span>
      {isChecked && <span className="notification-badge"></span>}
    </div>
  );
};

export default NotificationItem;
