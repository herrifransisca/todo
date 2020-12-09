import React from 'react';
import { Layout, PageHeader } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const { Header } = Layout;

const TopHeader = () => (
  <Header style={{ padding: 0 }} className="site-layout-background">
    <PageHeader onBack={() => null} title="Tasks" backIcon={<HomeOutlined />} />
  </Header>
);

export default TopHeader;
