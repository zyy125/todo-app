/**
 * API 调用模块
 * 封装所有与后端的交互
 */

const TodoAPI = {
    /**
     * 获取待办事项列表
     * @param {string} status - 筛选条件 (all/pending/completed)
     * @returns {Promise<Object>} 返回数据
     */
    async getTodos(status = 'all') {
        try {
            const response = await fetch(`${API_BASE}/todos?status=${status}`);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('获取待办事项失败:', error);
            throw error;
        }
    },

    /**
     * 创建新待办事项
     * @param {string} title - 待办事项标题
     * @returns {Promise<Object>} 返回数据
     */
    async createTodo(title) {
        try {
            const response = await fetch(`${API_BASE}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title })
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('创建待办事项失败:', error);
            throw error;
        }
    },

    /**
     * 更新待办事项
     * @param {number} id - 待办事项 ID
     * @param {boolean} completed - 完成状态
     * @returns {Promise<Object>} 返回数据
     */
    async updateTodo(id, completed) {
        try {
            const response = await fetch(`${API_BASE}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed })
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('更新待办事项失败:', error);
            throw error;
        }
    },

    /**
     * 删除待办事项
     * @param {number} id - 待办事项 ID
     * @returns {Promise<Object>} 返回数据
     */
    async deleteTodo(id) {
        try {
            const response = await fetch(`${API_BASE}/todos/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('删除待办事项失败:', error);
            throw error;
        }
    }
};