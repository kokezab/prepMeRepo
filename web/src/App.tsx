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
        <Route path="/login" element={<Login />} />
        <Route path="/guest" element={<Guest />} />

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route element={<RequireNonGuest />}>
              <Route path="/categories" element={<Categories />} />
            </Route>
            <Route path="/questions" element={<Questions />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
