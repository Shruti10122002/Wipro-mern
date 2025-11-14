// Fetch API demo with Cancel support + robust error handling + Revealing Module Pattern

// ---------- Error types ----------
class HttpError extends Error {
  constructor(status, statusText, url, bodyText = "") {
    super(`${status} ${statusText}`.trim());
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.bodyText = bodyText;
  }
}
class TimeoutError extends Error {
  constructor(message, url) {
    super(message);
    this.name = "TimeoutError";
    this.url = url;
  }
}
class NetworkError extends Error {
  constructor(message, url) {
    super(message);
    this.name = "NetworkError";
    this.url = url;
  }
}
class ParseError extends Error {
  constructor(message, url) {
    super(message);
    this.name = "ParseError";
    this.url = url;
  }
}
class DataError extends Error {
  constructor(message, url, data) {
    super(message);
    this.name = "DataError";
    this.url = url;
    this.data = data;
  }
}
class CanceledError extends Error {
  constructor(message = "Request canceled by user", url) {
    super(message);
    this.name = "CanceledError";
    this.url = url;
  }
}

// ---------- Utils ----------
const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

const formatError = (err) => {
  if (err instanceof TimeoutError) return "Request timed out. Please try again.";
  if (err instanceof NetworkError) return "Network error. Check your internet connection.";
  if (err instanceof HttpError) return `Server error ${err.status}: ${err.message}`;
  if (err instanceof ParseError) return "Invalid JSON received from server.";
  if (err instanceof DataError) return "The server returned data in an unexpected format.";
  if (err instanceof CanceledError) return "Request canceled by user.";
  return "Something went wrong. Please try again.";
};

// Simple schema validators
const isValidPost = (p) => p && typeof p.id === "number" && typeof p.title === "string" && typeof p.body === "string";
const isValidTodo = (t) => t && typeof t.id === "number" && typeof t.title === "string" && typeof t.completed === "boolean";

// ---------- Api Module (Revealing Module Pattern) ----------
const Api = (() => {
  const BASE = "https://jsonplaceholder.typicode.com";
  const DEFAULT_TIMEOUT = 8000;

  async function fetchJSON(url, { timeout = DEFAULT_TIMEOUT, validate, signal: externalSignal } = {}) {
    const controller = new AbortController();
    let timedOut = false;

    // Link external signal to our controller so Cancel button can abort
    const onExternalAbort = () => controller.abort();
    if (externalSignal) {
      if (externalSignal.aborted) controller.abort();
      else externalSignal.addEventListener("abort", onExternalAbort, { once: true });
    }

    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeout);

    let res;
    try {
      res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
    } catch (err) {
      if (err?.name === "AbortError") {
        if (timedOut) throw new TimeoutError(`Request timed out after ${timeout}ms`, url);
        throw new CanceledError("Request canceled by user", url);
      }
      throw new NetworkError(err.message || "Network error", url);
    } finally {
      clearTimeout(timer);
      if (externalSignal) externalSignal.removeEventListener("abort", onExternalAbort);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new HttpError(res.status, res.statusText, url, text);
    }

    let data;
    try {
      data = await res.json();
    } catch {
      throw new ParseError("Failed to parse JSON", url);
    }

    if (validate && !validate(data)) {
      throw new DataError("Unexpected data shape from server", url, data);
    }

    return data;
  }

  function getPosts(limit = 10, { signal } = {}) {
    return fetchJSON(`${BASE}/posts?_limit=${limit}`, {
      signal,
      validate: (data) => Array.isArray(data) && data.every(isValidPost),
    });
  }

  function getTodos(limit = 12, { signal } = {}) {
    return fetchJSON(`${BASE}/todos?_limit=${limit}`, {
      signal,
      validate: (data) => Array.isArray(data) && data.every(isValidTodo),
    });
  }

  return { getPosts, getTodos };
})();

