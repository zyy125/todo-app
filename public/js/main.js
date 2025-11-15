/**
 * 主应用逻辑
 * 协调 API 和 UI 模块
 */

const TodoApp = {
    // 当前筛选条件
    currentFilter: 'all',

    /**
     * 初始化应用
     */
    init() {
        console.log('TodoApp 初始化...');
        this.loadTodos();
        this.bindEvents();
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 输入框回车事件
        const input = document.getElementById('todoInput');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    },

    /**
     * 加载待办事项列表
     */
    async loadTodos() {
        try {
            TodoUI.showLoading();

            const result = await TodoAPI.getTodos(this.currentFilter);

            if (result.code === STATUS_CODE.SUCCESS) {
                TodoUI.updateStats(result.data);
                TodoUI.renderTodos(result.data.todos);
            } else {
                TodoUI.showError('加载失败：' + result.message);
            }
        } catch (error) {
            TodoUI.showError('网络错误：' + error.message);
        }
    },

    /**
     * 添加待办事项
     */
    async addTodo() {
        const title = TodoUI.getInputValue();

        // 验证输入
        if (!title) {
            TodoUI.showAlert('请输入待办事项内容');
            return;
        }

        try {
            const result = await TodoAPI.createTodo(title);

            if (result.code === STATUS_CODE.SUCCESS) {
                TodoUI.clearInput();
                this.loadTodos();
            } else {
                TodoUI.showAlert('添加失败：' + result.message);
            }
        } catch (error) {
            TodoUI.showAlert('网络错误：' + error.message);
        }
    },

    /**
     * 切换待办事项完成状态
     * @param {number} id - 待办事项 ID
     * @param {boolean} completed - 新的完成状态
     */
    async toggleTodo(id, completed) {
        try {
            const result = await TodoAPI.updateTodo(id, completed);

            if (result.code === STATUS_CODE.SUCCESS) {
                this.loadTodos();
            } else {
                TodoUI.showAlert('更新失败：' + result.message);
            }
        } catch (error) {
            TodoUI.showAlert('网络错误：' + error.message);
        }
    },

    /**
     * 删除待办事项
     * @param {number} id - 待办事项 ID
     */
    async deleteTodo(id) {
        if (!TodoUI.showConfirm('确定要删除这个待办事项吗？')) {
            return;
        }

        try {
            const result = await TodoAPI.deleteTodo(id);

            if (result.code === STATUS_CODE.SUCCESS) {
                this.loadTodos();
            } else {
                TodoUI.showAlert('删除失败：' + result.message);
            }
        } catch (error) {
            TodoUI.showAlert('网络错误：' + error.message);
        }
    },

    /**
     * 筛选待办事项
     * @param {string} filter - 筛选条件 (all/pending/completed)
     */
    filterTodos(filter) {
        this.currentFilter = filter;
        TodoUI.updateFilterButtons(filter);
        this.loadTodos();
    }
};

// 页面加载完成后初始化应用
window.addEventListener('DOMContentLoaded', () => {
    TodoApp.init();
});