/**
 * 配置文件
 * 包含全局配置和常量
 */

// API 基础 URL
const API_BASE = 'http://localhost:8080/api';

// 筛选类型
const FILTER_TYPES = {
    ALL: 'all',
    PENDING: 'pending',
    COMPLETED: 'completed'
};

// 响应状态码
const STATUS_CODE = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
};

// 分页配置
const PAGINATION = {
    PAGE_SIZE: 6,        // 每页显示数量
    MAX_PAGES: 5          // 最多显示的页码按钮数量
};