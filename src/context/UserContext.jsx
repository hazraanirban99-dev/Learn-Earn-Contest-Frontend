import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Mock data mimicking a backend response
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Elena Vance',
      regId: 'DSC-2024-0089',
      email: 'e.vance@academy.edu',
      phone: '+1 (555) 234-8901',
      domain: 'UI/UX Design',
      registrationDate: '10/12/2023',
      registrationTime: '14:45 PM',
      avatar: 'https://ui-avatars.com/api/?name=Elena+Vance&background=random'
    },
    {
      id: 2,
      name: 'Marcus Thorne',
      regId: 'DSC-2024-1142',
      email: 'm.thorne@dev.io',
      phone: '+1 (555) 902-3344',
      domain: 'Development',
      registrationDate: '10/14/2023',
      registrationTime: '09:12 AM',
      avatar: 'https://ui-avatars.com/api/?name=Marcus+Thorne&background=random'
    },
    {
      id: 3,
      name: 'Sienna Brooks',
      regId: 'DSC-2024-0556',
      email: 's.brooks@growth.com',
      phone: '+1 (555) 771-0023',
      domain: 'Marketing',
      registrationDate: '10/15/2023',
      registrationTime: '11:30 AM',
      avatar: 'https://ui-avatars.com/api/?name=Sienna+Brooks&background=random'
    },
    {
      id: 4,
      name: 'Julian Kaine',
      regId: 'DSC-2024-0992',
      email: 'j.kaine@design.studio',
      phone: '+1 (555) 443-1221',
      domain: 'UI/UX Design',
      registrationDate: '10/16/2023',
      registrationTime: '16:20 PM',
      avatar: 'https://ui-avatars.com/api/?name=Julian+Kaine&background=random'
    }
  ]);

  const updateUser = (id, updatedData) => {
    setUsers(users.map(user => user.id === id ? { ...user, ...updatedData } : user));
  };

  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <UserContext.Provider value={{ users, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
