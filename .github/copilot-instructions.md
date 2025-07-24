# Copilot Instructions for livraria-callidus

## Project Overview
- This is a React + Vite monorepo for a bookstore web app. The main UI is in `frontend/`.
- The frontend uses React Context for cart state (`src/components/Carrinho.jsx`) and React Router for navigation.
- Book data is loaded from a static JSON file: `frontend/public/api/todosOsLivros.json`.

## Key Architectural Patterns
- **Context Providers:** Use `CartProvider` (from `Carrinho.jsx`) to wrap the app for cart state. Access cart actions via the `useCart` hook.
- **Toasts:** Use `react-toastify` for notifications. Only one `<ToastContainer />` should be rendered, typically in `App.jsx`.
- **Routing:** All routes are defined in `App.jsx` using `react-router-dom`. Route handlers pass `livros` as props to page components.
- **Component Organization:**
  - Page components: `src/components/{Home,Frontend,Programacao,Design,Catalogo,Pagamento,NotFound}.jsx`
  - UI structure: `Topo`, `Rodape`, `Navegacao`, `Logo`
  - Book display: `Livro.jsx`

## Developer Workflows
- **Start Dev Server:**
  - `cd frontend && npm install && npm run dev`
- **Build for Production:**
  - `cd frontend && npm run build`
- **Lint:**
  - `cd frontend && npm run lint`
- **No backend server:** All data is static JSON; no API server is present.

## Project-Specific Conventions
- **Cart logic:** Only add unique books to cart; show toast if duplicate.
- **Book data:** Each book has an `id`, `nome`, and `slug` (used for routing).
- **Error handling:** Errors loading books are shown in the main area as a message.
- **Styling:** CSS is in `App.css` and component-specific files.
- **Portuguese language:** Most UI and code comments are in Portuguese.

## Integration Points
- **External dependencies:**
  - `react-toastify` for notifications
  - `axios` for HTTP requests (even for local JSON)
  - `react-router-dom` for routing
- **Static assets:** Book images in `frontend/public/imagens/`

## Examples
- To add a new page, create a component in `src/components/`, then add a `<Route>` in `App.jsx`.
- To use cart actions in a component:
  ```jsx
  import { useCart } from './Carrinho';
  const { adicionarAoCarrinho } = useCart();
  ```

---

If you update major patterns (e.g., add a backend, change routing), update this file.
