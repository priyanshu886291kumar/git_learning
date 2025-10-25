(function(){
    const STORAGE_KEY = 'todo.tasks.v1';
    const THEME_KEY = 'todo.theme.v1';

    // DOM refs
    const form = document.getElementById('task-form');
    const input = document.getElementById('task-input');
    const list = document.getElementById('task-list');
    const countEl = document.getElementById('count');
    const clearBtn = document.getElementById('clear-completed');
    const toggleThemeBtn = document.getElementById('toggle-theme');

    // state
    let tasks = load();
    applyTheme(loadTheme());

    // initial render
    render();

    // events
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        addTask(text);
        input.value = '';
    });

    clearBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        save(); render();
    });

    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', () => {
            const next = (loadTheme() === 'dark') ? 'light' : 'dark';
            saveTheme(next);
            applyTheme(next);
        });
    }

    // functions
    function addTask(text){
        tasks.push({id: Date.now(), text, completed:false});
        save(); render();
    }

    function toggleTask(id){
        const t = tasks.find(x=>x.id===id);
        if (t) t.completed = !t.completed;
        save(); render();
    }

    function deleteTask(id){
        tasks = tasks.filter(x=>x.id!==id);
        save(); render();
    }

    function render(){
        list.innerHTML = '';
        if (tasks.length === 0){
            const li = document.createElement('li');
            li.className = 'task';
            li.innerHTML = '<div class="left"><span class="text" style="color:var(--muted)">No tasks yet</span></div>';
            list.appendChild(li);
        } else {
            tasks.forEach(t => {
                const li = document.createElement('li');
                li.className = 'task' + (t.completed ? ' completed' : '');
                li.dataset.id = t.id;

                const left = document.createElement('div');
                left.className = 'left';

                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = !!t.completed;
                cb.addEventListener('change', () => toggleTask(t.id));

                const span = document.createElement('span');
                span.className = 'text';
                span.textContent = t.text;

                left.appendChild(cb);
                left.appendChild(span);

                const del = document.createElement('button');
                del.className = 'delete';
                del.type = 'button';
                del.title = 'Delete';
                del.textContent = '✕';
                del.addEventListener('click', () => deleteTask(t.id));

                li.appendChild(left);
                li.appendChild(del);
                list.appendChild(li);
            });
        }
        updateCount();
    }

    function updateCount(){
        const remaining = tasks.filter(t=>!t.completed).length;
        const total = tasks.length;
        countEl.textContent = `${remaining} remaining — ${total} total`;
    }

    function save(){
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch (e) { console.warn('Could not save tasks', e); }
    }

    function load(){
        try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
    }

    function saveTheme(name){ try { localStorage.setItem(THEME_KEY, name); } catch(e){} }
    function loadTheme(){ try { return localStorage.getItem(THEME_KEY) || 'light'; } catch(e){ return 'light'; } }
    function applyTheme(name){
        if(name==='dark'){
            document.documentElement.style.setProperty('--bg','#0b1220');
            document.documentElement.style.setProperty('--card','#071127');
            document.documentElement.style.setProperty('--accent','#58a6ff');
            document.documentElement.style.setProperty('--muted','#9aa6b2');
            document.body.style.color = '#e6eef6';
        } else {
            document.documentElement.style.setProperty('--bg','#f7f9fb');
            document.documentElement.style.setProperty('--card','#ffffff');
            document.documentElement.style.setProperty('--accent','#0b79d0');
            document.documentElement.style.setProperty('--muted','#6b7280');
            document.body.style.color = '';
        }
    }
})();
