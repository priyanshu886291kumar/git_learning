<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <h1>Todo List</h1>
        <form id="task-form">
            <input type="text" id="task-input" placeholder="What needs to be done?" required>
            <button type="submit">Add Task</button>
        </form>
        <ul id="task-list"></ul>
        <div id="footer">
            <div id="count"></div>
            <button id="clear-completed">Clear Completed</button>
        </div>
    </div>
    <script>
        (function(){
	const STORAGE_KEY = 'todo.tasks.v1';

	// DOM refs
	const form = document.getElementById('task-form');
	const input = document.getElementById('task-input');
	const list = document.getElementById('task-list');
	const countEl = document.getElementById('count');
	const clearBtn = document.getElementById('clear-completed');

	// state
	let tasks = load();

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
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
		} catch (e) {
			console.warn('Could not save tasks', e);
		}
	}

	function load(){
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch (e) {
			return [];
		}
	}
})();
    </script>
</body>
</html>