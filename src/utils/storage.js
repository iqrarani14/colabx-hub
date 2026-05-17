// ===== LOCAL STORAGE HELPER =====

// USER
export const saveUser = (user) => localStorage.setItem('colabx_user', JSON.stringify(user));
export const getUser = () => JSON.parse(localStorage.getItem('colabx_user'));
export const removeUser = () => localStorage.removeItem('colabx_user');
export const isLoggedIn = () => !!getUser();

// USERS LIST (for signup)
export const getUsers = () => JSON.parse(localStorage.getItem('colabx_users')) || [];
export const saveUsers = (users) => localStorage.setItem('colabx_users', JSON.stringify(users));
export const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

// TASKS
export const getTasks = () => JSON.parse(localStorage.getItem('colabx_tasks')) || [];
export const saveTasks = (tasks) => localStorage.setItem('colabx_tasks', JSON.stringify(tasks));

// ROOMS
export const getRooms = () => JSON.parse(localStorage.getItem('colabx_rooms')) || [];
export const saveRooms = (rooms) => localStorage.setItem('colabx_rooms', JSON.stringify(rooms));

// PROJECTS
export const getProjects = () => JSON.parse(localStorage.getItem('colabx_projects')) || [];
export const saveProjects = (projects) => localStorage.setItem('colabx_projects', JSON.stringify(projects));

// MESSAGES
export const getMessages = () => JSON.parse(localStorage.getItem('colabx_messages')) || [];
export const saveMessages = (msgs) => localStorage.setItem('colabx_messages', JSON.stringify(msgs));

// FILES
export const getFiles = () => JSON.parse(localStorage.getItem('colabx_files')) || [];
export const saveFiles = (files) => localStorage.setItem('colabx_files', JSON.stringify(files));

// NOTIFICATIONS
export const getNotifications = () => JSON.parse(localStorage.getItem('colabx_notifs')) || [];
export const saveNotifications = (notifs) => localStorage.setItem('colabx_notifs', JSON.stringify(notifs));