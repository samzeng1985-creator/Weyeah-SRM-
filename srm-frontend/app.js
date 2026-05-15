// ============================================
// SRM采购管理系统 - Weyeah
// 前端交互脚本
// ============================================

// 全局应用状态
const App = {
    currentPage: 'dashboard',
    isLoggedIn: false
};

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initLoginForm();
    initNavigation();
    initLogoutButton();
});

// ============================================
// 登录功能
// ============================================
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 简单的登录验证
    if (username && password) {
        showLoading();
        
        // 模拟登录请求
        setTimeout(() => {
            loginSuccess();
        }, 800);
    }
}

function showLoading() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';
        loginBtn.disabled = true;
    }
}

function loginSuccess() {
    App.isLoggedIn = true;
    
    // 隐藏登录页面，显示主应用
    const loginPage = document.getElementById('loginPage');
    const mainApp = document.getElementById('mainApp');
    
    if (loginPage && mainApp) {
        loginPage.style.display = 'none';
        mainApp.style.display = 'flex';
    }
    
    // 显示欢迎提示
    showNotification('欢迎回来！', 'success');
}

// ============================================
// 导航功能
// ============================================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });
}

function navigateTo(pageName) {
    // 更新导航状态
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageName) {
            item.classList.add('active');
        }
    });
    
    // 更新页面显示
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        App.currentPage = pageName;
    }
}

// ============================================
// 登出功能
// ============================================
function initLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        App.isLoggedIn = false;
        
        // 返回登录页面
        const loginPage = document.getElementById('loginPage');
        const mainApp = document.getElementById('mainApp');
        
        if (loginPage && mainApp) {
            loginPage.style.display = 'flex';
            mainApp.style.display = 'none';
        }
        
        // 重置登录表单
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 登录系统';
            loginBtn.disabled = false;
        }
        
        showNotification('已安全退出', 'info');
    }
}

// ============================================
// 模态框功能 - 新增供应商
// ============================================
function showAddSupplier() {
    const modal = document.getElementById('addSupplierModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeAddSupplier() {
    const modal = document.getElementById('addSupplierModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function saveSupplier() {
    // 模拟保存
    showNotification('供应商保存成功！', 'success');
    closeAddSupplier();
}

// ============================================
// 通知提示功能
// ============================================
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // 根据类型设置样式
    const colors = {
        success: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        error: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
        warning: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
        info: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        padding: 16px 24px;
        background: ${colors[type]};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    `;
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}" style="font-size: 18px;"></i>
        <span>${message}</span>
    `;
    
    // 添加动画样式
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // 3秒后自动消失
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ============================================
// 表格行点击效果
// ============================================
document.addEventListener('click', function(e) {
    // 表格操作按钮
    if (e.target.closest('.table-action-btn')) {
        const btn = e.target.closest('.table-action-btn');
        const title = btn.getAttribute('title') || '';
        
        // 简单的提示
        if (title && title !== '删除') {
            showNotification(`${title}功能开发中...`, 'info');
        } else if (title === '删除') {
            if (confirm('确定要删除这条记录吗？')) {
                showNotification('已删除', 'success');
            }
        }
    }
    
    // 普通按钮
    if (e.target.closest('.btn') && !e.target.closest('.login-btn') && !e.target.closest('.logout-btn')) {
        const btn = e.target.closest('.btn');
        if (!btn.closest('.modal-footer')) {
            showNotification('功能开发中...', 'info');
        }
    }
    
    // 卡片链接
    if (e.target.classList.contains('card-link')) {
        e.preventDefault();
        showNotification('功能开发中...', 'info');
    }
    
    // 任务项点击
    if (e.target.closest('.task-item')) {
        showNotification('查看详情功能开发中...', 'info');
    }
});

// ============================================
// 键盘快捷键
// ============================================
document.addEventListener('keydown', function(e) {
    // ESC 关闭模态框
    if (e.key === 'Escape') {
        closeAddSupplier();
    }
});

// ============================================
// 控制台欢迎信息
// ============================================
console.log('%c🚀 SRM采购管理系统', 'font-size: 20px; font-weight: bold; color: #1a365d;');
console.log('%c欢迎使用 Weyeah SRM 系统！', 'font-size: 14px; color: #4a5568;');
console.log('%c前端界面已加载完成', 'font-size: 12px; color: #718096;');
