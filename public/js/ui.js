
/**
 * UI 操作模块
 * 负责所有 DOM 操作和页面渲染
 */

const TodoUI = {
    /**
     * 更新统计数字
     */
    updateStats(data) {
        document.getElementById('totalCount').textContent = data.total || 0;
        document.getElementById('completedCount').textContent = data.completed || 0;
        document.getElementById('pendingCount').textContent = data.pending || 0;
    },

    /**
     * 渲染待办事项列表
     */
    renderTodos(todos) {
        const todoList = document.getElementById('todoList');

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

        todoList.innerHTML = todos.map(todo => this.createTodoItem(todo)).join('');
    },

    /**
     * 创建单个待办事项的 HTML
     */
    createTodoItem(todo) {
        // 安全地序列化 todo 对象
        const todoData = {
            id: todo.id,
            title: todo.title,
            completed: todo.completed
        };
        
        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox"
                    ${todo.completed ? 'checked' : ''}
                    onchange="TodoApp.toggleTodo(${todo.id}, ${!todo.completed})"
                >
                <span 
                    class="todo-text" 
                    onclick='TodoUI.showTodoDetail(${JSON.stringify(todoData)})'
                    title="点击查看完整内容"
                >
                    ${this.escapeHtml(todo.title)}
                </span>
                <button class="btn-delete" onclick="TodoApp.deleteTodo(${todo.id})">删除</button>
            </div>
        `;
    },

    showLoading() {
        document.getElementById('todoList').innerHTML = `<div class="loading">加载中...</div>`;
    },

    showError(message) {
        document.getElementById('todoList').innerHTML = `<div class="error">${this.escapeHtml(message)}</div>`;
    },

    updateFilterButtons(activeFilter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

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

    clearInput() {
        document.getElementById('todoInput').value = '';
    },

    getInputValue() {
        return document.getElementById('todoInput').value.trim();
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    showAlert(message) {
        alert(message);
    },

    showConfirm(message) {
        return confirm(message);
    },

    renderPagination(currentPage, totalPages) {
        const paginationContainer = document.getElementById('pagination');

        if (!totalPages || totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let html = '<div class="pagination-wrapper">';

        html += `
            <button 
                class="pagination-btn pagination-btn-nav ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="TodoApp.goToPage(${currentPage - 1})"
                ${currentPage === 1 ? 'disabled' : ''}
            >
                <span class="nav-arrow">←</span>
                <span class="nav-text">上一页</span>
            </button>
        `;

        html += '<div class="pagination-numbers">';

        const maxPages = PAGINATION.MAX_PAGES;
        let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
        let endPage = Math.min(totalPages, startPage + maxPages - 1);

        if (endPage - startPage < maxPages - 1) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }

        if (startPage > 1) {
            html += `
                <button class="pagination-btn" onclick="TodoApp.goToPage(1)">1</button>
                ${startPage > 2 ? '<span class="pagination-ellipsis">...</span>' : ''}
            `;
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `
                <button 
                    class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="TodoApp.goToPage(${i})"
                >
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            html += `
                ${endPage < totalPages - 1 ? '<span class="pagination-ellipsis">...</span>' : ''}
                <button class="pagination-btn" onclick="TodoApp.goToPage(${totalPages})">${totalPages}</button>
            `;
        }

        html += '</div>';

        html += `
            <button 
                class="pagination-btn pagination-btn-nav ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="TodoApp.goToPage(${currentPage + 1})"
                ${currentPage === totalPages ? 'disabled' : ''}
            >
                <span class="nav-text">下一页</span>
                <span class="nav-arrow">→</span>
            </button>
        `;

        html += '</div>';

        html += `
            <div class="pagination-info">
                第 ${currentPage} / ${totalPages} 页
            </div>
        `;

        paginationContainer.innerHTML = html;
    },

    closeModal(overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 300);
    },

    /**
     * 显示待办事项详情
     */
    showTodoDetail(todo) {
        console.log('showTodoDetail called with:', todo);
        
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                this.closeModal(overlay);
            }
        };

        this.renderViewMode(overlay, todo);

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(overlay);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    },

    /**
     * 渲染查看模式
     */
    renderViewMode(overlay, todo) {
        console.log('renderViewMode called with:', todo);
        
        const todoJson = JSON.stringify(todo).replace(/'/g, '&#39;');
        
        const modalContent = `
            <div class="modal-content" onclick="event.stopPropagation()">
                <h3 class="modal-title">📋 待办事项详情</h3>
                <div class="modal-body">
                    <div class="detail-section">
                        <label class="detail-label">📝 内容</label>
                        <div class="detail-content">${this.escapeHtml(todo.title)}</div>
                    </div>
                    <div class="detail-section">
                        <label class="detail-label">📊 状态</label>
                        <div class="status-badge ${todo.completed ? 'status-completed' : 'status-pending'}">
                            ${todo.completed ? '✅ 已完成' : '⏳ 未完成'}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button 
                        class="modal-btn modal-btn-secondary" 
                        onclick='TodoUI.switchToEditMode(this.closest(".modal-overlay"), ${todoJson})'
                    >
                        ✏️ 编辑
                    </button>
                    <button 
                        class="modal-btn modal-btn-primary" 
                        onclick="TodoUI.closeModal(this.closest('.modal-overlay'))"
                    >
                        关闭
                    </button>
                </div>
            </div>
        `;
        
        const existingContent = overlay.querySelector('.modal-content');
        if (existingContent) {
            existingContent.outerHTML = modalContent;
        } else {
            overlay.innerHTML = modalContent;
        }
    },

    /**
     * 切换到编辑模式
     */
    switchToEditMode(overlay, todo) {
        console.log('switchToEditMode called with:', todo);
        
        const charCount = todo.title.length;
        const todoJson = JSON.stringify(todo).replace(/'/g, '&#39;');
        
        const modalContent = `
            <div class="modal-content edit-mode" onclick="event.stopPropagation()">
                <h3 class="modal-title">✏️ 编辑待办事项</h3>
                <div class="modal-body">
                    <div class="edit-section">
                        <div class="edit-header">
                            <label class="edit-label" for="editTodoTitle">📝 内容</label>
                            <span class="char-counter" id="charCount">${charCount} / 200</span>
                        </div>
                        <textarea 
                            id="editTodoTitle" 
                            class="edit-todo-input"
                            rows="4"
                            maxlength="200"
                            placeholder="请输入待办事项内容..."
                            oninput="TodoUI.updateCharCount()"
                        >${this.escapeHtml(todo.title)}</textarea>
                        <div class="input-hint">💡 提示：支持最多 200 个字符</div>
                        <div id="editError" class="edit-error" style="display: none;"></div>
                    </div>
                    <div class="detail-section">
                        <label class="detail-label">📊 当前状态</label>
                        <div class="status-badge ${todo.completed ? 'status-completed' : 'status-pending'}">
                            ${todo.completed ? '✅ 已完成' : '⏳ 未完成'}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button 
                        class="modal-btn" 
                        onclick='TodoUI.renderViewMode(this.closest(".modal-overlay"), ${todoJson})'
                    >
                        取消
                    </button>
                    <button 
                        class="modal-btn modal-btn-primary" 
                        onclick="TodoUI.saveTodoEdit(${todo.id}, this.closest('.modal-overlay'))"
                    >
                        <span class="btn-icon">💾</span>
                        <span class="btn-text">保存</span>
                    </button>
                </div>
            </div>
        `;
        
        overlay.querySelector('.modal-content').outerHTML = modalContent;
        
        setTimeout(() => {
            const input = document.getElementById('editTodoTitle');
            if (input) {
                input.focus();
                input.select();
                
                input.addEventListener('keydown', (e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                        this.saveTodoEdit(todo.id, overlay);
                    }
                });
            }
        }, 100);
    },

    updateCharCount() {
        const input = document.getElementById('editTodoTitle');
        const counter = document.getElementById('charCount');
        if (input && counter) {
            const count = input.value.length;
            counter.textContent = `${count} / 200`;
            
            if (count > 180) {
                counter.style.color = '#f56565';
                counter.style.fontWeight = 'bold';
            } else {
                counter.style.color = '#999';
                counter.style.fontWeight = 'normal';
            }
        }
    },

    async saveTodoEdit(id, overlay) {
    const input = document.getElementById('editTodoTitle');
    const errorDiv = document.getElementById('editError');
    const newTitle = input.value.trim();

    console.log('准备保存:', {id, newTitle, length: newTitle.length});  // 添加调试

    // 验证输入
    if (!newTitle) {
        errorDiv.textContent = '❌ 内容不能为空';
        errorDiv.style.display = 'block';
        input.focus();
        input.classList.add('input-error');
        return;
    }

    if (newTitle.length > 200) {
        errorDiv.textContent = '❌ 内容不能超过 200 个字符';
        errorDiv.style.display = 'block';
        input.focus();
        input.classList.add('input-error');
        return;
    }

    // ... 省略按钮状态代码 ...

    try {
        console.log('调用 API，参数:', {id, title: newTitle});  // 添加调试
        
        // 调用 API（确保传递的是 newTitle，不是其他变量）
        const result = await TodoAPI.updateTodoTitle(id, newTitle);

        console.log('API 返回:', result);  // 添加调试

        if (result.code === STATUS_CODE.SUCCESS) {
            this.closeModal(overlay);
            this.showToast('✅ 保存成功', 'success');
            TodoApp.loadTodos();
        } else {
            errorDiv.textContent = '❌ 保存失败：' + result.message;
            errorDiv.style.display = 'block';
            // ... 恢复按钮状态 ...
        }
    } catch (error) {
        console.error('保存出错:', error);  // 添加调试
        errorDiv.textContent = '❌ 网络错误：' + error.message;
        errorDiv.style.display = 'block';
        // ... 恢复按钮状态 ...
    }
},
    showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-banner toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
            <span class="toast-text">${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 1500);
}
};