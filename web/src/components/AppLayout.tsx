import { Layout, Menu, theme, Button, Space, Typography, Drawer, Grid } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useMemo, useState, type ReactNode } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/redux/hooks';

const { Header, Content } = Layout;

export default function AppLayout() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useFirebaseUser();
  const guestMode = useAppSelector((s) => s.ui.guestMode);
  const screens = Grid.useBreakpoint();
  const isMobile = useMemo(() => !screens.md, [screens]);
  const [open, setOpen] = useState(false);
  const items = useMemo(() => {
    const inAuth = location.pathname.startsWith('/auth');
    const base = inAuth ? '/auth' : '';
    const baseItems = [
      !guestMode && {
        key: `${base}/categories`,
        label: <Link to={`${base}/categories`}>Categories</Link>,
      },
      {
        key: `${base}/questions`,
        label: <Link to={`${base}/questions`}>Questions</Link>,
      },
    ].filter(Boolean) as { key: string; label: ReactNode }[];
    return baseItems;
  }, [guestMode, location.pathname]);
  const selectedKeys = items
    .map((i) => i.key)
    .filter((k) => location.pathname.startsWith(k));
  const fallbackKey = items.length ? [items[0].key] : [];

  return (
    <Layout className="min-h-100vh">
      <Header style={{ background: colorBgContainer }} className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="font-600 mr-24">PrepMe</div>
          {!isMobile && (
            <Menu
              mode="horizontal"
              selectedKeys={selectedKeys.length ? selectedKeys : fallbackKey}
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
                  navigate('/auth/login', { replace: true });
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
          selectedKeys={selectedKeys.length ? selectedKeys : fallbackKey}
          items={items}
          onClick={() => setOpen(false)}
        />
      </Drawer>
    </Layout>
  );
}
