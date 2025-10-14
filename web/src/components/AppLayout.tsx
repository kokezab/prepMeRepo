import { Layout, Menu, theme, Button, Space, Typography, Drawer, Grid } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useMemo, useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

const items = [
  {
    key: '/categories',
    label: <Link to="/categories">Categories</Link>,
  },
  {
    key: '/questions',
    label: <Link to="/questions">Questions</Link>,
  },
];

export default function AppLayout() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useFirebaseUser();
  const screens = Grid.useBreakpoint();
  const isMobile = useMemo(() => !screens.md, [screens]);
  const [open, setOpen] = useState(false);
  const selectedKeys = items
    .map((i) => i.key)
    .filter((k) => location.pathname.startsWith(k));

  return (
    <Layout className="min-h-100vh">
      <Header style={{ background: colorBgContainer }} className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="font-600 mr-24">PrepMe</div>
          {!isMobile && (
            <Menu
              mode="horizontal"
              selectedKeys={selectedKeys.length ? selectedKeys : ['/categories']}
              items={items}
            />
          )}
        </div>
        <div>
          <Space>
            {isMobile && (
              <Button
                icon={<MenuOutlined />}
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              />
            )}
            <Typography.Text>
              {user ? (user.displayName || user.email || 'Signed in') : ''}
            </Typography.Text>
            {user && (
              <Button
                size="small"
                onClick={async () => {
                  await signOut(auth);
                  navigate('/login', { replace: true });
                }}
              >
                Sign out
              </Button>
            )}
          </Space>
        </div>
      </Header>
      <Content className="p-24">
        <Outlet />
      </Content>

      <Drawer
        title="Navigation"
        placement="left"
        open={open}
        onClose={() => setOpen(false)}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={selectedKeys.length ? selectedKeys : ['/categories']}
          items={items}
          onClick={() => setOpen(false)}
        />
      </Drawer>
    </Layout>
  );
}
