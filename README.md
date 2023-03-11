# 插件名：Auto ImportExport File

## 简介
该插件可以支持自动遍历当前文件所在目录下的所有文件进行导入和导出操作。

如果需要扩展该功能，可以通过在配置中启用`depsCollect`参数，使其同样可以遍历所有的子目录。

可以帮助编程人员在编写代码的过程中提高效率，减少手动导入导出的时间，从而更好地集中精力去编写业务逻辑。

## 演示
**（递归导入导出）**
![在这里插入图片描述](https://img-blog.csdnimg.cn/a414d33bd2a94ac8bff6a6817980280c.gif)

（默认只导入导出同层文件/目录）
![在这里插入图片描述](https://img-blog.csdnimg.cn/a7cbd8f7993c43f4994541edfbdc808e.gif)

## 使用
该插件支持用户使用快捷键或在编辑器上下文菜单中调用。

### 快捷键：

- Win/Linux: **ctrl+alt+E**

- Mac: **command+shift+E**

## 配置
Auto ImportExport File支持用户自定义配置。

在插件配置中，可以通过修改depsCollect参数启用或禁用插件的自动遍历子目录功能。默认情况下，该参数为false，不会遍历全部文件夹内容添加导入导出。

## 其他
为了使用该插件，需要运行在VSCode1.69.0或更高版本。

如果您想为该插件做出贡献或提供有关此插件的反馈，请访问GitHub页面：https://github.com/winchesHe/vscode-plugin-auto-ImportExport ，感谢您的使用。
