import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/sections.css';

const root = document.getElementById('root');
const app = (
    <StrictMode>
        <App />
    </StrictMode>
);

// Built pages arrive prerendered (scripts/prerender.mjs); the dev server sends an empty root.
if (root.hasChildNodes()) {
    hydrateRoot(root, app);
} else {
    createRoot(root).render(app);
}
