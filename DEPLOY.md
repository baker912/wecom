# 客户画像系统部署指南

本文档介绍如何将本项目（基于 Vite + React）部署到国内服务器或云服务上。

## 1. 项目打包

在本地开发环境中运行以下命令，生成生产环境的静态文件：

```bash
# 安装依赖（如果尚未安装）
npm install

# 执行构建
npm run build
```

构建完成后，项目根目录下会生成一个 `dist` 文件夹，里面包含了所有需要部署的 HTML、CSS、JS 和图片资源。

---

## 2. 部署方案选择

### 方案一：云服务器 + Nginx（推荐）
适合需要完全控制服务器、或后端 API 也在同一台服务器的情况。

**前置条件：**
- 一台国内云服务器（阿里云/腾讯云/华为云等）。
- 如果使用域名访问，域名需完成 ICP 备案。

**步骤：**

1.  **安装 Nginx** (以 CentOS 为例)：
    ```bash
    sudo yum install nginx -y
    sudo systemctl start nginx
    sudo systemctl enable nginx
    ```

2.  **上传文件**：
    将本地 `dist` 文件夹中的**所有内容**上传到服务器的 `/usr/share/nginx/html/customer-profile` 目录（示例路径）。
    可以使用 SCP 命令或 FileZilla 工具。

    ```bash
    # 示例 SCP 命令
    scp -r ./dist/* root@your_server_ip:/usr/share/nginx/html/customer-profile/
    ```

3.  **配置 Nginx**：
    编辑 Nginx 配置文件（通常在 `/etc/nginx/nginx.conf` 或 `/etc/nginx/conf.d/default.conf`），添加如下配置：

    ```nginx
    server {
        listen 80;
        server_name your_domain.com; # 替换为你的域名或 IP

        # 前端静态文件目录
        root /usr/share/nginx/html/customer-profile;
        index index.html;

        # 开启 Gzip 压缩，加速访问
        gzip on;
        gzip_min_length 1k;
        gzip_comp_level 6;
        gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;

        location / {
            # 解决 React 路由刷新 404 问题
            try_files $uri $uri/ /index.html;
        }

        # 如果有后端接口，可以配置反向代理
        # location /api/ {
        #     proxy_pass http://localhost:8080/;
        # }
    }
    ```

4.  **重启 Nginx**：
    ```bash
    sudo nginx -t  # 检查配置是否有误
    sudo systemctl reload nginx
    ```

5.  **访问**：
    在浏览器输入服务器 IP 或域名即可访问。

---

### 方案二：对象存储 + CDN（最简单、低成本）
适合纯静态页面，无需维护服务器，访问速度快。

**步骤：**

1.  **开通服务**：
    - 阿里云 OSS 或 腾讯云 COS。
    - 建议配合 CDN 使用，国内访问速度最佳。

2.  **创建存储桶 (Bucket)**：
    - 权限设置为“公共读”。

3.  **上传文件**：
    - 将 `dist` 目录下的所有文件上传到 Bucket 根目录。

4.  **开启静态网站托管**：
    - 在 Bucket 设置中找到“静态页面”或“静态网站托管”。
    - 将“默认首页”设置为 `index.html`。
    - 将“404 页面”也设置为 `index.html`（**关键步骤**，用于支持 React 路由）。

5.  **绑定域名 (可选)**：
    - 如果需要使用自定义域名，可以在 CDN/OSS 控制台绑定已备案的域名。

---

## 4. 懒人部署方案（更简单）

如果您觉得命令行太复杂，可以使用以下可视化工具：

### 方案三：宝塔面板（适合已有服务器的新手）
这是目前国内最流行的服务器管理面板，全图形化操作。

1.  **安装宝塔**：
    在服务器终端执行官方安装命令（只需执行一次）。
2.  **创建网站**：
    登录宝塔面板 -> 点击左侧「网站」->「添加站点」。
    - 域名：填写您的域名或服务器 IP。
    - 根目录：选择一个文件夹。
3.  **上传文件**：
    进入「文件」管理，直接上传本地 `dist` 文件夹内的内容到网站根目录。
4.  **配置伪静态（解决刷新 404）**：
    在网站设置中，找到「伪静态」，选择 `0` 或手动输入：
    ```nginx
    location / {
        try_files $uri $uri/ /index.html;
    }
    ```
5.  **完成**：直接访问即可。

### 方案四：腾讯云 Webify（无需服务器，类似 Vercel）
这是腾讯云推出的无服务器托管服务，专门部署前端项目。

1.  **关联代码仓库**：
    在腾讯云控制台搜索 "Webify"，授权连接您的 GitHub/Gitee/GitLab 仓库。
2.  **自动识别**：
    选择本项目仓库，Webify 会自动识别为 React + Vite 项目。
3.  **一键部署**：
    点击部署，系统会自动安装依赖、构建、分发到 CDN。
4.  **访问**：
    部署完成后会提供一个免费的测试域名（国内可访问），也可以绑定自己的域名。

### 方案五：Vercel + 自定义域名（最推荐，如果能绑定域名）
Vercel 是全球体验最好的部署平台，但默认域名 `*.vercel.app` 在国内被污染。
**解决办法**：在 Vercel 后台绑定一个您自己的域名（需在域名商处添加 CNAME 记录），即可实现国内秒开，且无需备案（服务器在香港/新加坡）。

---

## 3. 常见问题

### Q1: 页面刷新后出现 404 错误？
**原因**：React 是单页应用 (SPA)，路由由前端控制。刷新时浏览器向服务器请求 `/some-page`，但服务器上并没有这个文件。
**解决**：
- **Nginx**：必须配置 `try_files $uri $uri/ /index.html;`。
- **对象存储**：必须将“404 页面”设置为 `index.html`。

### Q2: 部署后样式错乱或资源加载失败？
**原因**：可能是资源路径配置问题。
**解决**：
- 检查 `vite.config.ts` 中的 `base` 配置。如果是部署在根目录，应为 `'/'`（默认）；如果是子目录，如 `http://site.com/app/`，则需设置为 `base: '/app/'`。

### Q3: 接口请求跨域 (CORS)？
**解决**：
- **开发环境**：在 `vite.config.ts` 中配置 `server.proxy`。
- **生产环境**：
    - 方案 A：后端服务器开启 CORS 允许跨域。
    - 方案 B：使用 Nginx 配置 `proxy_pass` 反向代理接口请求。
