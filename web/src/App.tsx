import {Navigate, Route, Routes} from 'react-router-dom';
import GlobalMessageHost from "@/components/GlobalMessageHost";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import Questions from "@/pages/Questions";
import Categories from "@/pages/Categories.tsx";
import RequireAuth from "@/components/RequireAuth";
import Guest from "@/pages/Guest";
import RequireNonGuest from "@/components/RequireNonGuest";

export default function App() {
  return (
    <>
      <GlobalMessageHost />
      <Routes>
        {/* Root is guest entry */}
        <Route path="/" element={<Guest />} />

        {/* Guest-accessible Questions under root */}
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/questions" element={<Questions />} />
          </Route>
        </Route>

        {/* Authenticated app under /auth */}
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route element={<RequireNonGuest />}>
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route path="categories" element={<Categories />} />
                <Route path="questions" element={<Questions />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
