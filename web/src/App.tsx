import {Navigate, Route, Routes} from 'react-router-dom';
import GlobalMessageHost from "@/components/GlobalMessageHost";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import Questions from "@/pages/Questions";
import Categories from "@/pages/Categories.tsx";
import RequireAuth from "@/components/RequireAuth";

export default function App() {
  return (
    <>
      <GlobalMessageHost />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/categories" element={<Categories />} />
            <Route path="/questions" element={<Questions />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
