import React, { useState, useEffect } from 'react';
import '../styles/adminside.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import supabase from '../supabase';

function Sidebar() {
  const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
    const storedState = localStorage.getItem('sidebarClosed');
    return storedState ? JSON.parse(storedState) : false;
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(localStorage.getItem('alertMessage') || '');
  const location = useLocation();
  const { user, signOut, isAdmin, setUser } = useAuth();

  const currentPath = location.pathname;

  useEffect(() => {
    localStorage.setItem('sidebarClosed', JSON.stringify(isSidebarClosed));
  }, [isSidebarClosed]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      subscribeToNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('notifications')
      .select('message, read')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (notificationsError) {
      console.error('Error fetching notifications:', notificationsError);
    } else {
      setNotifications(notificationsData);
      const unread = notificationsData.filter(notification => !notification.read).length;
      setUnreadCount(unread);
    }
  };

  const subscribeToNotifications = () => {
    const subscriptions = [
      { table: 'accounts', channel: 'public:accounts' },
      { table: 'treepins', channel: 'public:treepins' },
      { table: 'feedbacks', channel: 'public:feedbacks' },
      { table: 'blogpostss', channel: 'public:blogpostss' }
    ];

    subscriptions.forEach(subscription => {
      const { table, channel } = subscription;
      supabase
        .channel(channel)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table }, payload => {
          handleNewNotification(table, payload);
        })
        .subscribe();
    });

    return () => {
      subscriptions.forEach(subscription => {
        const { channel } = subscription;
        supabase.removeChannel(channel);
      });
    };
  };

  const handleNewNotification = async (table, payload) => {
    const messageMap = {
      accounts: 'A new account has been added. Verify it.',
      treepins: 'A new treepin has been added.',
      feedbacks: 'New feedback has been received.',
      blogpostss: 'A new blogpost has been published.'
    };

    const message = messageMap[table];

    if (!message) return;

    if (isAdmin) {
      setAlertMessage(prevMessage => {
        const updatedMessage = prevMessage ? `${prevMessage}<br>${message}` : message;
        localStorage.setItem('alertMessage', updatedMessage);
        return updatedMessage;
      });
    }

    try {
      await supabase.from('notifications').insert([
        {
          user_id: user.id,
          message,
          read: false,
          created_at: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error inserting notification:', error);
    } finally {
      fetchNotifications();
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarClosed(!isSidebarClosed);
  };

  const handleLogout = () => {
    signOut();
  };

  const markAsRead = async () => {
    try {
      await supabase
       .from('notifications')
       .update({ read: true })
       .eq('user_id', user.id);
      setUnreadCount(0);
      fetchNotifications();
      setAlertMessage(''); // Clear the alert message
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const toggleNotifDropdown = () => {
    setIsNotifDropdownOpen(!isNotifDropdownOpen);
  };

  const removeAlert = async (indexToRemove) => {
    try {
      const notification = notifications[indexToRemove];
      if (notification) {
        // Update UI State
        setNotifications(prevNotifications => {
          const updatedNotifications = [...prevNotifications];
          updatedNotifications.splice(indexToRemove, 1);
          return updatedNotifications;
        });
  
        // Update Unread Count
        const updatedUnreadCount = unreadCount - (notification.read ? 0 : 1);
        setUnreadCount(updatedUnreadCount);
  
        // Update Alert Message if needed
        if (!notification.read) {
          setAlertMessage(prevMessage => {
            const messages = prevMessage.split('<br>');
            messages.splice(indexToRemove, 1);
            const newMessage = messages.join('<br>');
            localStorage.setItem('alertMessage', newMessage);
            return newMessage;
          });
        }
  
        // Trigger Deletion in Database
        const { data, error } = await supabase
          .from('notifications')
          .delete()
          .eq('id', notification.id);
  
        if (error) {
          throw new Error('Error deleting notification from database');
        }
      } else {
        console.log('Notification does not exist.');
      }
    } catch (error) {
      console.error('Error removing alert:', error);
    }
  };
  
  
  
  const hasUnreadNotifications = unreadCount > 0 || alertMessage;

  function MenuItem({ to, label, iconClass }) {
    const isActive = currentPath === to;

    return (
      <li className={isActive? 'active' : ''} key={to}>
        <Link to={to}>
          <i className={`bx ${iconClass}`}></i>
          {label}
        </Link>
      </li>
    );
  }

  return (
    <>
      <div className={`sidebar ${isSidebarClosed? 'open' : ''}`}>
        <a href="/" className="logos">
          <img src="/img/arbologo.png" alt="Logo" className="icon" style={{ width: '60px', padding: '10px' }} />
          <div className="logo_name">ARBOREATRIX</div>
        </a>

        <ul className="side-menu">
          <MenuItem to="/Home" label="Home" iconClass="bxs-dashboard" />
          <MenuItem to="/Tree" label="Trees" iconClass="bx bxs-tree" />
          <MenuItem to="/AdminPinStatus" label="Status" iconClass="bx bxs-objects-vertical-bottom" />
          <MenuItem to="/AdminMap" label="Map" iconClass="bx bx-map-alt" />
          <MenuItem to="/AdminUserList" label="Users" iconClass="bx bx-user-circle" />
          <MenuItem to="/AdminReport" label="Reports" iconClass="bx bxs-report" />
          <MenuItem to="/AdminFeedback" label="Feedback" iconClass="bx bxs-comment" />
          <MenuItem to="/AdminFaqs" label="Faqs" iconClass="bx bxs-bulb" />
        </ul>
      </div>
      <div className="content" id="sidecontent">
        <nav>
          <form action="#">
            <div className="form-input">
              <i className={isSidebarClosed? 'bx bx-menu' : 'bx bx-x'} onClick={handleSidebarToggle} style={{ cursor: 'pointer' }}></i>
            </div>
          </form>
          <div className="notif">
          <i className="bx bx-bell" onClick={toggleNotifDropdown}></i>
          {hasUnreadNotifications && <span className={`dot ${unreadCount === 0 && 'hide-dot'}`}></span>}
            {isNotifDropdownOpen && (
              <div className="notif-dropdown show">
                {(notifications.length > 0 || alertMessage)? (
                  <ul>
                    {notifications.map((notif, index) => (
                      <li key={index} className={notif.read? '' : 'unread'} style={{ border: '1px solid #ccc', padding: '5px', margin: '5px', backgroundColor: '#4CAF50'}}>
                        {notif.message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No new notifications</p>
                )}
                {notifications.length > 0 && (
                  <button onClick={markAsRead}>Mark all as read</button>
                )}
              </div>
            )}
          </div>
          <a href="#" className="profile">
            <Link to="/" onClick={handleLogout} className="logout">
              <i className="bx bx-log-out-circle"></i>
            </Link>
          </a>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;