document.addEventListener('DOMContentLoaded', () => {
    // --- 应用程序数据 ---
    let appData = {
        startMenuItems: [
            { type: 'header', name: '最近添加' },
            { id: 'youtube', type: 'item', name: 'YouTube', action: 'createWindow', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', deleted: false },
            { id: 'bilibili', type: 'item', name: '哔哩哔哩', action: 'createWindow', url: 'https://www.bilibili.com/', deleted: false },
            { type: 'separator' },
            { id: '123pan', type: 'item', name: '123 网盘', action: 'createWindow', url: 'https://www.123pan.com/', deleted: false },
            { type: 'header', name: 'A' },
            { id: 'ps', type: 'item', name: 'Adobe Photoshop 2025', action: 'alert', deleted: false },
            { id: 'ai', type: 'item', name: 'Adobe Illustrator 2025', action: 'alert', deleted: false },
            { id: 'cc', type: 'item', name: 'Adobe Creative Cloud', action: 'alert', deleted: false },
            { type: 'header', name: 'B' },
            { id: 'baidu', type: 'item', name: '百度网盘', action: 'createWindow', url: 'https://pan.baidu.com/', deleted: false },
        ],
        tileSections: [
            {
                title: '常用',
                tiles: [
                    { id: 'wechat', name: '微信', size: 'normal', action: 'createWindow', url: 'https://weixin.qq.com/', deleted: false },
                    { id: 'qq', name: 'QQ', size: 'normal', action: 'alert', deleted: false },
                    { id: 'terminal', name: '终端', size: 'normal', action: 'createWindow', url: 'https://hackertyper.net/', deleted: false },
                    { id: 'vscode', name: 'Visual Studio Code', size: 'wide', action: 'createWindow', url: 'https://vscode.dev/', deleted: false },
                    { id: 'appstore', name: 'App Store', size: 'normal', action: 'restoreApps', deleted: false }, // App Store
                ]
            },
            {
                title: '游戏',
                tiles: [
                    { id: 'minecraft', name: 'Minecraft', size: 'wide', action: 'createWindow', url: 'https://play.mc.js.cool/1.8wasm/', deleted: false },
                    { id: 'steam', name: 'Steam', size: 'normal', action: 'createWindow', url: 'https://store.steampowered.com/', deleted: false },
                    { id: 'roblox', name: 'Roblox', size: 'normal', action: 'createWindow', url: 'https://www.roblox.com/', deleted: false },
                ]
            }
        ]
    };

    // --- DOM 元素 ---
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const timeElement = document.getElementById('time');
    const startMenuListContainer = document.getElementById('start-menu-list-container');
    const tilesContainer = document.getElementById('start-menu-tiles-container');
    const contextMenu = document.getElementById('context-menu');
    const contextMenuDelete = document.getElementById('context-menu-delete');

    // --- 函数 ---

    // 渲染整个开始菜单
    function renderStartMenu() {
        // 清空现有内容
        startMenuListContainer.innerHTML = '';
        tilesContainer.innerHTML = '';

        // 渲染列表
        appData.startMenuItems.forEach(itemData => {
            if (itemData.deleted) return; // 跳过已删除的应用

            const itemElement = document.createElement('div');
            itemElement.className = 'start-menu-list-item';

            if (itemData.type === 'header') {
                itemElement.textContent = itemData.name;
                itemElement.style.fontWeight = 'bold';
            } else if (itemData.type === 'item') {
                const span = document.createElement('span');
                span.textContent = itemData.name;
                itemElement.appendChild(span);
                itemElement.addEventListener('click', () => handleAction(itemData));
                itemElement.addEventListener('contextmenu', (e) => showContextMenu(e, itemData));
            } else if (itemData.type === 'separator') {
                itemElement.textContent = '#';
            }
            startMenuListContainer.appendChild(itemElement);
        });

        // 渲染磁贴
        appData.tileSections.forEach(sectionData => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'tiles-section';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'section-title';
            titleDiv.textContent = sectionData.title;
            sectionDiv.appendChild(titleDiv);

            const gridDiv = document.createElement('div');
            gridDiv.className = 'tiles-grid';

            sectionData.tiles.forEach(tileData => {
                if (tileData.deleted) return; // 跳过已删除的应用

                const tileDiv = document.createElement('div');
                tileDiv.className = `tile ${tileData.size || 'normal'}`;
                const span = document.createElement('span');
                span.textContent = tileData.name;
                tileDiv.appendChild(span);
                tileDiv.addEventListener('click', () => handleAction(tileData));
                // 仅当应用不是 App Store 时才添加右键删除功能
                if (tileData.id !== 'appstore') {
                    tileDiv.addEventListener('contextmenu', (e) => showContextMenu(e, tileData));
                }
                gridDiv.appendChild(tileDiv);
            });

            sectionDiv.appendChild(gridDiv);
            tilesContainer.appendChild(sectionDiv);
        });
    }

    // 显示右键菜单
    function showContextMenu(e, itemData) {
        e.preventDefault();
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;

        contextMenuDelete.onclick = () => {
            itemData.deleted = true;
            renderStartMenu();
            contextMenu.style.display = 'none';
        };
    }

    // 处理点击事件
    function handleAction(itemData) {
        if (itemData.action === 'createWindow') {
            createWindow(itemData.name, itemData.url);
        } else if (itemData.action === 'alert') {
            alert(`“${itemData.name}”不是一个真正的应用程序。`);
        } else if (itemData.action === 'restoreApps') {
            appData.startMenuItems.forEach(item => item.deleted = false);
            appData.tileSections.forEach(section => section.tiles.forEach(tile => tile.deleted = false));
            renderStartMenu();
        }
        startMenu.style.display = 'none';
    }

    // 切换开始菜单
    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.style.display = startMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    // 点击其他地方隐藏菜单
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target)) {
            startMenu.style.display = 'none';
        }
        if (!contextMenu.contains(e.target)) {
            contextMenu.style.display = 'none';
        }
    });

    // 更新时间
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }

    // 创建窗口 (代码与之前版本相同，此处省略以保持简洁)
    function createWindow(title, url) {
        const desktop = document.getElementById('desktop');
        const windowDiv = document.createElement('div');
        windowDiv.className = 'window';
        const header = document.createElement('div');
        header.className = 'window-header';
        const titleSpan = document.createElement('span');
        titleSpan.className = 'window-title';
        titleSpan.textContent = title;
        const controls = document.createElement('div');
        controls.className = 'window-controls';
        const maximizeButton = document.createElement('button');
        maximizeButton.textContent = '🗖';
        let isMaximized = false;
        let originalState = {};
        maximizeButton.onclick = () => {
            if (isMaximized) {
                windowDiv.style.top = originalState.top;
                windowDiv.style.left = originalState.left;
                windowDiv.style.width = originalState.width;
                windowDiv.style.height = originalState.height;
                isMaximized = false;
            } else {
                originalState = { top: windowDiv.style.top, left: windowDiv.style.left, width: windowDiv.style.width, height: windowDiv.style.height };
                windowDiv.style.top = '0';
                windowDiv.style.left = '0';
                windowDiv.style.width = '100%';
                windowDiv.style.height = 'calc(100% - 40px)';
                isMaximized = true;
            }
        };
        const closeButton = document.createElement('button');
        closeButton.textContent = '✖';
        closeButton.onclick = () => windowDiv.remove();
        controls.appendChild(maximizeButton);
        controls.appendChild(closeButton);
        header.appendChild(titleSpan);
        header.appendChild(controls);
        const body = document.createElement('div');
        body.className = 'window-body';
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        body.appendChild(iframe);
        windowDiv.appendChild(header);
        windowDiv.appendChild(body);
        desktop.appendChild(windowDiv);
        let isDragging = false;
        let offsetX, offsetY;
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - windowDiv.offsetLeft;
            offsetY = e.clientY - windowDiv.offsetTop;
            windowDiv.style.zIndex = 101;
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                windowDiv.style.left = `${e.clientX - offsetX}px`;
                windowDiv.style.top = `${e.clientY - offsetY}px`;
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            windowDiv.style.zIndex = 100;
        });
    }

    // --- 初始化 ---
    renderStartMenu();
    setInterval(updateTime, 1000);
    updateTime();
});