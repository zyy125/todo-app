/**
 * UI 操作模块
 * 负责所有 DOM 操作和页面渲染
 */

const TodoUI = {
    /**
     * 更新统计数字
     * @param {Object} data - 包含统计信息的对象
     */
    updateStats(data) {
        document.getElementById('totalCount').textContent = data.total || 0;
        document.getElementById('completedCount').textContent = data.completed || 0;
        document.getElementById('pendingCount').textContent = data.pending || 0;
    },

    /**
     * 渲染待办事项列表
     * @param {Array} todos - 待办事项数组
     */
    renderTodos(todos) {
        const todoList = document.getElementById('todoList');

        // 如果列表为空，显示空状态
        if (!todos || todos.length === 0) {
            todoList.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                    </svg>
                    <p>暂无待办事项</p>
                </div>
            `;
            return;
        }

        // 生成待办事项 HTML
        todoList.innerHTML = todos.map(todo => this.createTodoItem(todo)).join('');
    },

    /**
     * 创建单个待办事项的 HTML
     * @param {Object} todo - 待办事项对象
     * @returns {string} HTML 字符串
     */
    createTodoItem(todo) {
        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox"
                    ${todo.completed ? 'checked' : ''}
                    onchange="TodoApp.toggleTodo(${todo.id}, ${!todo.completed})"
                >
                <span class="todo-text">${this.escapeHtml(todo.title)}</span>
                <button class="btn-delete" onclick="TodoApp.deleteTodo(${todo.id})">删除</button>
            </div>
        `;
    },

    /**
     * 显示加载状态
     */
    showLoading() {
        document.getElementById('todoList').innerHTML = `
            <div class="loading">加载中...</div>
        `;
    },

    /**
     * 显示错误信息
     * @param {string} message - 错误消息
     */
    showError(message) {
        document.getElementById('todoList').innerHTML = `
            <div class="error">${this.escapeHtml(message)}</div>
        `;
    },

    /**
     * 更新筛选按钮状态
     * @param {string} activeFilter - 当前激活的筛选条件
     */
    updateFilterButtons(activeFilter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 找到对应的按钮并添加 active 类
        const filterButtons = {
            'all': 0,
            'pending': 1,
            'completed': 2
        };
        
        const buttonIndex = filterButtons[activeFilter];
        if (buttonIndex !== undefined) {
            document.querySelectorAll('.filter-btn')[buttonIndex].classList.add('active');
        }
    },

    /**
     * 清空输入框
     */
    clearInput() {
        document.getElementById('todoInput').value = '';
    },

    /**
     * 获取输入框的值
     * @returns {string} 输入框的值（去除首尾空格）
     */
    getInputValue() {
        return document.getElementById('todoInput').value.trim();
    },

    /**
     * 转义 HTML 特殊字符，防止 XSS 攻击
     * @param {string} text - 要转义的文本
     * @returns {string} 转义后的文本
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * 显示提示信息
     * @param {string} message - 提示消息
     */
    showAlert(message) {
        alert(message);
    },

    /**
     * 显示确认对话框
     * @param {string} message - 确认消息
     * @returns {boolean} 用户选择的结果
     */
    showConfirm(message) {
        return confirm(message);
    }
};