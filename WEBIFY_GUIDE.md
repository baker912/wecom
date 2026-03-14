# 腾讯云 Webify 部署详细指南

您已经拥有腾讯云 Webify 服务，现在只需要将本地代码上传到代码仓库（如 GitHub、Gitee 或 CODING），然后在 Webify 中关联即可。以下是详细步骤：

## 第一步：将本地代码上传到远程仓库

Webify 需要从代码仓库拉取您的代码。推荐使用 **Gitee (码云)**（国内速度快）或 **GitHub**。

### 1. 初始化本地仓库
打开终端（Terminal），在项目根目录下执行以下命令：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件到暂存区
git add .

# 提交代码到本地仓库
git commit -m "Initial commit"
```

> **注意**：如果执行 `git commit` 时提示“Please tell me who you are”，请先配置您的用户名和邮箱：
> ```bash
> git config --global user.email "you@example.com"
> git config --global user.name "Your Name"
> ```
> 然后再次执行 `git commit` 命令。

### 2. 创建远程仓库并推送
1.  登录 [Gitee](https://gitee.com/) 或 [GitHub](https://github.com/)。
2.  点击右上角的 `+` 号，选择“新建仓库”。
3.  输入仓库名称（例如 `customer-profile`），保持默认设置（不要勾选“初始化仓库”），点击创建。
4.  复制仓库地址（HTTPS 或 SSH）。
5.  在本地终端执行以下命令（将 URL 替换为您刚才复制的地址）：

```bash
# 关联远程仓库
git remote add origin https://gitee.com/your-username/customer-profile.git

# 推送代码到远程仓库
git push -u origin master
```

---

## 第二步：在 Webify 中创建应用

1.  登录 [腾讯云 Webify 控制台](https://console.cloud.tencent.com/webify)。
2.  点击 **“新建应用”** 按钮。
3.  **选择代码来源**：
    - 如果您使用 Gitee，选择 **Gitee**（可能需要授权）。
    - 如果您使用 GitHub，选择 **GitHub**。
    - 如果您使用 CODING，选择 **CODING**。
4.  **选择仓库**：
    - 在下拉列表中找到您刚才创建的 `customer-profile` 仓库。
    - 选择分支（通常是 `master` 或 `main`）。

---

## 第三步：配置构建参数（关键步骤）

Webify 会尝试自动检测项目类型，但为了确保成功，请检查以下配置：

1.  **应用名称**：自定义（例如 `customer-profile-app`）。
2.  **框架预设**：选择 **Vite** 或 **React**（推荐选择 **Vite**，因为本项目是基于 Vite 构建的）。
3.  **构建配置**：
    - **构建命令 (Build Command)**：输入 `npm install && npm run build`
    - **输出目录 (Output Directory)**：输入 `dist`
    - **Node.js 版本**：建议选择 `16.x` 或更高版本。

4.  **环境变量**（可选）：本项目暂无特殊环境变量，可跳过。

---

## 第四步：点击部署

1.  确认配置无误后，点击 **“部署应用”**。
2.  Webify 会自动开始：
    - 安装依赖 (`npm install`)
    - 构建项目 (`npm run build`)
    - 分发到 CDN 节点
3.  等待几分钟，部署状态变为 **“已完成”**。

---

## 第五步：访问与测试

1.  部署完成后，Webify 会提供一个默认的 **访问域名**（例如 `xxx.app.tcloudbase.com`）。
2.  点击该域名，即可访问您的客户画像系统。
3.  **自定义域名（可选）**：
    - 在应用详情页 -> “域名管理” -> “添加域名”。
    - 按照提示添加 CNAME 记录，即可使用您自己的域名访问。

## 常见问题排查

- **部署失败？**
    - 查看“构建日志”。
    - 常见错误是构建命令不对，确保是 `npm run build`。
    - 或者是输出目录不对，Vite 默认为 `dist`，Create-React-App 默认为 `build`。本项目请务必填写 `dist`。

- **页面 404？**
    - Webify 通常会自动处理 SPA 路由问题。如果遇到刷新 404，请在 Webify 应用设置中查找“重定向/伪静态”配置，将所有请求重定向到 `index.html`。
