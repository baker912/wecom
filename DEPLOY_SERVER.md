# 部署到自有腾讯云服务器指南

如果您拥有一台腾讯云服务器（CVM 或轻量应用服务器），可以通过以下步骤部署本项目。

## 准备工作

1.  **本地构建**：确保本地已经执行过 `npm run build`，并且生成了 `dist` 目录。
2.  **服务器环境**：建议操作系统为 CentOS 7.x 或 Ubuntu 20.04+。
3.  **连接工具**：推荐使用 Termius (Mac) 或 Xshell (Windows)，也可以直接使用腾讯云控制台的“登录”功能。

---

## 方案一：使用宝塔面板（最推荐，可视化操作）

如果不熟悉 Linux 命令，强烈建议安装宝塔面板。

### 1. 安装宝塔
登录服务器终端，执行安装命令（CentOS）：
```bash
yum install -y wget && wget -O install.sh https://download.bt.cn/install/install_6.0.sh && sh install.sh ed8484bec
```
安装完成后，会显示面板地址、用户名和密码。

### 2. 创建站点
1.  登录宝塔面板。
2.  点击左侧「网站」 -> 「添加站点」。
3.  **域名**：填写您的域名（如果没有域名，填写服务器公网 IP）。
4.  **根目录**：记录下生成的根目录路径（例如 `/www/wwwroot/您的IP`）。
5.  **PHP版本**：选择“纯静态”即可。

### 3. 上传文件
1.  点击站点列表右侧的「根目录」链接，进入文件管理。
2.  点击「上传」，将本地 `dist` 文件夹内的**所有文件**（index.html, assets文件夹等）上传。
3.  **注意**：不要上传 dist 文件夹本身，而是上传 dist 里面的内容。

### 4. 解决刷新 404 问题
1.  在网站设置中，点击「配置文件」或「伪静态」。
2.  添加以下 Nginx 配置：
    ```nginx
    location / {
        try_files $uri $uri/ /index.html;
    }
    ```
3.  保存即可访问。

---

## 方案二：手动 Nginx 部署（适合熟悉命令行的用户）

### 1. 安装 Nginx
```bash
# CentOS
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Ubuntu
sudo apt update
sudo apt install nginx -y
```

### 2. 上传文件
在本地终端使用 `scp` 命令上传（假设服务器 IP 为 `1.2.3.4`，用户为 `root`）：

```bash
# 确保在项目根目录下执行
scp -r dist/* root@1.2.3.4:/usr/share/nginx/html/
```
*注：如果不确定 Nginx 默认目录，通常是 `/usr/share/nginx/html` 或 `/var/www/html`。*

### 3. 配置 Nginx
编辑配置文件：
```bash
vim /etc/nginx/nginx.conf
# 或者在 /etc/nginx/conf.d/ 下新建一个配置文件
```

修改 `server` 块：
```nginx
server {
    listen 80;
    server_name _; # 或者您的域名

    root /usr/share/nginx/html; # 与上传目录一致
    index index.html;

    # 开启 gzip 压缩
    gzip on;
    gzip_min_length 1k;
    gzip_types text/plain application/javascript text/css;

    location / {
        try_files $uri $uri/ /index.html; # 关键配置
    }
}
```

### 4. 重启 Nginx
```bash
nginx -t  # 检查配置
systemctl reload nginx # 重载配置
```

---

## 方案三：使用不同端口共存（最推荐）

如果服务器 80 端口已被其他项目占用，可以使用 8080 或其他端口。

### 1. 准备新目录
在服务器上创建一个新目录，例如：
```bash
mkdir -p /usr/share/nginx/html/vin-project
```

### 2. 上传文件
将本地 `dist` 内容上传到新目录：
```bash
scp -r dist/* root@您的服务器IP:/usr/share/nginx/html/vin-project/
```

### 3. 配置 Nginx
在 `/etc/nginx/conf.d/` 下新建一个配置文件 `vin-project.conf`：
```bash
vim /etc/nginx/conf.d/vin-project.conf
```

写入以下内容：
```nginx
server {
    listen 8080;  # <--- 使用 8080 端口（可以改成 8081, 9000 等）
    server_name _;

    root /usr/share/nginx/html/vin-project;
    index index.html;

    # 开启 gzip
    gzip on;
    gzip_min_length 1k;
    gzip_types text/plain application/javascript text/css;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4. 开放防火墙（关键）
1.  **腾讯云安全组**：登录腾讯云控制台 -> 服务器 -> 安全组 -> 修改规则 -> 入站规则 -> 添加规则：
    *   端口范围：`8080`
    *   协议：`TCP`
    *   策略：`允许`
2.  **服务器防火墙**（如果开启了 firewalld）：
    ```bash
    firewall-cmd --zone=public --add-port=8080/tcp --permanent
    firewall-cmd --reload
    ```

### 5. 重启 Nginx
```bash
nginx -t
systemctl reload nginx
```

### 6. 访问
打开浏览器访问：`http://您的服务器IP:8080`

---

## 常见问题

1.  **访问显示 403 Forbidden**：
    - 检查目录权限：`chmod -R 755 /usr/share/nginx/html`
    - 检查 SELinux（如果开启）：`setenforce 0`（临时关闭测试）

2.  **页面白屏**：
    - 检查浏览器控制台报错。
    - 确保 `vite.config.ts` 中的 `base` 设置为 `'./'`。

3.  **无法访问**：
    - 检查腾讯云控制台的**安全组**设置，确保入站规则放行了 **80 端口**。
