import { toJS } from "mobx";
import userStore from "../store/userStore";
import NotificationItem from "./NotificationItem";
import "./styles/notificationList.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotificationList = () => {
   const nav = useNavigate();
   const [notifications, setNotifications] = useState(userStore?.user?.notifications);
   const [showUndread, setShowUnread] = useState(false);

   useEffect(() => {
        const handleNot = async () => {
            await userStore.checkAuth();
            setNotifications(userStore?.user?.notifications);
        }    
        
        handleNot();
   }, []);

   const updateNotification = (id) => {
    if(!id || id === undefined) return;
      userStore.updateNotification(id);
   }

   const handleClick = (notification) => {
        const id = notification.post_id;
        if (!id || id === undefined) return;
        updateNotification(notification.notification_id);
        nav("/postInfo/"+id);
   };

  return (
    <div className="notification_list">
      <div className="buttons">
        <button className="showUnread"
        onClick={() => setShowUnread(!showUndread)}>
          {showUndread ? "Скрыть" : "Показать"} прочитанные
          </button>
      </div>
      {notifications?.map((notification, i) => {
       return !notification?.is_read || showUndread ? <NotificationItem key={i} onClick={
        () => handleClick({
          post_id: notification?.post_id,
          notification_id: notification?.id
        })} 
        message={notification.message} 
       isChecked={!notification.is_read}/>
       : null;
      } 
      ) || "Нет уведомлений"}
    </div>
  );
};

export default NotificationList;