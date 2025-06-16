# Contacts Book App

This is a React-based Contacts Book application with authentication and private user data management. It allows users to manage a list of contacts with support for editing, copying, sorting by country, and calling directly from the browser.

## 🚀 Features

- User registration and login using JWT tokens
- Private contact collection per user
- Add, edit, delete contacts
- Group contacts by country (auto-detected from phone number)
- Copy phone number to clipboard
- Call via `tel:` links
- Filtering contacts by name or number
- Animated UI using `framer-motion`
- Toast notifications via `react-hot-toast`
- Form validation using Formik + Yup
- Responsive and stylish UI with CSS Modules
- Persisted authentication state with Redux Persist

> **Note:** Each contact card supports only name and number due to backend limitations.

## 🛠 Tech Stack

- React + Vite
- Redux Toolkit + Redux Persist
- React Router v7
- Formik, Yup
- Axios
- Framer Motion, React Icons
- CSS Modules
- Hosted on Vercel

## 📁 Project Structure

```
├── src
│   ├── assets
│   ├── components
│   │   ├── App, AppBar, AuthNav, ...
│   ├── pages
│   │   ├── ContactsPage, HomePage, ...
│   ├── redux
│   │   ├── auth, contacts, filters, store.js
│   ├── styles
│   ├── utils
│   └── index.css, main.jsx
├── public
├── package.json
├── vite.config.js
└── README.md
```

## 📦 Available Scripts

```
npm run dev       # Run dev server
npm run build     # Build project
npm run preview   # Preview build
npm run lint      # Lint source code
```

## 📚 Useful Links

- [Backend API Documentation](https://connections-api.goit.global/docs/)
  - [Live Demo on Vercel](https://goit-react-hw-08-ashen-seven.vercel.app/)
- [Repository on GitHub](https://github.com/AndriiDorohov/goit-react-hw-08)

---