// ---------- UI Module (Revealing Module Pattern) ----------
const UI = (() => {
  const els = {
    postsList: document.getElementById("posts-list"),
    todosList: document.getElementById("todos-list"),
    postsError: document.getElementById("posts-error"),
    todosError: document.getElementById("todos-error"),
    postsLoading: document.getElementById("posts-loading"),
    todosLoading: document.getElementById("todos-loading"),
    postsCount: document.getElementById("posts-count"),
    todosCount: document.getElementById("todos-count"),
    refreshBtn: document.getElementById("refresh-all"),
    cancelBtn: document.getElementById("cancel-requests"),
    filterSelect: document.getElementById("todos-filter"),
  };

  // Track how many sections are currently loading to manage button states
  let loadingCount = 0;
  function updateButtons() {
    if (els.refreshBtn) els.refreshBtn.disabled = loadingCount > 0;
    if (els.cancelBtn) els.cancelBtn.disabled = loadingCount === 0;
  }

  function setLoading(section, isLoading) {
    const el = section === "posts" ? els.postsLoading : els.todosLoading;
    el.hidden = !isLoading;

    // Keep count in sync for concurrent loads
    loadingCount += isLoading ? 1 : -1;
    loadingCount = Math.max(0, loadingCount);
    updateButtons();
  }

  function showError(section, message, onRetry) {
    const el = section === "posts" ? els.postsError : els.todosError;
    el.innerHTML = "";

    const span = document.createElement("span");
    span.textContent = message;
    el.appendChild(span);

    if (typeof onRetry === "function") {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Retry";
      btn.addEventListener("click", onRetry);
      el.appendChild(btn);
    }
    el.hidden = false;
  }

  function clearError(section) {
    const el = section === "posts" ? els.postsError : els.todosError;
    el.hidden = true;
    el.innerHTML = "";
  }

  function renderPosts(posts) {
    els.postsList.innerHTML = "";
    const frag = document.createDocumentFragment();
    for (const post of posts) {
      const li = document.createElement("li");
      li.className = "card";
      li.dataset.id = post.id;
      li.innerHTML = `
        <h4>${escapeHtml(post.title)}</h4>
        <p>${escapeHtml(post.body)}</p>
      `;
      frag.appendChild(li);
    }
    els.postsList.appendChild(frag);
    if (els.postsCount) els.postsCount.textContent = posts.length;
  }

  function renderTodos(todos) {
    els.todosList.innerHTML = "";
    const frag = document.createDocumentFragment();
    for (const todo of todos) {
      const li = document.createElement("li");
      li.className = "todo-item" + (todo.completed ? " completed" : "");
      li.dataset.id = String(todo.id);
      li.innerHTML = `
        <label style="display:flex;align-items:center;gap:10px;">
          <input type="checkbox" data-role="toggle" ${todo.completed ? "checked" : ""}/>
          <span>${escapeHtml(todo.title)}</span>
        </label>
      `;
      frag.appendChild(li);
    }
    els.todosList.appendChild(frag);
    if (els.todosCount) els.todosCount.textContent = todos.length;
  }

  function bindRefresh(handler) {
    els.refreshBtn?.addEventListener("click", handler);
  }

  function bindCancel(handler) {
    els.cancelBtn?.addEventListener("click", handler);
  }

  function bindTodoToggle(handler) {
    els.todosList.addEventListener("change", (e) => {
      const cb = e.target;
      if (cb.matches('input[type="checkbox"][data-role="toggle"]')) {
        const li = cb.closest("li");
        handler({ id: Number(li.dataset.id), completed: cb.checked, li });
      }
    });
  }

  function toggleTodoUI(id, completed) {
    const li = els.todosList.querySelector(`li[data-id="${id}"]`);
    if (!li) return;
    li.classList.toggle("completed", completed);
    const cb = li.querySelector('input[type="checkbox"]');
    if (cb) cb.checked = completed;
  }

  function bindFilterChange(handler) {
    els.filterSelect?.addEventListener("change", (e) => handler(e.target.value));
  }

  function applyTodoFilter(filter) {
    const items = els.todosList.querySelectorAll("li.todo-item");
    items.forEach((li) => {
      const isCompleted = li.classList.contains("completed");
      let visible = true;
      if (filter === "completed") visible = isCompleted;
      if (filter === "active") visible = !isCompleted;
      li.style.display = visible ? "" : "none";
    });
  }

  return {
    setLoading,
    showError,
    clearError,
    renderPosts,
    renderTodos,
    bindRefresh,
    bindCancel,
    bindTodoToggle,
    bindFilterChange,
    applyTodoFilter,
    toggleTodoUI,
  };
})();

// ---------- App Module (Revealing Module Pattern) ----------
const App = (() => {
  let posts = [];
  let todos = [];
  const controllers = { posts: null, todos: null };

  function init() {
    UI.bindRefresh(loadAll);
    UI.bindCancel(cancelAll);
    UI.bindTodoToggle(handleTodoToggle);
    UI.bindFilterChange((filter) => UI.applyTodoFilter(filter));
    // Paused by default: no auto-fetch here
    // loadAll();
  }

  async function loadAll() {
    await Promise.all([loadPosts(), loadTodos()]);
  }

  async function loadPosts() {
    UI.setLoading("posts", true);
    UI.clearError("posts");
    // cancel any previous posts request
    controllers.posts?.abort();
    const ctrl = new AbortController();
    controllers.posts = ctrl;

    try {
      posts = await Api.getPosts(10, { signal: ctrl.signal });
      UI.renderPosts(posts);
    } catch (err) {
      if (err instanceof CanceledError) {
        UI.showError("posts", "Request canceled by user.", loadPosts);
      } else {
        UI.showError("posts", formatError(err), loadPosts);
      }
    } finally {
      UI.setLoading("posts", false);
      controllers.posts = null;
    }
  }

  async function loadTodos() {
    UI.setLoading("todos", true);
    UI.clearError("todos");
    // cancel any previous todos request
    controllers.todos?.abort();
    const ctrl = new AbortController();
    controllers.todos = ctrl;

    try {
      todos = await Api.getTodos(12, { signal: ctrl.signal });
      UI.renderTodos(todos);
      UI.applyTodoFilter("all");
    } catch (err) {
      if (err instanceof CanceledError) {
        UI.showError("todos", "Request canceled by user.", loadTodos);
      } else {
        UI.showError("todos", formatError(err), loadTodos);
      }
    } finally {
      UI.setLoading("todos", false);
      controllers.todos = null;
    }
  }

  function cancelAll() {
    controllers.posts?.abort();
    controllers.todos?.abort();
    // No UI.setLoading or showError here; each request will handle it in catch/finally
  }

  // Local-only toggle (JSONPlaceholder doesn't persist updates)
  function handleTodoToggle({ id, completed }) {
    const idx = todos.findIndex((t) => t.id === id);
    if (idx !== -1) todos[idx] = { ...todos[idx], completed };
    UI.toggleTodoUI(id, completed);
  }

  return { init };
})();

// Bootstrap
document.addEventListener("DOMContentLoaded", App.init);