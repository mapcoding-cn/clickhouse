import React from 'react';
import { Menu } from 'antd';
import { MenuProps } from 'antd/lib/menu';

import { LogoutOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';

export enum ActionType {
  SignOut = 1,
  Settings,
  Help,
}

export default function ContextMenu(props: MenuProps) {
  return (
    <Menu theme="dark" mode="vertical" {...props}>
      <Menu.Item key={ActionType.Settings} disabled>
        <SettingOutlined />
        <span>设置</span>
      </Menu.Item>

      <Menu.Item key={ActionType.Help} disabled>
        <QuestionCircleOutlined />
        <span>帮助</span>
      </Menu.Item>

      <Menu.Item key={ActionType.SignOut}>
        <LogoutOutlined />
        <span>退出</span>
      </Menu.Item>
    </Menu>
  );
}
