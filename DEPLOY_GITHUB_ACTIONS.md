# 部署方案（标准）：GitHub Actions → 腾讯云服务器

本项目后续统一按此方式部署到服务器。

## 部署方式
- 触发方式（二选一）：
  - 手动触发 GitHub Actions（workflow_dispatch）
  - 推送到 `main` 且提交信息包含 `[deploy]`（用于“我明确要求这次要部署”的场景）
- 构建产物：`dist/`
- 部署目标：腾讯云服务器目录 `/var/www/wecom/`
- 部署机制：GitHub Actions 工作流通过 SSH 清空目标目录后，SCP 上传 `dist/*`

对应工作流文件：
- [deploy.yml](.github/workflows/deploy.yml)

## 前置条件（一次性配置）
在 GitHub 仓库配置以下 Actions Secrets（Settings → Secrets and variables → Actions）：
- `SERVER_HOST`：服务器 IP 或域名
- `SERVER_USER`：SSH 登录用户名
- `SERVER_SSH_KEY`：SSH 私钥（多行原样粘贴，包含 BEGIN/END）

服务器侧要求：
- `SERVER_USER` 对应账号可 SSH 登录（公钥已写入 `~/.ssh/authorized_keys`）
- 账号对 `/var/www/wecom/` 具备写权限

## 日常部署流程
1. 确认本地构建通过（推荐）：

```bash
npm install
npm run build
```

2. 提交并推送到 `main` 分支（不会自动部署）：

```bash
git add -A
git commit -m "your message"
git push origin main
```

3. 手动触发部署：
- GitHub 仓库 → Actions → `Deploy to Tencent Cloud Server` → Run workflow → 选择 `main` → Run workflow

4. 在 GitHub Actions 页面查看 `Deploy to Tencent Cloud Server` 工作流运行结果。

## 原则（必须遵守）
- 任何代码修改默认不触发部署
- 只有明确说明“需要部署/开始部署”时，才允许触发部署（手动触发或提交信息加 `[deploy]`）

## 工作流做了什么
1. 安装依赖并构建：
- `npm install`
- `npm run build`

2. 服务器预处理（SSH）：
- 创建目录：`mkdir -p /var/www/wecom/`
- 清空目录：`rm -rf /var/www/wecom/*`

3. 上传部署（SCP）：
- 上传 `dist/*` 到 `/var/www/wecom/`（去掉 dist 这一层）

## 常见问题
### 1) SSH 认证失败（exit code 1）
典型报错：`ssh: unable to authenticate, attempted methods [none publickey]`

排查点：
- GitHub Secrets 中 `SERVER_SSH_KEY / SERVER_USER / SERVER_HOST` 是否配置正确
- 私钥是否为无密码（无 passphrase）或是否与服务器 `authorized_keys` 对应
- 服务器账号是否允许 SSH 登录、是否被安全组/防火墙拦截

### 2) 构建失败
在 Actions 日志里查看 `Build Project` 步骤输出，按报错修复后重新手动触发部署。
