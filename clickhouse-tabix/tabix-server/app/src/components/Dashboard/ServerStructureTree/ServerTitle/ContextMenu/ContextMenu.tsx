import React, { useCallback } from 'react';
import { Menu } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { ServerStructure } from 'services';

export enum ServerAction {
  OpenProcesses = 1,
  OpenMetrics,
  OpenDbOverview,
  OpenServerOverview,
  OpenSqlHistory,
}

export const ContextMenuProps = {};

export interface ContextMenuProps {
  server: ServerStructure.Server;
  onContextMenuAction?: (action: ServerAction, server: ServerStructure.Server) => void;
}

export default function ContextMenu({ onContextMenuAction, server }: ContextMenuProps) {
  const onClick = useCallback(({ key, domEvent }: MenuInfo) => {
    domEvent.preventDefault();
    domEvent.stopPropagation();
    onContextMenuAction && ServerAction[key] && onContextMenuAction(+key as ServerAction, server);
  }, []);

  return (
    <Menu selectable={false} onClick={onClick}>
      <Menu.Item key={ServerAction.OpenProcesses}>工作进程</Menu.Item>
      <Menu.Item key={ServerAction.OpenDbOverview}>DB概览</Menu.Item>
      <Menu.Item key={ServerAction.OpenServerOverview}>实例概览</Menu.Item>
      <Menu.Item key={ServerAction.OpenMetrics}>服务指标</Menu.Item>
      <Menu.Item key={ServerAction.OpenSqlHistory}>历史SQL</Menu.Item>
    </Menu>
  );
}
